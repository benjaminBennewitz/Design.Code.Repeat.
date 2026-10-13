/* src/app/pages/faq-page/faq-search.spec.ts */
import { STUDIO_TRANSLATIONS } from '../../core/data/studio-content';
import { StudioLanguage, StudioService } from '../../core/models/studio.models';
import { managedServiceContent } from '../service-detail-page/managed/content/managed-service-content';
import { buildFaqGroups } from './faq-content';
import { FaqGroup } from './faq.models';
import { filterFaqGroups, normalizeFaqSearch } from './faq-search';

/** Registriert Prüfungen für vollständige Quellen, Themenauswahl und lokale Suche. */
function registerTests(): void {
  it.each(['de', 'en'] as const)('übernimmt alle Leistungsfragen unverändert in %s', verifySourceCoverage);
  it('normalisiert Großschreibung, Umlaute und scharfes S', verifyNormalization);
  it('findet WordPress auch in Antworten und unabhängig von Großschreibung', verifyWordPressSearch);
  it('kombiniert alle Suchbegriffe mit dem Themenfilter', verifyCombinedSearch);
  it('findet die Wartungspreise in der gemeinsamen Antwortquelle', verifyPriceSearch);
  it('liefert bei unbekannten Begriffen keine Treffer', verifyEmptySearch);
  it('ändert weder Quellen noch Reihenfolge bei wiederholter Suche', verifyImmutableSearch);
}

/**
 * Prüft die vollständige Übernahme jeder Leistung in der aktiven Sprache.
 * @param language Geprüfte Sprachvariante.
 */
function verifySourceCoverage(language: StudioLanguage): void {
  /**
   * Aus allen aktuellen Quellen aufgebaute Themenblöcke.
   */
  const groups = buildFaqGroups(STUDIO_TRANSLATIONS[language], language);
  expect(groups).toHaveLength(7);
  /**
   * Einzelne Leistung zur Prüfung ihrer vollständigen Fragefolge.
   */
  for (const service of STUDIO_TRANSLATIONS[language].services) verifyServiceGroup(groups, service, language);
}

/**
 * Vergleicht alle Fragen und Antworten mit der ursprünglichen Leistungsseite.
 * @param groups Vollständige gemeinsame Themenblöcke.
 * @param service Einzelne Leistung der Website.
 * @param language Geprüfte Sprachvariante.
 */
function verifyServiceGroup(groups: readonly FaqGroup[], service: StudioService, language: StudioLanguage): void {
  /**
   * Themenblock der aktuellen Leistungsseite.
   */
  const group = groups.find(
    /**
     * Wählt den über seinen Slug bezeichneten Themenblock.
     * @param item Einzelner Themenblock.
     */
    (item) => item.id === service.slug,
  )!;
  expect(group.items.length).toBe(managedServiceContent(language, service.slug)!.faqs.length);
  compareAnswers(group, language);
}

/**
 * Prüft die unveränderten Inhalte aller Fragen eines Service-Themas.
 * @param group Zu prüfender Themenblock.
 * @param language Sprache der ursprünglichen Datenquelle.
 */
function compareAnswers(group: FaqGroup, language: StudioLanguage): void {
  /**
   * Originale Fragefolge der Leistungsseite.
   */
  const source = managedServiceContent(language, group.id)!.faqs;
  /**
   * Position der Frage in der gemeinsamen und ursprünglichen Folge.
   */
  for (let index = 0; index < source.length; index++) {
    expect(group.items[index].question).toBe(source[index].title);
    expect(group.items[index].answer).toBe(source[index].text);
  }
}

/** Prüft die einheitliche Behandlung diakritischer Zeichen. */
function verifyNormalization(): void {
  expect(normalizeFaqSearch('  GRÖßE ÉMAIL  ')).toBe('grosse email');
}

/** Prüft eine reale Suche nach dem neu ergänzten Website-Thema. */
function verifyWordPressSearch(): void {
  expect(filterFaqGroups(germanGroups(), 'WORDPRESS', 'webentwicklung')[0].items.length).toBeGreaterThan(0);
  expect(filterFaqGroups(germanGroups(), 'wordpress', 'email')).toHaveLength(0);
}

/** Prüft mehrere Begriffe innerhalb eines ausgewählten Leistungsbereichs. */
function verifyCombinedSearch(): void {
  expect(filterFaqGroups(germanGroups(), 'Redis Celery', 'softwareentwicklung')[0].items).toHaveLength(1);
  expect(filterFaqGroups(germanGroups(), 'Redis Celery', 'webentwicklung')).toHaveLength(0);
}

/** Prüft, dass der mittlere Wartungspreis ohne eigene FAQ-Preisduplikate auffindbar ist. */
function verifyPriceSearch(): void {
  expect(filterFaqGroups(germanGroups(), '39', 'wartung')[0].items).toHaveLength(1);
}

/** Prüft den leeren Ergebniszustand für eine nicht vorhandene Anfrage. */
function verifyEmptySearch(): void {
  expect(filterFaqGroups(germanGroups(), 'nichtvorhandenerbegriff', 'all')).toHaveLength(0);
}

/** Prüft die unveränderte Quelle nach einer Suche und anschließendem Zurücksetzen. */
function verifyImmutableSearch(): void {
  /**
   * Unveränderter Themenbestand vor der ersten Filterung.
   */
  const groups = germanGroups();
  filterFaqGroups(groups, 'WordPress', 'all');
  expect(filterFaqGroups(groups, '', 'all')).toEqual(groups);
  expect(new Set(allQuestionIds(groups)).size).toBe(allQuestionIds(groups).length);
}

/** Liefert den vollständigen deutschen Fragenbestand für Suchprüfungen. */
function germanGroups(): readonly FaqGroup[] {
  return buildFaqGroups(STUDIO_TRANSLATIONS.de, 'de');
}

/**
 * Sammelt die stabilen Fragekennungen aller Themen.
 * @param groups Vollständiger Themenbestand.
 */
function allQuestionIds(groups: readonly FaqGroup[]): readonly string[] {
  return groups.flatMap(questionIds);
}

/**
 * Liest die stabilen Kennungen eines einzelnen Themenblocks.
 * @param group Einzelner Themenblock.
 */
function questionIds(group: FaqGroup): readonly string[] {
  return group.items.map(
    /**
     * Liest die unveränderte Kennung des Frageeintrags.
     * @param item Einzelne Frage des Themenblocks.
     */
    (item) => item.id,
  );
}

describe('Gemeinsame FAQ-Quellen und Suche', registerTests);
