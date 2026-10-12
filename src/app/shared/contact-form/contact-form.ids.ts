/* src/app/shared/contact-form/contact-form.ids.ts */
const FIELD_SUFFIXES = {
  // Bestehende Endungen der Feld-, Label- und Fehler-IDs.
  website: 'website-field',
  name: 'name',
  nameError: 'name-error',
  email: 'email',
  emailError: 'email-error',
  company: 'company',
  companyError: 'company-error',
  topic: 'topic',
  topicError: 'topic-error',
  message: 'message',
  messageError: 'message-error',
  messageCounter: 'message-counter',
  privacy: 'privacy',
  privacyInfo: 'privacy-info',
  privacyError: 'privacy-error',
};

export type ContactFieldIds = { readonly [Key in keyof typeof FIELD_SUFFIXES]: string };

/**
 * Erzeugt die bisherigen IDs für eine Formularinstanz.
 * @param idPrefix Instanzpräfix vor der Bereinigung nicht erlaubter Zeichen.
 */
export function createContactFieldIds(idPrefix: string): ContactFieldIds {
  /**
   * Für DOM-IDs bereinigter Instanzpräfix.
   */
  const prefix = idPrefix.replace(/[^a-zA-Z0-9_-]/g, '-');
  return Object.fromEntries(Object.entries(FIELD_SUFFIXES).map(fieldId.bind(null, prefix))) as ContactFieldIds;
}

/**
 * Verbindet eine vorhandene Feldendung mit dem Instanzpräfix.
 * @param prefix Bereinigter Instanzpräfix.
 * @param entry Feldname und zugehörige ID-Endung.
 */
function fieldId(prefix: string, entry: [string, string]): [string, string] {
  return [entry[0], `${prefix}-${entry[1]}`];
}
