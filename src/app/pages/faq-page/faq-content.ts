/* src/app/pages/faq-page/faq-content.ts */
import { StudioContent, StudioLanguage, StudioService } from '../../core/models/studio.models';
import { managedServiceContent } from '../service-detail-page/managed/content/managed-service-content';
import { FaqGroup, SearchableFaq } from './faq.models';
import { normalizeFaqSearch } from './faq-search';

/**
 * Bündelt bestehende allgemeine Fragen und sämtliche Leistungs-FAQs ohne Textkopien.
 * @param content Zentrale Website-Inhalte der aktiven Sprache.
 * @param language Aktive Sprache der Website.
 */
export function buildFaqGroups(content: StudioContent, language: StudioLanguage): readonly FaqGroup[] {
  return [generalGroup(content, language), ...content.services.map(
    /**
     * Übernimmt den vollständigen FAQ-Bestand der einzelnen Leistungsseite.
     * @param service Einzelne Leistung aus den zentralen Website-Inhalten.
     */
    (service) => serviceGroup(service, language),
  )];
}

/**
 * Übernimmt die vorhandenen allgemeinen Fragen der Startseite.
 * @param content Zentrale Website-Inhalte der aktiven Sprache.
 * @param language Aktive Sprache der Website.
 */
function generalGroup(content: StudioContent, language: StudioLanguage): FaqGroup {
  /**
   * Themenüberschrift für die bereits vorhandenen allgemeinen Fragen.
   */
  const title = language === 'de' ? 'Allgemeines & Zusammenarbeit' : 'General questions & collaboration';
  return { id: 'general', title, icon: 'help', items: content.faq.map(
    /**
     * Übernimmt Frage, Antwort und das bestehende weiterführende Ziel.
     * @param item Allgemeine Frage der Startseite.
     * @param index Stabile Position der Frage im Themenblock.
     */
    (item, index) => searchableFaq('general', index, title, item.question, item.answer, item.relatedLink?.route ?? '/kontakt', item.relatedLink?.fragment),
  ) };
}

/**
 * Liest die eigenen FAQ-Einträge einer Leistung aus ihrer vorhandenen Datenquelle.
 * @param service Zentrale Definition der einzelnen Leistung.
 * @param language Aktive Sprache der Website.
 */
function serviceGroup(service: StudioService, language: StudioLanguage): FaqGroup {
  return { id: service.slug, title: service.title, icon: service.icon,
    items: (managedServiceContent(language, service.slug)?.faqs ?? []).map(
      /**
       * Bereitet den eigenen FAQ-Eintrag für Suche und direkte Service-Verlinkung vor.
       * @param item Frage und Antwort der Leistungsseite.
       * @param index Stabile Position der Frage im Themenblock.
       */
      (item, index) => searchableFaq(service.slug, index, service.title, item.title, item.text, `/leistungen/${service.slug}`),
    ) };
}

/**
 * Erstellt einen durchsuchbaren Eintrag mit stabiler Kennung und internem Link.
 * @param category Slug des zugehörigen Themenblocks.
 * @param index Stabile Position innerhalb der Fragefolge.
 * @param title Themenüberschrift für die Suche.
 * @param question Unveränderter Fragetext der Quelle.
 * @param answer Unveränderte Antwort der Quelle.
 * @param route Weiterführende interne Route.
 * @param fragment Optionales bestehendes Sprungziel innerhalb der Route.
 */
function searchableFaq(category: string, index: number, title: string, question: string, answer: string, route: string, fragment?: string): SearchableFaq {
  return { id: `${category}-${index}`, question, answer, route, fragment, searchText: normalizeFaqSearch(`${title} ${question} ${answer}`) };
}
