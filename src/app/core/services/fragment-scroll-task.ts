/* src/app/core/services/fragment-scroll-task.ts */

/** Stabilisiert einen einzelnen Ankersprung bis zum ruhigen Layout oder zum manuellen Abbruch. */
export class FragmentScrollTask {
  private frameId = 0;                                                              // Noch ausstehender Browser-Frame.
  private stableFrames = 0;                                                         // Aufeinanderfolgende Frames ohne Layoutänderung.
  private previousTop = Number.NaN;                                                 // Zuletzt erreichte vertikale Zielposition.
  private previousHeight = 0;                                                       // Zuletzt gemessene Dokumenthöhe.
  private readonly startedAt: number;                                               // Beginn der begrenzten Ausrichtung.
  private readonly stopCallback = this.stop.bind(this);                             // Stabiler Listener für manuelle Eingaben.
  private readonly alignCallback = this.align.bind(this);                           // Stabiler Callback der Frame-Schleife.
  private readonly inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown']; // Abbrechende Nutzereingaben.

  /**
   * Verbindet Browser, Zielanker und eine optionale gespeicherte Scrollposition.
   * @param document Dokument mit dem verzögert gerenderten Zielanker.
   * @param windowRef Browserfenster für Frames, Messungen und Scrollen.
   * @param anchor Angeforderte Element-ID.
   * @param position Gespeicherte horizontale und vertikale Scrollposition.
   */
  constructor(
    private readonly document: Document,
    private readonly windowRef: Window,
    private readonly anchor: string,
    private readonly position: [number, number] | null,
  ) {
    this.startedAt = windowRef.performance.now();
  }

  /** Aktiviert die Sprungdarstellung und wartet auf den ersten messbaren Frame. */
  start(): void {
    this.document.documentElement.classList.add('dcr-anchor-is-scrolling');
    /**
     * Eingabetypen, bei denen die automatische Korrektur sofort endet.
     */
    for (const type of this.inputEvents) this.windowRef.addEventListener(type, this.stopCallback, { passive: true });
    this.scheduleFrame();
  }

  /** Beendet Frames und Eingabelistener des aktuellen Sprungs. */
  stop(): void {
    this.windowRef.cancelAnimationFrame(this.frameId);
    this.document.documentElement.classList.remove('dcr-anchor-is-scrolling');
    /**
     * Für diesen Sprung registrierte Eingabelistener.
     */
    for (const type of this.inputEvents) this.windowRef.removeEventListener(type, this.stopCallback);
    this.frameId = 0;
  }

  /** Plant genau eine weitere Messung im nächsten Browser-Frame. */
  private scheduleFrame(): void {
    this.frameId = this.windowRef.requestAnimationFrame(this.alignCallback);
  }

  /** Wartet auf echten Inhalt und entscheidet über Fortsetzung oder Abschluss des Sprungs. */
  private align(): void {
    /**
     * Aktuell vorhandener Zielanker, gegebenenfalls noch als Deferred-Platzhalter.
     */
    const target = this.document.getElementById(this.anchor);
    /**
     * Ablauf der bisherigen maximalen Stabilisierungsdauer.
     */
    const expired = this.windowRef.performance.now() - this.startedAt > 2500;
    if (target && !target.classList.contains('home-deferred-placeholder')) {
      if (this.alignTarget(target) || expired) return this.finishTarget(target);
    } else if (expired) return this.stop();
    this.scheduleFrame();
  }

  /**
   * Richtet den Anker aus und meldet ein über mehrere Frames stabiles Layout.
   * @param target Tatsächlich gerenderter Zielanker.
   */
  private alignTarget(target: HTMLElement): boolean {
    /**
     * Unter Berücksichtigung des Headers berechnete oder gespeicherte Zielposition.
     */
    const top = this.targetTop(target);
    /**
     * Dokumenthöhe als zusätzlicher Indikator für nachgeladene Inhalte.
     */
    const height = this.document.documentElement.scrollHeight;
    this.windowRef.scrollTo({ top, left: this.position?.[0] ?? 0, behavior: 'instant' });
    this.stableFrames =
      Math.abs(top - this.previousTop) < 1 && height === this.previousHeight ? this.stableFrames + 1 : 0;
    this.previousTop = top;
    this.previousHeight = height;
    return this.stableFrames >= 4 && this.document.fonts.status !== 'loading';
  }

  /**
   * Berechnet die vertikale Zielposition mit der bisherigen Header-Korrektur.
   * @param target Tatsächlich gerenderter Zielanker.
   */
  private targetTop(target: HTMLElement): number {
    /**
     * Aktuelle Höhe des gegebenenfalls fixierten Seitenheaders.
     */
    const headerHeight = this.document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
    return (
      this.position?.[1] ?? Math.max(0, this.windowRef.scrollY + target.getBoundingClientRect().top - headerHeight)
    );
  }

  /**
   * Beendet den Sprung und übergibt bei einem Skip-Link den Tastaturfokus.
   * @param target Erfolgreich erreichter Zielanker.
   */
  private finishTarget(target: HTMLElement): void {
    this.stop();
    if (this.anchor === 'main-content') target.focus({ preventScroll: true });
  }
}
