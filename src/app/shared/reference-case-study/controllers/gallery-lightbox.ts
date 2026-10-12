/* src/app/shared/reference-case-study/controllers/gallery-lightbox.ts */
import { computed, signal, type Signal } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { ProjectGalleryItem } from '../../../core/models/reference-catalog.models';
import { CaseAssetLoader, waitForDuration } from './case-asset-loader';
import { OverlayFocus, trapOverlayFocus } from './overlay-focus';

/** Verwaltet Galerieauswahl, Bildwechsel und den modalen Lightbox-Zustand. */
export class GalleryLightbox {
  readonly index = signal<number | null>(null);                     // Aktuell sichtbarer Galerieeintrag.
  readonly phase = signal<'idle' | 'fade-out' | 'fade-in'>('idle'); // Crossfade-Phase des Bildwechsels.
  readonly direction = signal<1 | -1>(1);                           // Bewegungsrichtung der Bildnavigation.
  readonly background = signal('#0a070d');                          // Stabiler Hintergrund während eines Bildwechsels.
  readonly activeItem = computed(this.getActiveItem.bind(this));    // Aktueller Galerieeintrag.
  private readonly focus = new OverlayFocus();                      // Ausstehende modale Fokuswechsel.
  private returnFocus: HTMLElement | null = null;                   // Auslösendes Element vor dem Öffnen.
  private switchToken = 0;                                          // Kennung gegen veraltete Bildwechsel.
  private pendingIndex: number | null = null;                       // Zielindex bei schneller Navigation.
  private switchTimeout: ReturnType<typeof setTimeout> | undefined; // Ausstehender Fade-Abschluss.
  private isScrollLocked = false;                                   // Von dieser Instanz gesetzte Scroll-Sperre.

  /**
   * Verbindet Galerie und gemeinsamen Bildloader der Komponenteninstanz.
   * @param project Aktuell ausgewählte Case Study.
   * @param assets Gemeinsamer Asset-Loader der Komponenteninstanz.
   */
  constructor(
    private readonly project: Signal<PortfolioProject | undefined>,
    private readonly assets: CaseAssetLoader,
  ) {}

  /**
   * Öffnet einen vorhandenen Galerieeintrag mit Fokus im Dialog.
   * @param index Gewünschter Galerieindex.
   */
  open(index: number): void {
    if (!this.getItems()[index]) return;
    this.switchToken++;
    this.resetSwitch();
    this.pendingIndex = index;
    this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.background.set(this.getItems()[index].backgroundColor ?? '#0a070d');
    this.index.set(index);
    this.focus.schedule(this.getInitialFocus.bind(this));
  }

  /** Schließt den Dialog und gibt den Fokus an dessen Auslöser zurück. */
  close(): void {
    this.invalidateSelection();
    this.focus.schedule(resolveFocusTarget.bind(null, this.returnFocus));
    this.returnFocus = null;
  }

  /** Schließt den Dialog ohne Fokuswechsel beim Projekt- oder Routenwechsel. */
  reset(): void {
    this.invalidateSelection();
    this.focus.cancel();
    this.returnFocus = null;
    this.unlockScroll();
  }

  /**
   * Plant das nächste oder vorherige Galeriebild.
   * @param direction Richtung der zyklischen Galerienavigation.
   */
  selectAdjacent(direction: 1 | -1): void {
    /**
     * Letzter Zielindex, damit schnelle Klicks fortlaufend weiter navigieren.
     */
    const index = this.pendingIndex ?? this.index();
    if (!this.getItems().length || index === null) return;
    this.pendingIndex = (index + direction + this.getItems().length) % this.getItems().length;
    void this.switchItem(this.pendingIndex, direction);
  }

  /**
   * Behandelt Tab, Escape und Pfeiltasten der geöffneten Lightbox.
   * @param event Tastaturereignis der geöffneten Lightbox.
   */
  handleKeydown(event: KeyboardEvent): void {
    if (this.index() === null) return;
    if (event.key === 'Tab')
      trapOverlayFocus(event, document.querySelector<HTMLElement>('.project-detail__lightbox-panel'));
    else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.selectAdjacent(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  /** Synchronisiert die Scroll-Sperre mit der aktuellen Dialogsichtbarkeit. */
  synchronizeScrollLock(): void {
    if (this.index() === null) this.unlockScroll();
    else this.lockScroll();
  }

  /** Liefert die Galerie des aktuell ausgewählten Projekts. */
  private getItems(): readonly ProjectGalleryItem[] {
    return this.project()?.gallery ?? [];
  }

  /** Liefert den Galerieeintrag für den aktuell geöffneten Index. */
  private getActiveItem(): ProjectGalleryItem | undefined {
    return this.index() === null ? undefined : this.getItems()[this.index()!];
  }

  /** Liefert den Schließen-Button der aktuellen Lightbox. */
  private getInitialFocus(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.project-detail__lightbox-close');
  }

  /** Verwirft laufende Bildwechsel und schließt die Galerieauswahl. */
  private invalidateSelection(): void {
    this.switchToken++;
    this.resetSwitch();
    this.index.set(null);
  }

  /**
   * Wartet auf Ausblendphase und Bilddecoder vor dem sichtbaren Wechsel.
   * @param index Gültiger Zielindex des Galeriebildes.
   * @param direction Richtung der Bildnavigation.
   */
  private async switchItem(index: number, direction: 1 | -1): Promise<void> {
    if (!this.getItems()[index] || this.index() === null) return;
    /**
     * Kennung des Bildwechsels für die Prüfung nach dem Laden.
     */
    const token = ++this.switchToken;
    this.clearSwitchTimeout();
    this.direction.set(direction);
    this.phase.set('fade-out');
    await Promise.all([waitForDuration(120), this.assets.preload(this.getItems()[index].image)]);
    this.commitItem(token, index);
  }

  /**
   * Übernimmt ausschließlich den neuesten vorbereiteten Galeriewechsel.
   * @param token Kennung des abgeschlossenen Bildwechsels.
   * @param index Gültiger Zielindex des Galeriebildes.
   */
  private commitItem(token: number, index: number): void {
    if (token !== this.switchToken) return;
    this.background.set(this.getItems()[index].backgroundColor ?? '#0a070d');
    this.index.set(index);
    this.phase.set('fade-in');
    this.switchTimeout = setTimeout(this.finishSwitch.bind(this, token), 220);
  }

  /**
   * Beendet die Einblendphase des weiterhin aktuellen Bildwechsels.
   * @param token Kennung des ausstehenden Animationsabschlusses.
   */
  private finishSwitch(token: number): void {
    if (token === this.switchToken) this.phase.set('idle');
  }

  /** Setzt den transienten Bildwechselzustand zurück. */
  private resetSwitch(): void {
    this.clearSwitchTimeout();
    this.pendingIndex = null;
    this.phase.set('idle');
  }

  /** Stoppt einen noch ausstehenden Animationsabschluss. */
  private clearSwitchTimeout(): void {
    if (this.switchTimeout !== undefined) clearTimeout(this.switchTimeout);
    this.switchTimeout = undefined;
  }

  /** Sperrt den Body-Scroll ohne Fixed-Body-Sprung. */
  private lockScroll(): void {
    if (this.isScrollLocked || typeof document === 'undefined') return;
    this.isScrollLocked = true;
    document.documentElement.classList.add('bp-lightbox-open');
    document.body.classList.add('bp-lightbox-open');
  }

  /** Entfernt die von dieser Lightbox gesetzte Scroll-Sperre. */
  private unlockScroll(): void {
    if (!this.isScrollLocked || typeof document === 'undefined') return;
    this.isScrollLocked = false;
    document.documentElement.classList.remove('bp-lightbox-open');
    document.body.classList.remove('bp-lightbox-open');
  }
}

/**
 * Liefert das beim Schließen gespeicherte Fokusziel.
 * @param target Auslösendes Element vor dem Öffnen der Lightbox.
 */
function resolveFocusTarget(target: HTMLElement | null): HTMLElement | null {
  return target;
}
