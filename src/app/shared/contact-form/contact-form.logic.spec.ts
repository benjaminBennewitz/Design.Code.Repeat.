/* src/app/shared/contact-form/contact-form.logic.spec.ts */
import { ContactApiError } from '../../core/services/contact-api.service';
import { STUDIO_TRANSLATIONS } from '../../core/data/studio-content';
import { apiErrorMessage, fieldErrorMessage } from './contact-form.errors';
import { ContactFormValue, createContactForm } from './contact-form.factory';
import { createContactFieldIds } from './contact-form.ids';
import { createContactPayload } from './contact-form.payload';

/** Registriert Prüfungen für Payload, IDs, Feldregeln und lokalisierte Fehler. */
function registerFormLogicTests(): void {
  it('normalisiert ausschließlich die vier API-Felder und erhält deutsche Metadaten', expectGermanPayload);
  it('formatiert englische Metadaten ohne leere Unternehmenszeile', expectEnglishPayload);
  it('verwirft nicht freigegebene Kontaktgründe', expectUnknownTopic);
  it('erhält die Feld-ID-Endungen und bereinigt den Instanzpräfix', expectFieldIds);
  it('prüft getrimmte Mindestlängen sowie unveränderte Feldobergrenzen', expectFieldBoundaries);
  it('verlangt einen freigegebenen Kontaktgrund und die Datenschutzbestätigung', expectRequiredSelections);
  it('erhält die Priorität der Nachrichtenfehler', expectMessageErrors);
  it('ordnet API-Fehler den bestehenden lokalisierten Meldungen zu', expectApiErrors);
}

/** Liefert gültige Rohwerte mit äußerem Leerraum für die Normalisierungsprüfung. */
function validFormValues(): ContactFormValue {
  return {
    name: '  Max Muster  ',
    email: ' Max@Example.com ',
    company: '  Muster GmbH  ',
    topic: 'website',
    message: '  Eine ausreichend lange Testnachricht.  ',
    privacy: true,
  };
}

/** Prüft die exakte deutsche Nachricht und die unveränderte Feld-Whitelist. */
function expectGermanPayload(): void {
  /**
   * Normalisierter Body mit einem unverändert übertragenen Honeypot-Wert.
   */
  const payload = createContactPayload(validFormValues(), {
    language: 'de',
    website: 'unverändert',
    topics: [{ value: 'website', label: 'Webentwicklung' }],
  });
  expect(payload).toEqual({
    name: 'Max Muster',
    email: 'max@example.com',
    website: 'unverändert',
    message: 'Thema: Webentwicklung\nUnternehmen: Muster GmbH\n\nEine ausreichend lange Testnachricht.',
  });
  expect(Object.keys(payload!).sort()).toEqual(['email', 'message', 'name', 'website']);
}

/** Prüft den englischen Topic-Fallback und das Auslassen leerer Unternehmenswerte. */
function expectEnglishPayload(): void {
  /**
   * Englischer Body ohne Unternehmenswert und ohne passenden Topic-Label-Eintrag.
   */
  const payload = createContactPayload(
    { ...validFormValues(), company: ' ' },
    { language: 'en', website: '', topics: [] },
  );
  expect(payload?.message).toBe('Topic: website\n\nEine ausreichend lange Testnachricht.');
}

/** Prüft die kontrollierte Ablehnung einer nicht unterstützten Topic-Auswahl. */
function expectUnknownTopic(): void {
  expect(
    createContactPayload({ ...validFormValues(), topic: '' }, { language: 'de', website: '', topics: [] }),
  ).toBeNull();
}

/** Prüft die bestehenden Feld-IDs und unterschiedliche Formularinstanzen. */
function expectFieldIds(): void {
  /**
   * Von Leerraum und Schrägstrich bereinigter Formularpräfix.
   */
  const ids = createContactFieldIds('footer / contact');
  expect(ids.name).toBe('footer---contact-name');
  expect(ids.website).toBe('footer---contact-website-field');
  expect(ids.messageCounter).toBe('footer---contact-message-counter');
  expect(ids.privacyInfo).toBe('footer---contact-privacy-info');
  expect(createContactFieldIds('home').name).not.toBe(createContactFieldIds('footer').name);
}

/** Prüft, dass Leerraum Mindestlängen nicht erfüllt und Rohwerte weiterhin begrenzt sind. */
function expectFieldBoundaries(): void {
  /**
   * Feldgruppe mit unveränderten Längen- und Formatregeln.
   */
  const form = createContactForm();
  form.controls.name.setValue('  A  ');
  expect(form.controls.name.hasError('trimmedLength')).toBe(true);
  form.controls.name.setValue('A'.repeat(81));
  expect(form.controls.name.hasError('maxlength')).toBe(true);
  form.controls.message.setValue(' '.repeat(20));
  expect(form.controls.message.hasError('trimmedLength')).toBe(true);
  form.controls.company.setValue('A'.repeat(121));
  expect(form.controls.company.hasError('maxlength')).toBe(true);
}

/** Prüft Topic-Whitelist und verpflichtende Datenschutzbestätigung unabhängig voneinander. */
function expectRequiredSelections(): void {
  /**
   * Feldgruppe mit ansonsten gültigen Pflichtangaben.
   */
  const form = createContactForm();
  form.setValue({ ...validFormValues(), email: 'max@example.com' });
  expect(form.valid).toBe(true);
  form.controls.topic.setValue('');
  expect(form.controls.topic.hasError('topic')).toBe(true);
  form.controls.topic.setValue('website');
  form.controls.privacy.setValue(false);
  expect(form.controls.privacy.hasError('required')).toBe(true);
}

/** Prüft Pflicht-, Maximal- und Mindestlängenmeldungen in der bisherigen Reihenfolge. */
function expectMessageErrors(): void {
  /**
   * Nachrichtenfeld mit gezielt wechselnden Validierungsfehlern.
   */
  const control = createContactForm().controls.message;
  control.setErrors({ required: true, maxlength: true });
  expect(fieldErrorMessage('message', control, STUDIO_TRANSLATIONS.de.contactForm.errors)).toBe(
    STUDIO_TRANSLATIONS.de.contactForm.errors.required,
  );
  control.setErrors({ maxlength: true, trimmedLength: true });
  expect(fieldErrorMessage('message', control, STUDIO_TRANSLATIONS.de.contactForm.errors)).toBe(
    STUDIO_TRANSLATIONS.de.contactForm.errors.messageMaxLength,
  );
}

/** Prüft bekannte Fehlerklassen und den neutralen Fallback für unbekannte Fehler. */
function expectApiErrors(): void {
  /**
   * Vorhandene deutsche Fehlermeldungen der Formularoberfläche.
   */
  const errors = STUDIO_TRANSLATIONS.de.contactForm.errors;
  expect(apiErrorMessage(new ContactApiError('payload-too-large'), errors)).toBe(errors.payloadTooLarge);
  expect(apiErrorMessage(new ContactApiError('rate-limit'), errors)).toBe(errors.rateLimit);
  expect(apiErrorMessage(new ContactApiError('csrf'), errors)).toBe(errors.csrf);
  expect(apiErrorMessage(new Error('Test error'), errors)).toBe(errors.server);
}

describe('Kontaktformular-Logik', registerFormLogicTests);
