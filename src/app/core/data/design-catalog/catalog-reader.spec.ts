/* src/app/core/data/design-catalog/catalog-reader.spec.ts */
import type {
  ProjectCatalogPage,
  ProjectCatalogSpread,
  ProjectCatalogTocItem,
  ProjectGalleryItem,
} from '../../models/reference-catalog.models';
import { createDesignCatalogGalleryItems } from './catalog-gallery';
import { createDesignCatalogSpreads, createDesignCatalogTocItems } from './catalog-reader';
import { getDesignCatalogChapterForPage, getDesignCatalogSpreadIndexForPage } from './catalog-pages';

/** Registriert Regressionstests für Reader-Navigation und Galerieassets. */
function registerCatalogTests(): void {
  it('enthält jede der 54 Katalogseiten genau einmal in aufsteigender Reihenfolge', expectCompletePageSequence);
  it('positioniert Cover, Doppelseiten und Rückseite korrekt', expectPagePositions);
  it('verknüpft jedes Kapitel mit der richtigen Reader-Ansicht', expectChapterTargets);
  it('ordnet Seiten an den Kapitelgrenzen korrekt zu', expectChapterBoundaries);
  it('begrenzt Reader-Indizes auf Cover und Rückseite', expectBoundarySpreadIndices);
  it('erhält Galerie-Reihenfolge und Assets bei einem Sprachwechsel', expectStableGalleryAssets);
}

/** Prüft die lückenlose Reader-Seitenfolge. */
function expectCompletePageSequence(): void {
  /**
   * Alle Seitenzahlen in der sichtbaren Reader-Reihenfolge.
   */
  const pageNumbers = createDesignCatalogSpreads().flatMap(getSpreadPages).map(getPageNumber);
  expect(pageNumbers).toHaveLength(54);
  pageNumbers.forEach(expectSequentialPageNumber);
}

/**
 * Liefert die Seiten einer Reader-Ansicht.
 * @param spread Zu prüfende Reader-Ansicht.
 */
function getSpreadPages(spread: ProjectCatalogSpread): readonly ProjectCatalogPage[] {
  return spread.pages;
}

/**
 * Liest die numerische Seitenzahl einer Katalogseite.
 * @param page Zu prüfende Katalogseite.
 */
function getPageNumber(page: ProjectCatalogPage): number {
  return Number(page.number);
}

/**
 * Prüft eine einzelne Position in der vollständigen Seitenfolge.
 * @param pageNumber Tatsächliche Seitenzahl.
 * @param index Nullbasierte Position der Seite.
 */
function expectSequentialPageNumber(pageNumber: number, index: number): void {
  expect(pageNumber).toBe(index + 1);
}

/** Prüft die Ausrichtung der Randseiten und inneren Doppelseiten. */
function expectPagePositions(): void {
  /**
   * Reader-Ansichten einschließlich Cover und Rückseite.
   */
  const spreads = createDesignCatalogSpreads();
  expect(spreads).toHaveLength(28);
  expect(spreads[0].pages).toHaveLength(1);
  expect(spreads[0].pages[0].side).toBe('right');
  expect(spreads[27].pages).toHaveLength(1);
  expect(spreads[27].pages[0].side).toBe('left');
  spreads.slice(1, -1).forEach(expectDoublePagePositions);
}

/**
 * Prüft die Links-/Rechtsausrichtung einer inneren Doppelseite.
 * @param spread Reader-Ansicht mit zwei Seiten.
 */
function expectDoublePagePositions(spread: ProjectCatalogSpread): void {
  expect(spread.pages).toHaveLength(2);
  expect(spread.pages[0].side).toBe('left');
  expect(spread.pages[1].side).toBe('right');
}

/** Prüft die Navigationsziele des Inhaltsverzeichnisses. */
function expectChapterTargets(): void {
  expect(createDesignCatalogTocItems().map(getChapterTarget)).toEqual([2, 2, 5, 9, 21]);
}

/**
 * Liest den Reader-Index eines Kapitel-Links.
 * @param chapter Kapitel-Link aus dem Inhaltsverzeichnis.
 */
function getChapterTarget(chapter: ProjectCatalogTocItem): number {
  return chapter.targetSpreadIndex;
}

/** Prüft den Kapitelwechsel an den Startseiten und deren Vorgängern. */
function expectChapterBoundaries(): void {
  expect(getDesignCatalogChapterForPage(1).number).toBe('01');
  expect(getDesignCatalogChapterForPage(4).number).toBe('01');
  expect(getDesignCatalogChapterForPage(5).number).toBe('02');
  expect(getDesignCatalogChapterForPage(10).number).toBe('02');
  expect(getDesignCatalogChapterForPage(11).number).toBe('03');
  expect(getDesignCatalogChapterForPage(18).number).toBe('03');
  expect(getDesignCatalogChapterForPage(19).number).toBe('04');
  expect(getDesignCatalogChapterForPage(42).number).toBe('04');
  expect(getDesignCatalogChapterForPage(43).number).toBe('05');
  expect(getDesignCatalogChapterForPage(54).number).toBe('05');
}

/** Prüft Randwerte und die gemeinsame Zuordnung gepaarter Seiten. */
function expectBoundarySpreadIndices(): void {
  expect(getDesignCatalogSpreadIndexForPage(0)).toBe(0);
  expect(getDesignCatalogSpreadIndexForPage(1)).toBe(0);
  expect(getDesignCatalogSpreadIndexForPage(2)).toBe(1);
  expect(getDesignCatalogSpreadIndexForPage(3)).toBe(1);
  expect(getDesignCatalogSpreadIndexForPage(53)).toBe(26);
  expect(getDesignCatalogSpreadIndexForPage(54)).toBe(27);
  expect(getDesignCatalogSpreadIndexForPage(100)).toBe(27);
}

/** Prüft, dass Übersetzungen dieselben Galerieassets an derselben Position verwenden. */
function expectStableGalleryAssets(): void {
  /**
   * Deutsche Galerie als Referenz für die Asset-Reihenfolge.
   */
  const germanGallery = createDesignCatalogGalleryItems('de');
  /**
   * Englische Galerie mit eigenständigen Beschreibungen.
   */
  const englishGallery = createDesignCatalogGalleryItems('en');
  expect(germanGallery).toHaveLength(50);
  expect(englishGallery.map(getGalleryImage)).toEqual(germanGallery.map(getGalleryImage));
  expect(germanGallery[0].title).toBe('Mein Wille ist dein Wille');
  expect(englishGallery[0].title).toBe('Your will is my will');
}

/**
 * Liest den Bildpfad einer Galeriearbeit.
 * @param item Zu prüfender Galerieeintrag.
 */
function getGalleryImage(item: ProjectGalleryItem): string | undefined {
  return item.image;
}

describe('Designkatalog', registerCatalogTests);
