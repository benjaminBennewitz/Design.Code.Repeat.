/* src/app/shared/contact-form/contact-form.validators.ts */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ContactTopic } from '../../core/models/studio.models';

export const ALLOWED_TOPICS: ReadonlySet<ContactTopic> = new Set([
  'website',
  'software',
  'design',
  'maintenance',
  'hosting',
  'other',
]); // Zulässige Kontaktgründe.

/**
 * Erstellt die bestehende Längenprüfung für getrimmte Formularwerte.
 * @param min Inklusive Mindestlänge des getrimmten Wertes.
 * @param max Inklusive Maximallänge des getrimmten Wertes.
 */
export function trimmedLength(min: number, max: number): ValidatorFn {
  return validateTrimmedLength.bind(null, min, max);
}

/**
 * Prüft die getrimmte Länge und liefert die bisherige Fehlerstruktur.
 * @param min Inklusive Mindestlänge.
 * @param max Inklusive Maximallänge.
 * @param control Zu prüfendes Formularfeld.
 */
function validateTrimmedLength(min: number, max: number, control: AbstractControl): ValidationErrors | null {
  /**
   * Als Text interpretierter Formularwert vor der Längenprüfung.
   */
  const value = typeof control.value === 'string' ? control.value : '';
  /**
   * Länge ohne äußeren Leerraum.
   */
  const length = value.trim().length;
  return length >= min && length <= max ? null : { trimmedLength: { min, max, actual: length } };
}

/**
 * Prüft einen Kontaktgrund gegen die bestehende Auswahlliste.
 * @param control Zu prüfendes Auswahlfeld.
 */
export function allowedTopic(control: AbstractControl): ValidationErrors | null {
  return ALLOWED_TOPICS.has(control.value as ContactTopic) ? null : { topic: true };
}
