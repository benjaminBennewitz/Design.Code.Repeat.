/* src/app/shared/reference-case-study/controllers/catalog-reader.ts */
import { computed, signal, type Signal } from '@angular/core';
import type { PortfolioLanguage } from '../../../core/models/reference-common.models';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { ProjectCatalogPage, ProjectCatalogSpread } from '../../../core/models/reference-catalog.models';
import type { CatalogReaderPage, CatalogReaderSpread } from './catalog-reader.models';
import { CaseAssetLoader } from './case-asset-loader';
import { CatalogLoupe } from './catalog-loupe';

/** Verwaltet Seitenwechsel und vorbereitete Bilddaten des Katalog-Readers. */
export class CatalogReader {
  readonly index = signal(0);                                        // Aktuell ausgewählte Doppelseite.
  readonly direction = signal<1 | -1 | 0>(0);                        // Richtung des sichtbaren Seitenwechsels.
  readonly isBusy = signal(false);                                   // Ladezustand vor dem sichtbaren Seitenwechsel.
  readonly activeSpread = computed(this.getActiveSpread.bind(this)); // Vorbereitete Reader-Ansicht.
  private switchToken = 0;                                           // Verhindert die Übernahme veralteter Ladeaufträge.

  /**
   * Verbindet Reader-Zustand und die projektspezifischen Daten.
   * @param project Aktuell ausgewählte Case Study.
   * @param language Aktuelle Sprache der Reader-Assets.
   * @param assets Gemeinsamer Asset-Loader der Komponenteninstanz.
   * @param loupe Lupe, die bei Seitenwechseln ausgeblendet wird.
   */
  constructor(
    private readonly project: Signal<PortfolioProject | undefined>,
    private readonly language: Signal<PortfolioLanguage>,
    private readonly assets: CaseAssetLoader,
    private readonly loupe: CatalogLoupe,
  ) {}

  /**
   * Wählt eine Doppelseite mit der passenden Animationsrichtung.
   * @param index Gewünschter Reader-Index.
   * @param direction Explizite Richtung für die Vorwärts-/Rückwärtsnavigation.
   */
  select(index: number, direction?: 1 | -1): void {
    this.loupe.hide();
    if (!this.getSpreads().length) return;
    /**
     * Reader-Index nach dem zyklischen Übergang an den Kataloggrenzen.
     */
    const nextIndex = this.wrapIndex(index);
    if (nextIndex === this.getNormalizedIndex()) {
      this.direction.set(0);
      return;
    }
    void this.switchSpread(nextIndex, direction ?? getDirection(index, this.getNormalizedIndex()));
  }

  /**
   * Wechselt zur nächsten oder vorherigen Reader-Ansicht.
   * @param direction Vorwärts- oder Rückwärtsnavigation.
   */
  selectAdjacent(direction: 1 | -1): void {
    this.select(this.getNormalizedIndex() + direction, direction);
  }

  /** Setzt Reader und laufende Seitenwechsel für ein neues Projekt zurück. */
  reset(): void {
    this.switchToken++;
    this.index.set(0);
    this.direction.set(0);
    this.isBusy.set(false);
    if (this.project()?.catalogShowcase) void this.prepareInitialSpread();
  }

  /** Stoppt die Übernahme ausstehender Seitenwechsel. */
  destroy(): void {
    this.switchToken++;
  }

  /** Lädt Einstiegsseiten und Nachbaransichten ohne sichtbaren Wechsel vor. */
  preloadNearby(): void {
    if (!this.project()?.catalogShowcase || typeof window === 'undefined') return;
    /**
     * Seiten aus Einstieg und Nachbarschaft der aktuellen Reader-Ansicht.
     */
    const pages = [
      ...this.getSpreads().slice(0, 4),
      ...this.getSpreads().slice(Math.max(this.getNormalizedIndex() - 1, 0), this.getNormalizedIndex() + 4),
    ].flatMap(getSpreadPages);
    pages.forEach(this.preloadPage.bind(this));
  }

  /** Liefert die Reader-Ansichten des aktuell ausgewählten Projekts. */
  private getSpreads(): readonly ProjectCatalogSpread[] {
    return this.project()?.catalogShowcase?.spreads ?? [];
  }

  /** Liefert den gültigen aktuellen Reader-Index. */
  private getNormalizedIndex(): number {
    return Math.min(Math.max(this.index(), 0), Math.max(this.getSpreads().length - 1, 0));
  }

  /**
   * Berechnet einen zyklischen Zielindex.
   * @param index Gewünschter Reader-Index.
   */
  private wrapIndex(index: number): number {
    return ((index % this.getSpreads().length) + this.getSpreads().length) % this.getSpreads().length;
  }

  /** Liefert die vorbereitete aktive Reader-Ansicht. */
  private getActiveSpread(): CatalogReaderSpread | undefined {
    /**
     * Aktuelle Reader-Doppelseite mit Fallback auf den Kataloganfang.
     */
    const spread = this.getSpreads()[this.getNormalizedIndex()] ?? this.getSpreads()[0];
    return spread ? this.createSpread(spread) : undefined;
  }

  /**
   * Erstellt das ViewModel einer Reader-Ansicht.
   * @param spread Doppelseite aus den Projektdaten.
   */
  private createSpread(spread: ProjectCatalogSpread): CatalogReaderSpread {
    /**
     * Reader-Seiten mit bereits aufgelösten Sprachassets.
     */
    const pages = spread.pages.map(this.createPage.bind(this));
    return { ...spread, pages, pageLabel: this.getPageLabel(pages) };
  }

  /**
   * Erstellt eine Reader-Seite mit stabilem Asset-Binding.
   * @param page Katalogseite aus den Projektdaten.
   */
  private createPage(page: ProjectCatalogPage): CatalogReaderPage {
    return { ...page, asset: this.getPageAsset(page) };
  }

  /**
   * Liefert den Bildpfad für die aktuelle Sprache.
   * @param page Katalogseite aus den Projektdaten.
   */
  private getPageAsset(page: ProjectCatalogPage): string | undefined {
    return page.imageByLanguage?.[this.language()] ?? page.image;
  }

  /**
   * Liefert die sichtbare Seitenzählung einer Reader-Ansicht.
   * @param pages Vorbereitete Seiten der aktuellen Ansicht.
   */
  private getPageLabel(pages: readonly CatalogReaderPage[]): string {
    if (!pages.length) return '';
    /**
     * Gesamtzahl aus der letzten tatsächlich vorhandenen Katalogseite.
     */
    const total = this.getSpreads().at(-1)?.pages.at(-1)?.number ?? pages.at(-1)?.number ?? '';
    return getPageRange(pages) + ' / ' + total;
  }

  /**
   * Decodiert Zielseiten vor der Übernahme eines Seitenwechsels.
   * @param index Gültiger Zielindex der Reader-Ansicht.
   * @param direction Bewegungsrichtung des sichtbaren Wechsels.
   */
  private async switchSpread(index: number, direction: 1 | -1 | 0): Promise<void> {
    /**
     * Kennung dieses Seitenwechsels für die Prüfung nach dem Laden.
     */
    const token = ++this.switchToken;
    this.isBusy.set(true);
    try {
      await this.preloadSpread(index);
      this.commitSpread(token, index, direction);
    } finally {
      this.finishLoading(token);
    }
  }

  /**
   * Übernimmt ausschließlich den neuesten Seitenwechsel.
   * @param token Kennung des abgeschlossenen Ladeauftrags.
   * @param index Gültiger Zielindex der Reader-Ansicht.
   * @param direction Bewegungsrichtung des sichtbaren Wechsels.
   */
  private commitSpread(token: number, index: number, direction: 1 | -1 | 0): void {
    if (token !== this.switchToken) return;
    this.direction.set(direction);
    this.index.set(index);
  }

  /**
   * Beendet den Ladezustand des weiterhin aktuellen Auftrags.
   * @param token Kennung des abgeschlossenen Ladeauftrags.
   */
  private finishLoading(token: number): void {
    if (token === this.switchToken) this.isBusy.set(false);
  }

  /** Decodiert die erste Reader-Ansicht mit sichtbarem Ladezustand. */
  private async prepareInitialSpread(): Promise<void> {
    /**
     * Kennung des aktuellen Projekts, damit alte Aufträge keinen Zustand ändern.
     */
    const token = this.switchToken;
    this.isBusy.set(true);
    try {
      await this.preloadSpread(0);
    } finally {
      this.finishLoading(token);
    }
  }

  /**
   * Lädt sämtliche Seiten einer Reader-Ansicht parallel.
   * @param index Reader-Index der zu ladenden Ansicht.
   */
  private async preloadSpread(index: number): Promise<void> {
    await Promise.all((this.getSpreads()[index]?.pages ?? []).map(this.preloadPage.bind(this)));
  }

  /**
   * Lädt das aktuelle Sprachasset einer Katalogseite.
   * @param page Zu ladende Katalogseite.
   */
  private preloadPage(page: ProjectCatalogPage): Promise<void> {
    return this.assets.preload(this.getPageAsset(page));
  }
}

/**
 * Liefert die Seiten einer Katalogansicht für flache Seitenlisten.
 * @param spread Reader-Ansicht aus den Projektdaten.
 */
function getSpreadPages(spread: ProjectCatalogSpread): readonly ProjectCatalogPage[] {
  return spread.pages;
}

/**
 * Berechnet die Bewegungsrichtung einer direkten Seitenauswahl.
 * @param next Gewünschter Reader-Index vor dem zyklischen Übergang.
 * @param current Aktueller Reader-Index.
 */
function getDirection(next: number, current: number): 1 | -1 | 0 {
  return next > current ? 1 : next < current ? -1 : 0;
}

/**
 * Liefert den sichtbaren Bereich einer Einzel- oder Doppelseite.
 * @param pages Vorbereitete Seiten der Reader-Ansicht.
 */
function getPageRange(pages: readonly CatalogReaderPage[]): string {
  return pages.length === 1 ? pages[0].number : pages[0].number + '–' + pages.at(-1)?.number;
}
