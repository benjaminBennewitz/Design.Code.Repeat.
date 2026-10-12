/* src/app/shared/contact-form/contact-form.payload.ts */
import { ContactTopic, ContactTopicOption, StudioLanguage } from '../../core/models/studio.models';
import { ContactRequest } from '../../core/services/contact-api.service';
import { ContactFormValue } from './contact-form.factory';
import { ALLOWED_TOPICS } from './contact-form.validators';

/** Sprach- und Instanzkontext der bestehenden Payload-Erstellung. */
export interface PayloadContext {
  readonly website: string;
  readonly language: StudioLanguage;
  readonly topics: readonly ContactTopicOption[];
}

/**
 * Erzeugt den bestehenden vier Felder umfassenden API-Body.
 * @param raw Unverarbeitete Formularwerte.
 * @param context Sprache, Kontaktgründe und instanzgebundener Honeypot-Wert.
 */
export function createContactPayload(raw: ContactFormValue, context: PayloadContext): ContactRequest | null {
  if (!ALLOWED_TOPICS.has(raw.topic as ContactTopic)) return null;
  /**
   * Lokalisierte Bezeichnung des ausgewählten Kontaktgrunds.
   */
  const topicLabel = resolveTopicLabel(raw.topic, context.topics);
  return {
    name: raw.name.trim(),
    email: raw.email.trim().toLowerCase(),
    message: `${messageMetadata(raw, context, topicLabel).join('\n')}\n\n${raw.message.trim()}`,
    website: context.website,
  };
}

/**
 * Liefert die lokalisierte Bezeichnung oder den bisherigen Topic-Fallback.
 * @param topic Ausgewählter Kontaktgrund.
 * @param topics Lokalisierte Auswahlliste.
 */
function resolveTopicLabel(topic: string, topics: readonly ContactTopicOption[]): string {
  return (
    topics.find(
      /**
       * Findet die zum Formularwert passende lokalisierte Option.
       * @param option Kontaktgrund der Auswahlliste.
       */
      (option) => option.value === topic,
    )?.label ?? topic
  );
}

/**
 * Formatiert Kontaktgrund und optionales Unternehmen im bestehenden Nachrichtentext.
 * @param raw Unverarbeitete Formularwerte.
 * @param context Sprache und lokalisierte Kontaktgründe.
 * @param topicLabel Lokalisierte Bezeichnung des Kontaktgrunds.
 */
function messageMetadata(raw: ContactFormValue, context: PayloadContext, topicLabel: string): string[] {
  return [
    `${context.language === 'de' ? 'Thema' : 'Topic'}: ${topicLabel}`,
    raw.company.trim() ? `${context.language === 'de' ? 'Unternehmen' : 'Company'}: ${raw.company.trim()}` : '',
  ].filter(Boolean);
}
