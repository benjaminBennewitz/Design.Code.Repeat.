/* src/app/shared/reference-case-study/controllers/overlay-focus.ts */
/** Verwaltet geplante Fokuswechsel und Tab-Navigation eines Overlays. */
export class OverlayFocus {
  private frameId = 0; // Ausstehender Fokuswechsel im nächsten Browser-Frame.

  /**
   * Plant den Fokus auf ein beim Rendern verfügbares Element.
   * @param getTarget Liefert das aktuelle Ziel nach dem nächsten Render-Frame.
   */
  schedule(getTarget: () => HTMLElement | null | undefined): void {
    this.cancel();
    if (typeof window !== 'undefined')
      this.frameId = window.requestAnimationFrame(this.focusTarget.bind(this, getTarget));
  }

  /** Bricht einen noch ausstehenden Fokuswechsel ab. */
  cancel(): void {
    if (this.frameId && typeof window !== 'undefined') window.cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  /**
   * Setzt den Fokus ohne Scroll-Sprung auf ein verbundenes DOM-Element.
   * @param getTarget Liefert das nach dem Rendern verfügbare Fokusziel.
   */
  private focusTarget(getTarget: () => HTMLElement | null | undefined): void {
    this.frameId = 0;
    /**
     * Erst nach dem Render-Frame aufgelöstes Fokusziel.
     */
    const target = getTarget();
    if (target?.isConnected) target.focus({ preventScroll: true });
  }
}

/**
 * Hält Tab-Navigation innerhalb eines geöffneten Dialogs.
 * @param event Tastaturereignis für die Tab-Taste.
 * @param panel Aktuell geöffneter Dialogbereich.
 * @param focusEmptyPanel Erlaubt den Fokus auf Dialoge ohne bedienbare Kinder.
 */
export function trapOverlayFocus(
  event: KeyboardEvent,
  panel: HTMLElement | null | undefined,
  focusEmptyPanel = false,
): void {
  if (!panel) return;
  /**
   * Tastaturbedienbare Elemente in ihrer DOM-Reihenfolge.
   */
  const elements = Array.from(
    panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
  );
  if (!elements.length) {
    event.preventDefault();
    if (focusEmptyPanel) panel.focus({ preventScroll: true });
    return;
  }
  wrapOverlayFocus(event, panel, elements);
}

/**
 * Verbindet Anfang und Ende der Tab-Reihenfolge.
 * @param event Tastaturereignis für die Tab-Taste.
 * @param panel Geöffneter Dialogbereich.
 * @param elements Tastaturbedienbare Elemente des Dialogs.
 */
function wrapOverlayFocus(event: KeyboardEvent, panel: HTMLElement, elements: readonly HTMLElement[]): void {
  /**
   * Randziel passend zur Vorwärts- oder Rückwärtsnavigation.
   */
  const target = event.shiftKey ? elements.at(-1)! : elements[0];
  /**
   * Randposition, deren Überschreiten den Fokus zurück in den Dialog führt.
   */
  const boundary = event.shiftKey ? elements[0] : elements.at(-1);
  if (document.activeElement === boundary || !panel.contains(document.activeElement)) {
    event.preventDefault();
    target.focus({ preventScroll: true });
  }
}
