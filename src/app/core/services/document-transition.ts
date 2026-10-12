/* src/app/core/services/document-transition.ts */

/** Verwaltet die gemeinsame begrenzte CSS-Wechselklasse von Sprache und Theme. */
export class DocumentTransition {
  private timer?: number;                                   // Noch ausstehendes Ende des aktuellen Wechsels.
  private readonly finishCallback = this.finish.bind(this); // Stabiler Abschluss des Wechsel-Timers.

  /**
   * Verbindet einen bestehenden globalen CSS-Wechsel mit seiner bisherigen Dauer.
   * @param document Dokument mit der globalen Wechselklasse.
   * @param className Bereits bestehende CSS-Klasse des Wechsels.
   * @param duration Bisherige Wechseldauer in Millisekunden.
   */
  constructor(
    private readonly document: Document,
    private readonly className: string,
    private readonly duration: number,
  ) {}

  /** Startet die Wechselklasse erneut und ersetzt den vorherigen Abschluss-Timer. */
  start(): void {
    /**
     * Browserfenster für den Abschluss des CSS-Wechsels.
     */
    const windowRef = this.document.defaultView;
    if (!windowRef) return;
    this.restartClass();
    if (this.timer !== undefined) windowRef.clearTimeout(this.timer);
    this.timer = windowRef.setTimeout(this.finishCallback, this.duration);
  }

  /** Startet die vorhandene CSS-Animation durch den bisherigen gezielten Layout-Read neu. */
  private restartClass(): void {
    this.document.documentElement.classList.remove(this.className);
    void this.document.documentElement.offsetWidth;
    this.document.documentElement.classList.add(this.className);
  }

  /** Entfernt die abgeschlossene Wechselklasse und gibt den Timerzustand frei. */
  private finish(): void {
    this.document.documentElement.classList.remove(this.className);
    this.timer = undefined;
  }
}
