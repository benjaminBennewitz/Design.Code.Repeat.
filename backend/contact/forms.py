"""Serverseitiges Whitelist-Schema für Kontaktanfragen."""

from django import forms

CONTACT_TOPICS = (
    ("website", "Website"),
    ("software", "Software"),
    ("design", "Design"),
    ("maintenance", "Maintenance"),
    ("hosting", "Hosting"),
    ("other", "Other"),
)


class ContactRequestForm(forms.Form):
    """Validiert ausschließlich die Felder, die das API akzeptieren darf."""

    name = forms.CharField(min_length=2, max_length=80, strip=True)
    email = forms.EmailField(max_length=254)
    company = forms.CharField(max_length=120, required=False, strip=True)
    topic = forms.ChoiceField(choices=CONTACT_TOPICS)
    message = forms.CharField(min_length=20, max_length=4000, strip=True)
