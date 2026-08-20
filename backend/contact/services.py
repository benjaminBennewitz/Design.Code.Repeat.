"""Seiteneffektfreie Hilfslogik und Mailversand der Contact-App."""

from __future__ import annotations

import hashlib
import ipaddress
from dataclasses import dataclass

from django.conf import settings
from django.core.cache import cache
from django.core.mail import EmailMessage
from django.http import HttpRequest


@dataclass(frozen=True, slots=True)
class RateLimitResult:
    """Ergebnis einer festen Rate-Limit-Zeitspanne."""

    allowed: bool
    retry_after: int


def client_ip(request: HttpRequest) -> str:
    """Ermittelt die Client-IP ohne ungeprüftes Vertrauen in Proxy-Header."""
    raw_ip = request.META.get("REMOTE_ADDR", "")

    if settings.CONTACT_TRUST_X_REAL_IP:
        raw_ip = request.META.get("HTTP_X_REAL_IP", raw_ip)

    try:
        return str(ipaddress.ip_address(raw_ip))
    except ValueError:
        return "unknown"


def check_rate_limit(identifier: str) -> RateLimitResult:
    """Begrenzt Kontaktanfragen pro Identifier in einem festen Zeitfenster."""
    digest = hashlib.sha256(identifier.encode("utf-8", errors="ignore")).hexdigest()
    key = f"contact-rate:{digest}"
    window = settings.CONTACT_RATE_WINDOW_SECONDS
    limit = settings.CONTACT_RATE_LIMIT

    if cache.add(key, 1, timeout=window):
        return RateLimitResult(allowed=True, retry_after=window)

    try:
        current = cache.incr(key)
    except ValueError:
        cache.set(key, 1, timeout=window)
        current = 1

    return RateLimitResult(allowed=current <= limit, retry_after=window)


def send_contact_email(cleaned_data: dict[str, str]) -> None:
    """Versendet ausschließlich Plain-Text und verwendet keine Nutzereingabe im Betreff."""
    topic = cleaned_data["topic"]
    topic_labels = {
        "website": "Website",
        "software": "Software",
        "design": "Design",
        "maintenance": "Wartung",
        "hosting": "Hosting / E-Mail",
        "other": "Sonstiges",
    }
    company = cleaned_data.get("company") or "—"
    body = "\n".join(
        (
            "Neue Anfrage über design-code-repeat.de",
            "",
            f"Thema: {topic_labels.get(topic, 'Sonstiges')}",
            f"Name: {cleaned_data['name']}",
            f"E-Mail: {cleaned_data['email']}",
            f"Unternehmen: {company}",
            "",
            "Nachricht:",
            cleaned_data["message"],
        )
    )

    message = EmailMessage(
        subject=f"[DCR Studio] Neue Anfrage: {topic_labels.get(topic, 'Sonstiges')}",
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_RECIPIENT],
        reply_to=[cleaned_data["email"]],
    )
    message.send(using="default")
