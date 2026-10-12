/* src/app/shared/reference-case-study/controllers/catalog-reader.spec.ts */
import { signal } from '@angular/core';
import { REFERENCE_CASE_PROJECTS } from '../../../core/data/reference-case-projects';
import type { PortfolioLanguage } from '../../../core/models/reference-common.models';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import { CaseAssetLoader } from './case-asset-loader';
import { CatalogLoupe } from './catalog-loupe';
import { CatalogReader } from './catalog-reader';

/** Kontrolliert den Abschluss eines einzelnen Asset-Ladeauftrags. */
class PendingAsset {
  private completeTask!: () => void;                                    // Abschlussfunktion des kontrollierten Ladeauftrags.
  readonly promise = new Promise<void>(this.captureResolve.bind(this)); // Noch nicht abgeschlossener Ladeauftrag.

  /**
   * Übernimmt die Abschlussfunktion des Ladeauftrags.
   * @param resolve Vom Promise bereitgestellte Abschlussfunktion.
   */
  private captureResolve(resolve: () => void): void {
    this.completeTask = resolve;
  }

  /** Beendet den kontrollierten Ladeauftrag. */
  complete(): void {
    this.completeTask();
  }
}

let reader: CatalogReader;                                     // Reader der aktuellen Testinstanz.
let project = signal<PortfolioProject | undefined>(undefined); // Aktuell ausgewählte Test-Case-Study.
let language = signal<PortfolioLanguage>('de');                // Aktuelle Testsprache.
const pendingAssets = new Map<string, PendingAsset>();         // Gezielt noch ausstehende Bildaufträge.

/** Registriert Reader-Tests mit kontrollierten Ladeabschlüssen. */
function registerReaderTests(): void {
  beforeEach(prepareReader);
  afterEach(restoreReaderMocks);
  it('wartet vor einem sichtbaren Seitenwechsel auf beide Zielbilder', expectDecodedSpread);
  it('verwirft ältere Ladeabschlüsse bei schneller Seitenauswahl', expectLatestSpreadWins);
  it('übernimmt nach dem Entfernen keine ausstehenden Seitenwechsel', expectDestroyedReaderIgnoresLoad);
  it('navigiert zyklisch über Cover und Rückseite', expectWrappedNavigation);
  it('behält die Reader-Position bei einem Sprachwechsel', expectLanguagePosition);
}

/** Erstellt einen Reader mit einzeln steuerbaren Bildaufträgen. */
function prepareReader(): void {
  pendingAssets.clear();
  project = signal<PortfolioProject | undefined>(REFERENCE_CASE_PROJECTS.de[1]);
  language = signal<PortfolioLanguage>('de');
  vi.spyOn(CaseAssetLoader.prototype, 'preload').mockImplementation(loadPendingAsset);
  reader = new CatalogReader(project, language, new CaseAssetLoader(), new CatalogLoupe());
}

/** Entfernt Test-Doubles und ausstehende Reader-Auswahl. */
function restoreReaderMocks(): void {
  reader.destroy();
  vi.restoreAllMocks();
}

/**
 * Liefert für ein Asset einen individuell steuerbaren Ladeauftrag.
 * @param asset Zu ladender Bildpfad der Reader-Seite.
 */
function loadPendingAsset(asset: string | undefined): Promise<void> {
  if (!asset) return Promise.resolve();
  if (!pendingAssets.has(asset)) pendingAssets.set(asset, new PendingAsset());
  return pendingAssets.get(asset)!.promise;
}

/**
 * Beendet die Bildaufträge einer bestimmten Reader-Ansicht.
 * @param index Reader-Index der vollständig zu ladenden Ansicht.
 */
function completeSpread(index: number): void {
  /**
   * Seiten der gewünschten Reader-Ansicht aus den unveränderten Projektdaten.
   */
  const pages = project()?.catalogShowcase?.spreads[index].pages ?? [];
  /**
   * Aktuell zum Abschluss freigegebene Reader-Seite.
   */
  for (const page of pages) pendingAssets.get(page.imageByLanguage?.[language()] ?? page.image ?? '')?.complete();
}

/** Lässt die Promise-Ketten der Bild-Decodierung vollständig weiterlaufen. */
async function settleImageTasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

/** Prüft die Übernahme erst nach abgeschlossener Bild-Decodierung. */
async function expectDecodedSpread(): Promise<void> {
  reader.select(2);
  expect(reader.index()).toBe(0);
  expect(reader.isBusy()).toBe(true);
  completeSpread(2);
  await settleImageTasks();
  expect(reader.index()).toBe(2);
  expect(reader.activeSpread()?.pageLabel).toBe('04–05 / 54');
  expect(reader.isBusy()).toBe(false);
}

/** Prüft, dass ältere Bildaufträge die neueste Auswahl nicht überschreiben. */
async function expectLatestSpreadWins(): Promise<void> {
  reader.select(2);
  reader.select(3);
  completeSpread(3);
  await settleImageTasks();
  expect(reader.index()).toBe(3);
  completeSpread(2);
  await settleImageTasks();
  expect(reader.index()).toBe(3);
  expect(reader.isBusy()).toBe(false);
}

/** Prüft die Lifecycle-Sperre nach dem Entfernen des Readers. */
async function expectDestroyedReaderIgnoresLoad(): Promise<void> {
  reader.select(2);
  reader.destroy();
  completeSpread(2);
  await settleImageTasks();
  expect(reader.index()).toBe(0);
}

/** Prüft den zyklischen Übergang an beiden Reader-Grenzen. */
async function expectWrappedNavigation(): Promise<void> {
  reader.selectAdjacent(-1);
  completeSpread(27);
  await settleImageTasks();
  expect(reader.index()).toBe(27);
  expect(reader.direction()).toBe(-1);
  reader.selectAdjacent(1);
  completeSpread(0);
  await settleImageTasks();
  expect(reader.index()).toBe(0);
  expect(reader.direction()).toBe(1);
}

/** Prüft die stabile Reader-Position bei übersetzten Projektdaten. */
async function expectLanguagePosition(): Promise<void> {
  reader.select(2);
  completeSpread(2);
  await settleImageTasks();
  project.set(REFERENCE_CASE_PROJECTS.en[1]);
  language.set('en');
  expect(reader.index()).toBe(2);
  expect(reader.activeSpread()?.pageLabel).toBe('04–05 / 54');
  expect(reader.activeSpread()?.pages[0].asset).toBe('assets/images/projects/design-catalog/en/catalog-page-04.webp');
}

describe('CatalogReader', registerReaderTests);
