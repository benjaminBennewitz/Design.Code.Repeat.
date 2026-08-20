"""Sicherheits- und Validierungstests des öffentlichen Kontakt-Endpunkts."""

from __future__ import annotations

import json

from django.core import mail
from django.test import Client, TestCase, override_settings


@override_settings(
    CONTACT_RATE_LIMIT=8,
    CONTACT_RATE_WINDOW_SECONDS=3600,
    MAILERS={"default": {"BACKEND": "django.core.mail.backends.locmem.EmailBackend"}},
)
class ContactApiTests(TestCase):
    """Prüft die relevanten API-Grenzen statt nur den Happy Path."""

    def setUp(self) -> None:
        self.client = Client(enforce_csrf_checks=True)
        self.payload = {
            "name": "Max Mustermann",
            "email": "max@example.com",
            "company": "Example GmbH",
            "topic": "website",
            "message": "Ich möchte eine neue Unternehmenswebsite besprechen.",
        }

    def csrf_token(self) -> str:
        """Initialisiert und liefert einen echten CSRF-Token für Tests."""
        response = self.client.get("/api/csrf/")
        self.assertEqual(response.status_code, 200)
        return response.cookies["csrftoken"].value

    def post(self, payload: object, *, csrf: bool = True):
        """Sendet JSON mit optionalem CSRF-Header."""
        headers = {}
        if csrf:
            headers["HTTP_X_CSRFTOKEN"] = self.csrf_token()
        return self.client.post(
            "/api/contact/",
            data=json.dumps(payload),
            content_type="application/json",
            **headers,
        )

    def test_rejects_request_without_csrf(self) -> None:
        response = self.post(self.payload, csrf=False)
        self.assertEqual(response.status_code, 403)

    def test_accepts_valid_whitelisted_payload_and_sends_plain_mail(self) -> None:
        response = self.post(self.payload)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].reply_to, ["max@example.com"])
        self.assertNotIn("<html", mail.outbox[0].body.lower())

    def test_rejects_unknown_fields(self) -> None:
        response = self.post({**self.payload, "is_admin": "true"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "invalid-fields")

    def test_rejects_invalid_topic(self) -> None:
        response = self.post({**self.payload, "topic": "root"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "validation-error")

    def test_rejects_non_string_values(self) -> None:
        response = self.post({**self.payload, "message": ["unexpected"]})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "invalid-types")

    @override_settings(CONTACT_RATE_LIMIT=1)
    def test_rate_limits_repeated_requests(self) -> None:
        self.assertEqual(self.post(self.payload).status_code, 202)
        response = self.post(self.payload)
        self.assertEqual(response.status_code, 429)
        self.assertIn("Retry-After", response)
