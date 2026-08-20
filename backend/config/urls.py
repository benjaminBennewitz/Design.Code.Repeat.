"""URL-Konfiguration des Studio-Backends."""

from django.urls import include, path

urlpatterns = [
    path("api/", include("contact.urls")),
]
