/* src/app/shared/reference-case-study/controllers/catalog-loupe.ts */
import { signal } from '@angular/core';
import type { CatalogLoupeState, CatalogReaderPage } from './catalog-reader.models';
/** Verwaltet ausschließlich den Bildausschnitt der Kataloglupe. */
export class CatalogLoupe {
  readonly state = signal<CatalogLoupeState>(createHiddenLoupe()); // Aktueller sichtbarer Bildausschnitt.

  /**
   * Aktualisiert die Lupe für eine Pointer-Position innerhalb einer Reader-Seite.
   * @param event Pointer-Ereignis der dargestellten Seite.
   * @param page Reader-Seite mit vorbereitetem Bildpfad.
   * @param menuOpen Verhindert die Lupe während des Inhaltsverzeichnisses.
   */
  update(event: PointerEvent, page: CatalogReaderPage, menuOpen: boolean): void {
    if (!page.asset || event.pointerType === 'touch' || menuOpen || !(event.currentTarget instanceof HTMLElement)) {
      this.hide();
      return;
    }
    this.updatePosition(event, page, event.currentTarget.getBoundingClientRect());
  }

  /** Blendet eine sichtbare Lupe aus. */
  hide(): void {
    if (this.state().isVisible) this.state.set(createHiddenLoupe());
  }

  /**
   * Übernimmt die Pointer-Position nur innerhalb der Seitengrenzen.
   * @param event Pointer-Ereignis der dargestellten Seite.
   * @param page Reader-Seite mit vorbereitetem Bildpfad.
   * @param rect Darstellungsgröße und Position der Seite.
   */
  private updatePosition(event: PointerEvent, page: CatalogReaderPage, rect: DOMRect): void {
    /**
     * Lokale Position innerhalb des Seitenbildes.
     */
    const position = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (position.x < 0 || position.y < 0 || position.x > rect.width || position.y > rect.height) this.hide();
    else this.state.set(createLoupeState(page, rect, position));
  }
}

/** Erstellt den ausgeblendeten Ausgangszustand der Lupe. */
function createHiddenLoupe(): CatalogLoupeState {
  return {
    isVisible: false,
    pageNumber: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    asset: '',
    backgroundSize: '',
    backgroundPosition: '',
  };
}

/**
 * Berechnet den Bildausschnitt aus Seitengröße und lokaler Pointer-Position.
 * @param page Reader-Seite mit vorbereitetem Bildpfad.
 * @param rect Darstellungsgröße der Seite.
 * @param position Pointer-Position innerhalb der Seite.
 */
function createLoupeState(
  page: CatalogReaderPage,
  rect: DOMRect,
  position: { x: number; y: number },
): CatalogLoupeState {
  /**
   * Responsive Abmessungen des Lupenfensters.
   */
  const dimensions = getLoupeDimensions();
  return {
    isVisible: true,
    pageNumber: page.number,
    ...position,
    ...dimensions,
    asset: page.asset ?? '',
    backgroundSize: `${rect.width * 1.8}px ${rect.height * 1.8}px`,
    backgroundPosition: `${-(position.x * 1.8 - dimensions.width / 2)}px ${-(position.y * 1.8 - dimensions.height / 2)}px`,
  };
}

/** Liefert die responsive Lupenbreite und die zugehörige Höhe. */
function getLoupeDimensions(): { width: number; height: number } {
  /**
   * An den Viewport angepasste Fensterbreite mit unveränderten Grenzwerten.
   */
  const width =
    typeof window === 'undefined' ? 230 : Math.round(Math.min(Math.max(window.innerWidth * 0.189, 189), 336));
  return { width, height: Math.round(width * 0.68) };
}
