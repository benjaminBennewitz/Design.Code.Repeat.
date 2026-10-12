/* src/app/shared/reference-case-study/controllers/catalog-menu.ts */
import { signal } from '@angular/core';
import { OverlayFocus, trapOverlayFocus } from './overlay-focus';
/** Verwaltet Inhaltsverzeichnis und dessen Fokuswechsel. */
export class CatalogMenu {
  readonly isOpen = signal(false);             // Sichtbarkeit des Inhaltsverzeichnisses.
  private readonly focus = new OverlayFocus(); // Geplante Fokuswechsel des Dialogs.
  trigger?: HTMLButtonElement;                 // Stabiles Fokusziel nach dem Schließen.
  dialog?: HTMLElement;                        // Aktueller Dialogbereich des Inhaltsverzeichnisses.

  /** Öffnet das Inhaltsverzeichnis und plant den Dialogfokus. */
  open(): void {
    this.isOpen.set(true);
    this.focus.schedule(this.getInitialFocus.bind(this));
  }

  /** Schließt das Inhaltsverzeichnis mit Fokus-Rückgabe. */
  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.focus.schedule(this.getReturnFocus.bind(this));
  }

  /**
   * Behandelt Escape und Tab innerhalb des Inhaltsverzeichnisses.
   * @param event Tastaturereignis des geöffneten Dialogs.
   */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'Tab') trapOverlayFocus(event, this.dialog, true);
  }

  /** Schließt den Dialog ohne Fokuswechsel beim Projekt- oder Routenwechsel. */
  reset(): void {
    this.isOpen.set(false);
    this.focus.cancel();
  }

  /** Liefert den ersten bedienbaren Button des Dialogs. */
  private getInitialFocus(): HTMLElement | null | undefined {
    return this.dialog?.querySelector<HTMLElement>('button:not([disabled])');
  }

  /** Liefert den Menü-Trigger nach dem Schließen. */
  private getReturnFocus(): HTMLElement | undefined {
    return this.trigger;
  }
}
