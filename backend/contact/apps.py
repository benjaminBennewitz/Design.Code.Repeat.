"""App-Konfiguration für das Kontakt-API."""

from django.apps import AppConfig


class ContactConfig(AppConfig):
    """Registriert die bewusst kleine Contact-App."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "contact"
