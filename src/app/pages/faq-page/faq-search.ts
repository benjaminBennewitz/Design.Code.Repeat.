/* src/app/pages/faq-page/faq-search.ts */
import { FaqGroup, SearchableFaq } from './faq.models';

/**
 * Vereinheitlicht Großschreibung und diakritische Zeichen für die lokale Suche.
 * @param value Suchtext oder Suchanfrage.
 */
export function normalizeFaqSearch(value: string): string {
  return value.toLocaleLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ß/gu, 'ss').trim();
}

/**
 * Kombiniert Themenauswahl und Suche ohne die gemeinsamen Quelldaten zu verändern.
 * @param groups Vollständige FAQ-Themen der aktiven Sprache.
 * @param query Aktuelle Suchanfrage.
 * @param category Gewählter Themen-Slug oder all.
 */
export function filterFaqGroups(groups: readonly FaqGroup[], query: string, category: string): readonly FaqGroup[] {
  return searchGroups(selectGroups(groups, category), normalizeFaqSearch(query).split(/\s+/u).filter(Boolean));
}

/**
 * Begrenzt die Suche auf das gewählte Thema.
 * @param groups Vollständige FAQ-Themen der aktiven Sprache.
 * @param category Gewählter Themen-Slug oder all.
 */
function selectGroups(groups: readonly FaqGroup[], category: string): readonly FaqGroup[] {
  return category === 'all' ? groups : groups.filter(
    /**
     * Vergleicht den Themen-Slug mit der ausgewählten Kategorie.
     * @param group Einzelner Themenblock.
     */
    (group) => group.id === category,
  );
}

/**
 * Sucht innerhalb der gewählten Themen und blendet leere Blöcke aus.
 * @param groups Für die Suche ausgewählte Themen.
 * @param tokens Normalisierte einzelne Suchbegriffe.
 */
function searchGroups(groups: readonly FaqGroup[], tokens: readonly string[]): readonly FaqGroup[] {
  return groups.map(
    /**
     * Filtert die Fragen des Themenblocks anhand aller Suchbegriffe.
     * @param group Einzelner Themenblock.
     */
    (group) => filterGroup(group, tokens),
  ).filter(hasQuestions);
}

/**
 * Filtert die Fragen eines Themas, ohne seine Metadaten zu ändern.
 * @param group Einzelner Themenblock.
 * @param tokens Normalisierte Suchbegriffe.
 */
function filterGroup(group: FaqGroup, tokens: readonly string[]): FaqGroup {
  return { ...group, items: group.items.filter(
    /**
     * Prüft den vorbereiteten Suchtext der einzelnen Frage.
     * @param item Frage mit vorbereitetem Suchtext.
     */
    (item) => matchesTokens(item, tokens),
  ) };
}

/**
 * Verlangt alle eingegebenen Begriffe innerhalb des vorbereiteten Suchtexts.
 * @param item Frage mit vorbereitetem Suchtext.
 * @param tokens Normalisierte einzelne Suchbegriffe.
 */
function matchesTokens(item: SearchableFaq, tokens: readonly string[]): boolean {
  return tokens.every(
    /**
     * Prüft einen einzelnen Begriff in Frage, Antwort und Thema.
     * @param token Normalisierter Suchbegriff.
     */
    (token) => item.searchText.includes(token),
  );
}

/**
 * Prüft, ob ein Themenblock sichtbare Treffer enthält.
 * @param group Gefilterter Themenblock.
 */
function hasQuestions(group: FaqGroup): boolean {
  return group.items.length > 0;
}
