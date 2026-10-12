/* src/app/shared/contact-form/contact-form.factory.ts */
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactTopic } from '../../core/models/studio.models';
import { allowedTopic, trimmedLength } from './contact-form.validators';

/** Erstellt die typisierte Feldgruppe mit den vorhandenen Formularregeln. */
export function createContactForm() {
  return new FormGroup({
    name: createNameControl(),
    email: createEmailControl(),
    company: createCompanyControl(),
    topic: createTopicControl(),
    message: createMessageControl(),
    privacy: createPrivacyControl(),
  });
}

/** Erstellt das verpflichtende Namensfeld mit unveränderten Längengrenzen. */
function createNameControl(): FormControl<string> {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(80), trimmedLength(2, 80)],
  });
}

/** Erstellt das verpflichtende E-Mail-Feld mit unveränderter Formatprüfung. */
function createEmailControl(): FormControl<string> {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email, Validators.maxLength(254)],
  });
}

/** Erstellt das optionale Unternehmensfeld mit seiner bestehenden Obergrenze. */
function createCompanyControl(): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: [Validators.maxLength(120)] });
}

/** Erstellt die verpflichtende Auswahl eines zulässigen Kontaktgrunds. */
function createTopicControl(): FormControl<ContactTopic | ''> {
  return new FormControl<ContactTopic | ''>('', { nonNullable: true, validators: [Validators.required, allowedTopic] });
}

/** Erstellt das verpflichtende Nachrichtenfeld mit unveränderten Längengrenzen. */
function createMessageControl(): FormControl<string> {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(4000), trimmedLength(20, 4000)],
  });
}

/** Erstellt die erforderliche Bestätigung der Datenschutzhinweise. */
function createPrivacyControl(): FormControl<boolean> {
  return new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] });
}

export type ContactForm = ReturnType<typeof createContactForm>;
export type ContactFormField = keyof ContactForm['controls'];
export type ContactFormValue = ReturnType<ContactForm['getRawValue']>;
