"""HTTP-Endpunkte für CSRF-Bootstrap und Kontaktanfragen."""

from __future__ import annotations

import json
import logging
from json import JSONDecodeError

from django.core.exceptions import RequestDataTooBig
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .forms import ContactRequestForm
from .services import check_rate_limit, client_ip, send_contact_email

logger = logging.getLogger(__name__)
ALLOWED_FIELDS = frozenset({"name", "email", "company", "topic", "message"})
MAX_BODY_BYTES = 12 * 1024


@require_GET
@ensure_csrf_cookie
def csrf(request: HttpRequest) -> JsonResponse:
    """Setzt den CSRF-Cookie, den Angular für mutierende Requests benötigt."""
    return JsonResponse({"detail": "csrf-ready"})


@require_POST
def contact(request: HttpRequest) -> JsonResponse:
    """Validiert, limitiert und versendet eine Kontaktanfrage ohne Persistenz."""
    rate_limit = check_rate_limit(client_ip(request))
    if not rate_limit.allowed:
        response = JsonResponse({"detail": "rate-limit"}, status=429)
        response["Retry-After"] = str(rate_limit.retry_after)
        return response

    if request.content_type != "application/json":
        return JsonResponse({"detail": "unsupported-media-type"}, status=415)

    content_length = request.META.get("CONTENT_LENGTH")
    if content_length:
        try:
            if int(content_length) > MAX_BODY_BYTES:
                return JsonResponse({"detail": "payload-too-large"}, status=413)
        except ValueError:
            return JsonResponse({"detail": "invalid-content-length"}, status=400)

    try:
        body = request.body
    except RequestDataTooBig:
        return JsonResponse({"detail": "payload-too-large"}, status=413)

    if len(body) > MAX_BODY_BYTES:
        return JsonResponse({"detail": "payload-too-large"}, status=413)

    try:
        payload = json.loads(body)
    except (JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "invalid-json"}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"detail": "invalid-payload"}, status=400)

    payload_keys = set(payload)
    if payload_keys != ALLOWED_FIELDS:
        return JsonResponse({"detail": "invalid-fields"}, status=400)

    if any(not isinstance(payload[field], str) for field in ALLOWED_FIELDS):
        return JsonResponse({"detail": "invalid-types"}, status=400)

    form = ContactRequestForm(payload)
    if not form.is_valid():
        return JsonResponse(
            {
                "detail": "validation-error",
                "fields": sorted(form.errors.as_data().keys()),
            },
            status=400,
        )

    try:
        send_contact_email(form.cleaned_data)
    except Exception:
        # Keine personenbezogenen Inhalte in Logs schreiben.
        logger.exception("Contact email delivery failed.")
        return JsonResponse({"detail": "delivery-failed"}, status=503)

    return JsonResponse({"detail": "accepted"}, status=202)


def csrf_failure(request: HttpRequest, reason: str = "") -> JsonResponse:
    """Gibt bei CSRF-Fehlern keine internen Details an den Client weiter."""
    logger.warning("CSRF validation failed for contact API request.")
    return JsonResponse({"detail": "csrf-failed"}, status=403)
