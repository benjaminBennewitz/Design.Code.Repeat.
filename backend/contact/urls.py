"""API-Routen der Contact-App."""

from django.urls import path

from . import views

urlpatterns = [
    path("csrf/", views.csrf, name="csrf"),
    path("contact/", views.contact, name="contact"),
]
