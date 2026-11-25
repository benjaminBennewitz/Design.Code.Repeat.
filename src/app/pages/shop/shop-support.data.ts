/** @file Sprachabhängige Texte und Anfragearten des Produktsupports. */

export const SUPPORT_TYPES = ['bug', 'help', 'feature', 'order', 'download', 'other'] as const;
export type SupportType = typeof SUPPORT_TYPES[number];

/** Texte für Formular, Validierung und den lokalen E-Mail-Entwurf. */
export const SUPPORT_COPY = {
  de: {
    title: 'Hilfe & Support', intro: 'Ob Anwendung, Bestellung oder Verbesserungsidee – ich helfe dir persönlich weiter.', response: 'Rückmeldung innerhalb von 48 Stunden.',
    back: 'Zum Shop', form: 'Deine Anfrage', type: 'Art der Anfrage', product: 'Produkt', noProduct: 'Kein bestimmtes Produkt',
    types: { bug: 'Fehler melden', help: 'Hilfe zur Anwendung', feature: 'Verbesserung vorschlagen', order: 'Frage zur Bestellung', download: 'Hilfe beim Download', other: 'Sonstiges' },
    name: 'Name', email: 'E-Mail-Adresse', version: 'Produktversion', software: 'Programmversion', os: 'Betriebssystem', unknown: 'Nicht angegeben',
    order: 'Bestellnummer (falls vorhanden)', technical: 'Technische Informationen', message: 'Deine Nachricht', bugMessage: 'Was funktioniert nicht?',
    featureMessage: 'Dein Verbesserungsvorschlag', steps: 'Schritte zum Nachvollziehen', error: 'Fehlermeldung (falls vorhanden)',
    screenshot: 'Screenshots helfen bei der Fehlersuche. Du kannst sie im E-Mail-Programm anhängen.', privacyHint: 'Bitte keine vertraulichen Dokumente oder personenbezogenen Daten Dritter übermitteln.',
    privacy: 'Datenschutz', delivery: 'Deine Anfrage wird als E-Mail-Entwurf vorbereitet. Du sendest sie selbst über dein E-Mail-Programm ab.',
    prepare: 'E-Mail-Entwurf vorbereiten', open: 'E-Mail-Entwurf öffnen', ready: 'Dein Entwurf ist bereit. Es wurde noch keine Nachricht versendet.',
    required: 'Bitte fülle dieses Feld aus.', invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.', invalid: 'Bitte prüfe deine Eingabe.', optional: 'optional',
    contact: 'Alternativ erreichst du mich direkt per E-Mail.', subject: 'DCR//TOOLS Support', otherOs: 'Anderes',
  },
  en: {
    title: 'Help & support', intro: 'Whether you need help with a tool, an order or an improvement idea, I am here to help.', response: 'A response within 48 hours.',
    back: 'Back to shop', form: 'Your request', type: 'Request type', product: 'Product', noProduct: 'No specific product',
    types: { bug: 'Report a bug', help: 'Help using a tool', feature: 'Suggest an improvement', order: 'Order question', download: 'Download help', other: 'Other' },
    name: 'Name', email: 'Email address', version: 'Product version', software: 'Application version', os: 'Operating system', unknown: 'Not specified',
    order: 'Order number (if available)', technical: 'Technical information', message: 'Your message', bugMessage: 'What is not working?',
    featureMessage: 'Your improvement suggestion', steps: 'Steps to reproduce', error: 'Error message (if available)',
    screenshot: 'Screenshots help diagnose issues. You can attach them in your email application.', privacyHint: 'Do not send confidential documents or personal data belonging to other people.',
    privacy: 'Privacy', delivery: 'Your request is prepared as an email draft. Send it yourself using your email application.',
    prepare: 'Prepare email draft', open: 'Open email draft', ready: 'Your draft is ready. No message has been sent yet.',
    required: 'Please complete this field.', invalidEmail: 'Please enter a valid email address.', invalid: 'Please check your input.', optional: 'optional',
    contact: 'Alternatively, contact me directly by email.', subject: 'DCR//TOOLS Support', otherOs: 'Other',
  },
} as const;
