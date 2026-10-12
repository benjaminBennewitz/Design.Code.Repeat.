/* src/app/core/data/design-catalog/catalog-pages.ts */
import type { ProjectCatalogPage } from '../../models/reference-catalog.models';
import type { DesignCatalogChapterSeed } from './catalog-seed.models';
import { DESIGN_CATALOG_CHAPTERS, DESIGN_CATALOG_PAGE_COUNT } from './catalog-chapters.data';

/**
 * Erstellt die Bilddaten einer Katalogseite.
 * @param pageNumber Echte Seitenzahl des Printkatalogs.
 * @param side Linke oder rechte Position im Reader.
 */
export function createDesignCatalogPage(pageNumber: number, side: ProjectCatalogPage['side']): ProjectCatalogPage {
  /**
   * Gemeinsames Asset für Bild, Sprachvarianten und Bildhinweis.
   */
  const image = getDesignCatalogPagePath(pageNumber);
  return {
    ...createDesignCatalogPageText(pageNumber),
    side,
    image,
    imageByLanguage: { de: image, en: image },
    assetType: 'image',
    imageHint: image,
  };
}

/**
 * Erstellt die Kapiteltexte und Seitenbeschriftung.
 * @param pageNumber Echte Seitenzahl des Printkatalogs.
 */
function createDesignCatalogPageText(
  pageNumber: number,
): Pick<ProjectCatalogPage, 'number' | 'eyebrow' | 'title' | 'text' | 'alt' | 'mood'> {
  /**
   * Kapitelmetadaten der angeforderten Seite.
   */
  const chapter = getDesignCatalogChapterForPage(pageNumber);
  return {
    number: formatDesignCatalogPageNumber(pageNumber),
    eyebrow: chapter.number,
    title: chapter.title,
    text: chapter.subtitle,
    alt: `Designkatalog Seite ${formatDesignCatalogPageNumber(pageNumber)}: ${chapter.title}`,
    mood: chapter.mood,
  };
}

/**
 * Liefert das letzte Kapitel, dessen Startseite bereits erreicht wurde.
 * @param pageNumber Echte Seitenzahl des Printkatalogs.
 */
export function getDesignCatalogChapterForPage(pageNumber: number): DesignCatalogChapterSeed {
  /**
   * Rückwärtsprüfung der aufsteigend geordneten Kapitel ohne Array-Kopie.
   */
  for (let chapterIndex = DESIGN_CATALOG_CHAPTERS.length - 1; chapterIndex >= 0; chapterIndex--) {
    if (pageNumber >= DESIGN_CATALOG_CHAPTERS[chapterIndex].startPage) {
      return DESIGN_CATALOG_CHAPTERS[chapterIndex];
    }
  }
  return DESIGN_CATALOG_CHAPTERS[0];
}

/**
 * Berechnet den Reader-Index einer echten Seitenzahl.
 * @param pageNumber Echte Seitenzahl des Printkatalogs.
 */
export function getDesignCatalogSpreadIndexForPage(pageNumber: number): number {
  if (pageNumber <= 1) {
    return 0;
  }
  if (pageNumber >= DESIGN_CATALOG_PAGE_COUNT) {
    return Math.ceil((DESIGN_CATALOG_PAGE_COUNT - 1) / 2);
  }
  return Math.ceil((pageNumber - 1) / 2);
}

/**
 * Formatiert Seitenzahlen zweistellig für Beschriftungen und Assets.
 * @param pageNumber Echte Seitenzahl des Printkatalogs.
 */
export function formatDesignCatalogPageNumber(pageNumber: number): string {
  return pageNumber.toString().padStart(2, '0');
}

/**
 * Liefert den Asset-Pfad einer Katalogseite.
 * @param pageNumber Echte Seitenzahl des Printkatalogs.
 */
function getDesignCatalogPagePath(pageNumber: number): string {
  return `assets/images/projects/design-catalog/en/catalog-page-${formatDesignCatalogPageNumber(pageNumber)}.webp`;
}
