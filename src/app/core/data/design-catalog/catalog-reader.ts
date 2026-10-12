/* src/app/core/data/design-catalog/catalog-reader.ts */
import type { ProjectCatalogSpread, ProjectCatalogTocItem } from '../../models/reference-catalog.models';
import type { DesignCatalogChapterSeed } from './catalog-seed.models';
import { DESIGN_CATALOG_CHAPTERS, DESIGN_CATALOG_PAGE_COUNT } from './catalog-chapters.data';
import {
  createDesignCatalogPage,
  formatDesignCatalogPageNumber,
  getDesignCatalogChapterForPage,
  getDesignCatalogSpreadIndexForPage,
} from './catalog-pages';

/** Erstellt die Kapitelnavigation des Katalog-Readers. */
export function createDesignCatalogTocItems(): readonly ProjectCatalogTocItem[] {
  return DESIGN_CATALOG_CHAPTERS.map(createDesignCatalogTocItem);
}

/**
 * Übersetzt ein Kapitel in einen Navigationseintrag.
 * @param chapter Kapitelmetadaten aus dem Inhaltsverzeichnis.
 */
function createDesignCatalogTocItem(chapter: DesignCatalogChapterSeed): ProjectCatalogTocItem {
  return {
    number: chapter.number,
    title: chapter.title,
    subtitle: chapter.subtitle,
    text: chapter.text,
    tool: chapter.tool,
    targetSpreadIndex: getDesignCatalogSpreadIndexForPage(chapter.startPage),
  };
}

/** Erstellt Cover, geordnete Doppelseiten und Rückseite des Readers. */
export function createDesignCatalogSpreads(): readonly ProjectCatalogSpread[] {
  /**
   * Reader-Ansichten in ihrer endgültigen Reihenfolge.
   */
  const spreads: ProjectCatalogSpread[] = [createDesignCatalogCover()];
  /**
   * Jeweils linke Seite der nächsten vollständigen Doppelseite.
   */
  for (let pageNumber = 2; pageNumber < DESIGN_CATALOG_PAGE_COUNT; pageNumber += 2) {
    spreads.push(createDesignCatalogDoublePage(pageNumber));
  }
  spreads.push(createDesignCatalogBackCover());
  return spreads;
}

/** Erstellt die erste Katalogseite auf der rechten Reader-Seite. */
function createDesignCatalogCover(): ProjectCatalogSpread {
  return {
    id: 'catalog-spread-01',
    title: 'Cover',
    text: 'Erste Katalogseite als rechter Einstieg im Reader.',
    pages: [createDesignCatalogPage(1, 'right')],
  };
}

/**
 * Erstellt zwei aufeinanderfolgende Katalogseiten als Doppelseite.
 * @param pageNumber Seitenzahl der linken Seite.
 */
function createDesignCatalogDoublePage(pageNumber: number): ProjectCatalogSpread {
  return {
    id: `catalog-spread-${formatDesignCatalogPageNumber(pageNumber)}-${formatDesignCatalogPageNumber(pageNumber + 1)}`,
    title: `Pages ${formatDesignCatalogPageNumber(pageNumber)}-${formatDesignCatalogPageNumber(pageNumber + 1)}`,
    text: getDesignCatalogChapterForPage(pageNumber).title,
    pages: [createDesignCatalogPage(pageNumber, 'left'), createDesignCatalogPage(pageNumber + 1, 'right')],
  };
}

/** Erstellt die letzte Katalogseite auf der linken Reader-Seite. */
function createDesignCatalogBackCover(): ProjectCatalogSpread {
  return {
    id: `catalog-spread-${formatDesignCatalogPageNumber(DESIGN_CATALOG_PAGE_COUNT)}`,
    title: 'Back Cover',
    text: 'Letzte Katalogseite als linker Abschluss im Reader.',
    pages: [createDesignCatalogPage(DESIGN_CATALOG_PAGE_COUNT, 'left')],
  };
}
