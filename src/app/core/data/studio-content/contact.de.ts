/* src/app/core/data/studio-content/contact.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Kontaktseite und Formulartexte.
 */
export const DE_CONTACT_CONTENT: Pick<StudioContent, 'contactPage' | 'contactForm'> = {
  contactPage: {
    seo: {
      title: 'Kontakt | Design. Code. Repeat.',
      description: 'Projektanfrage für Webentwicklung, Softwareentwicklung, UI/UX, Wartung oder Managed Hosting.',
      keywords: ['Webentwickler Kontakt', 'Softwareentwicklung Anfrage', 'Managed Hosting Kontakt'],
    },
    heading: {
      eyebrow: 'contact.request',
      title: 'Was soll besser funktionieren?',
      text: '',
    },
    directTitle: 'Lieber direkt per E-Mail?',
    directText: 'Kein Problem. Sensible Unterlagen bitte trotzdem nicht unverschlüsselt im Erstkontakt mitsenden.',
    emailLabel: 'E-Mail senden',
    email: 'kontakt@design-code-repeat.de',
  },
  contactForm: {
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    companyLabel: 'Unternehmen / Organisation (optional)',
    topicLabel: 'Worum geht es?',
    messageLabel: 'Kurzbeschreibung',
    privacyLabel: 'Datenschutzhinweise bestätigen',
    submitLabel: 'Anfrage senden',
    sendingLabel: 'Wird gesendet …',
    requiredHint: 'Mit * markierte Felder sind erforderlich.',
    privacyTextBefore: 'Ich habe die ',
    privacyLinkLabel: 'Datenschutzhinweise',
    privacyTextAfter: ' zur Verarbeitung meiner Angaben für die Bearbeitung der Anfrage zur Kenntnis genommen.',
    privacyAriaLabel: 'Datenschutzhinweise bestätigen',
    topics: [
      { value: 'website', label: 'Website / Webpräsenz' },
      { value: 'software', label: 'Software / internes Tool' },
      { value: 'design', label: 'UI / UX / Design' },
      { value: 'maintenance', label: 'Wartung / Weiterentwicklung' },
      { value: 'hosting', label: 'Managed Hosting / E-Mail' },
      { value: 'other', label: 'Sonstiges' },
    ],
    errors: {
      required: 'Dieses Feld ist erforderlich.',
      nameLength: 'Bitte gib mindestens 2 und höchstens 80 Zeichen ein.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      companyLength: 'Bitte verwende höchstens 120 Zeichen.',
      messageLength: 'Bitte beschreibe dein Anliegen mit mindestens 20 Zeichen.',
      messageMaxLength: 'Die Nachricht darf höchstens 4000 Zeichen enthalten.',
      privacy: 'Die Datenschutzhinweise müssen bestätigt werden.',
      validation: 'Die Anfrage enthält ungültige Angaben. Bitte prüfe das Formular und versuche es erneut.',
      csrf: 'Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte lade die Seite neu und versuche es erneut.',
      payloadTooLarge: 'Die Anfrage ist zu umfangreich. Bitte kürze deine Nachricht und versuche es erneut.',
      rateLimit: 'Es wurden zu viele Anfragen gesendet. Bitte warte einen Moment und versuche es später erneut.',
      unavailable:
        'Der Kontaktservice ist vorübergehend nicht verfügbar. Bitte versuche es später erneut oder nutze die direkte E-Mail-Adresse.',
      network:
        'Der Kontaktservice ist momentan nicht erreichbar. Bitte prüfe deine Verbindung oder versuche es später erneut.',
      server:
        'Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es später erneut oder nutze die direkte E-Mail-Adresse.',
      tooFast: 'Das Formular wurde ungewöhnlich schnell abgesendet. Bitte prüfe deine Angaben und versuche es erneut.',
    },
  },
};
