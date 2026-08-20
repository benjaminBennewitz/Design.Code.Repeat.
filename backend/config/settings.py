"""Sicherheitsorientierte Django-Konfiguration für das Studio-Kontakt-API."""

from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(name: str, default: bool = False) -> bool:
    """Liest einen booleschen Environment-Wert mit expliziter Whitelist."""
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    """Liest kommaseparierte Environment-Werte ohne leere Einträge."""
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


def env_positive_int(name: str, default: int) -> int:
    """Liest einen strikt positiven Integer und bricht bei Fehlkonfiguration früh ab."""
    raw_value = os.getenv(name, str(default))
    try:
        value = int(raw_value)
    except ValueError as error:
        raise RuntimeError(f"{name} must be a positive integer.") from error

    if value <= 0:
        raise RuntimeError(f"{name} must be a positive integer.")

    return value


DEBUG = env_bool("DJANGO_DEBUG", False)
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "")

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "development-only-change-me"
    else:
        raise RuntimeError("DJANGO_SECRET_KEY must be configured when DJANGO_DEBUG is false.")

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1" if DEBUG else "")
if not ALLOWED_HOSTS:
    raise RuntimeError("DJANGO_ALLOWED_HOSTS must contain the production host names.")

CSRF_TRUSTED_ORIGINS = env_list("DJANGO_CSRF_TRUSTED_ORIGINS")

INSTALLED_APPS = [
    "contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Das Kontakt-API persistiert bewusst keine Anfrage. SQLite wird nur als schlanke
# Django-Systemdatenbank vorgehalten und kann später entfernt/ersetzt werden.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
USE_TZ = True
TIME_ZONE = "Europe/Berlin"
LANGUAGE_CODE = "de-de"

# Request-Härtung. Zusätzlich sollte der Reverse Proxy die Body-Größe begrenzen.
DATA_UPLOAD_MAX_MEMORY_SIZE = 16 * 1024
DATA_UPLOAD_MAX_NUMBER_FIELDS = 20

# Angular muss den CSRF-Cookie lesen können, um ihn als X-CSRFToken zu senden.
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_NAME = "csrftoken"

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", not DEBUG)
SECURE_HSTS_SECONDS = int(os.getenv("DJANGO_SECURE_HSTS_SECONDS", "0"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", False)
SECURE_HSTS_PRELOAD = env_bool("DJANGO_SECURE_HSTS_PRELOAD", False)

# Nur aktivieren, wenn der vorgeschaltete Proxy X-Forwarded-Proto garantiert
# überschreibt. Falsche Konfiguration kann die HTTPS-/CSRF-Erkennung schwächen.
if env_bool("DJANGO_TRUST_PROXY_PROTO", False):
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Rate Limiting nutzt standardmäßig pro Prozess den lokalen Cache. In Produktion
# wird Redis empfohlen, damit mehrere Worker denselben Zähler verwenden.
redis_url = os.getenv("DJANGO_REDIS_URL", "")
if redis_url:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": redis_url,
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "dcr-studio-contact",
        }
    }

CONTACT_RATE_LIMIT = env_positive_int("CONTACT_RATE_LIMIT", 8)
CONTACT_RATE_WINDOW_SECONDS = env_positive_int("CONTACT_RATE_WINDOW_SECONDS", 3600)
CONTACT_TRUST_X_REAL_IP = env_bool("CONTACT_TRUST_X_REAL_IP", False)
CONTACT_RECIPIENT = os.getenv("CONTACT_RECIPIENT", "kontakt@bennewitz.de" if DEBUG else "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "website@localhost" if DEBUG else "")

if not CONTACT_RECIPIENT or not DEFAULT_FROM_EMAIL:
    raise RuntimeError("CONTACT_RECIPIENT and DEFAULT_FROM_EMAIL must be configured outside development mode.")

# Django 6.1 Mailers. Im Development-Modus landet Mail bewusst in der Konsole.
if DEBUG and not os.getenv("SMTP_HOST"):
    MAILERS = {
        "default": {
            "BACKEND": "django.core.mail.backends.console.EmailBackend",
        }
    }
else:
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")

    if not smtp_host:
        raise RuntimeError("SMTP_HOST must be configured outside development mode.")

    smtp_use_tls = env_bool("SMTP_USE_TLS", True)
    smtp_use_ssl = env_bool("SMTP_USE_SSL", False)
    if smtp_use_tls and smtp_use_ssl:
        raise RuntimeError("SMTP_USE_TLS and SMTP_USE_SSL cannot both be enabled.")

    MAILERS = {
        "default": {
            "BACKEND": "django.core.mail.backends.smtp.EmailBackend",
            "OPTIONS": {
                "host": smtp_host,
                "port": int(os.getenv("SMTP_PORT", "587")),
                "use_tls": smtp_use_tls,
                "use_ssl": smtp_use_ssl,
                "username": smtp_username,
                "password": smtp_password,
                "timeout": int(os.getenv("SMTP_TIMEOUT", "10")),
            },
        }
    }

CSRF_FAILURE_VIEW = "contact.views.csrf_failure"
