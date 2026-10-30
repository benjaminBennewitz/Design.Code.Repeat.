/* src/app/shared/contact-form/contact-form.errors.ts */
import { AbstractControl } from '@angular/forms';
import { StudioContent } from '../../core/models/studio.models';
import { ContactApiError, ContactApiErrorCode } from '../../core/services/contact-api.service';
import { ContactFormField } from './contact-form.factory';

type ErrorTexts = StudioContent['contactForm']['errors'];
const API_ERROR_FIELDS: Partial<Record<ContactApiErrorCode, keyof ErrorTexts>> = {
  // Zuordnung der bisherigen API-Fehlertexte.
  validation: 'validation',
  csrf: 'csrf',
  'payload-too-large': 'payloadTooLarge',
  'rate-limit': 'rateLimit',
  unavailable: 'unavailable',
  network: 'network',
  timeout: 'timeout',
}; // Zuordnung der Validierungsfehler zu Formularfeldern.

/**
 * Liefert den bisherigen lokalisierten Fehlertext für ein sichtbares Feldproblem.
 * @param field Name des fehlerhaften Formularfelds.
 * @param control Formularfeld mit den aktuellen Validierungsfehlern.
 * @param errors Lokalisierte Formularfehlertexte.
 */
export function fieldErrorMessage(field: ContactFormField, control: AbstractControl, errors: ErrorTexts): string {
  switch (field) {
    case 'email':
      return errors.email;
    case 'name':
      return control.hasError('required') ? errors.required : errors.nameLength;
    case 'company':
      return errors.companyLength;
    case 'topic':
      return errors.required;
    case 'message':
      return messageErrorMessage(control, errors);
    default:
      return errors.privacy;
  }
}

/**
 * Liefert die bestehende Priorität der Nachrichtenfehler.
 * @param control Nachrichtenfeld mit den aktuellen Validierungsfehlern.
 * @param errors Lokalisierte Formularfehlertexte.
 */
function messageErrorMessage(control: AbstractControl, errors: ErrorTexts): string {
  if (control.hasError('required')) return errors.required;
  return control.hasError('maxlength') ? errors.messageMaxLength : errors.messageLength;
}

/**
 * Übersetzt API-Fehler in die vorhandenen lokalisierten Texte.
 * @param error Fehler des Kontakt-Submits oder der anschließenden Navigation.
 * @param errors Lokalisierte Formularfehlertexte.
 */
export function apiErrorMessage(error: unknown, errors: ErrorTexts): string {
  return errors[error instanceof ContactApiError ? (API_ERROR_FIELDS[error.code] ?? 'server') : 'server'];
}
