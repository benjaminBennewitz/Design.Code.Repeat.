/* src/app/core/services/scroll-reveal.service.ts */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** Deckt erreichte und übersprungene Inhalte einmalig mit einer gemeinsamen Scroll-Prüfung auf. */
@Injectable({ providedIn: 'root' })
export class ScrollRevealService {
  private readonly document = inject(DOCUMENT);                      // Dokument für Browser- und Motion-Prüfungen.
  private readonly pending = new Map<HTMLElement, () => void>();     // Noch nicht aufgedeckte Inhalte.
  private observer?: IntersectionObserver;                           // Layoutänderungen an den ausstehenden Inhalten.
  private frameId: number | null = null;                             // Noch ausstehende gemeinsame Messung.
  private readonly requestCheck = this.scheduleCheck.bind(this);     // Stabiler Browser-Ereignislistener.
  private readonly runCheck = this.revealReachedElements.bind(this); // Stabiler Callback der Frame-Messung.
  private readonly scrollEvents = ['scroll', 'resize', 'scrollend']; // Auslöser der gemeinsamen Messung.

  /**
   * Registriert einen Reveal und liefert dessen Lifecycle-Aufräumfunktion.
   * @param element Element, dessen obere Kante die Reveal-Linie erreichen soll.
   * @param reveal Einmalig auszuführende Sichtbarkeitsaktualisierung.
   */
  register(element: HTMLElement, reveal: () => void): () => void {
    /**
     * Für Beobachtung und Frames verfügbares Browserfenster.
     */
    const windowRef = this.document.defaultView;
    if (!windowRef || this.shouldRevealImmediately(windowRef)) {
      reveal();
      return ignoreCleanup;
    }
    if (this.pending.size === 0) this.startObservation(windowRef);
    this.pending.set(element, reveal);
    this.observer?.observe(element);
    this.requestCheck();
    return this.remove.bind(this, element);
  }

  /**
   * Prüft fehlende Browser-Unterstützung sowie die bisherigen Motion- und Comfort-Modi.
   * @param windowRef Verfügbares Browserfenster.
   */
  private shouldRevealImmediately(windowRef: Window): boolean {
    /**
     * Globale Darstellungspräferenzen des Dokuments.
     */
    const root = this.document.documentElement;
    return (
      !('IntersectionObserver' in windowRef) ||
      windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      root.dataset['motion'] === 'off' ||
      root.dataset['motion'] === 'reduced' ||
      root.dataset['comfort'] === 'simple'
    );
  }

  /**
   * Aktiviert die gemeinsame Beobachtung für die ersten ausstehenden Inhalte.
   * @param windowRef Verfügbares Browserfenster einschließlich Browser-Konstruktoren.
   */
  private startObservation(windowRef: Window & typeof globalThis): void {
    this.observer = new windowRef.IntersectionObserver(this.requestCheck, {
      threshold: 0,
      rootMargin: '0px 0px -8% 0px',
    });
    /**
     * Ereignisse, die eine neue Positionsmessung auslösen.
     */
    for (const type of this.scrollEvents) windowRef.addEventListener(type, this.requestCheck, { passive: true });
  }

  /** Bündelt Scroll-Ereignisse in höchstens einer Messung pro Browser-Frame. */
  private scheduleCheck(): void {
    /**
     * Browserfenster für die nächste gemeinsame Frame-Messung.
     */
    const windowRef = this.document.defaultView;
    if (!windowRef || this.frameId !== null || this.pending.size === 0) return;
    this.frameId = windowRef.requestAnimationFrame(this.runCheck);
  }

  /** Deckt alle erreichten Inhalte auf, einschließlich vollständig übersprungener Abschnitte. */
  private revealReachedElements(): void {
    this.frameId = null;
    /**
     * Höhe der bisherigen Reveal-Linie innerhalb des Viewports.
     */
    const revealLine = (this.document.defaultView?.innerHeight || this.document.documentElement.clientHeight) * 0.92;
    /**
     * Vor den Callbacks vollständig gemessene, bereits erreichte Inhalte.
     */
    const reached = this.collectReachedElements(revealLine);
    /**
     * Einmalig aufgedeckte Einträge der abgeschlossenen Positionsmessung.
     */
    for (const [element, reveal] of reached) {
      this.remove(element);
      reveal();
    }
  }

  /**
   * Misst ausstehende Inhalte vor der ersten DOM-verändernden Sichtbarkeitsaktualisierung.
   * @param revealLine Vertikale Grenze für sichtbare und übersprungene Inhalte.
   */
  private collectReachedElements(revealLine: number): Array<[HTMLElement, () => void]> {
    return Array.from(this.pending).filter(
      /**
       * Prüft die obere Elementkante gegen die Reveal-Linie.
       * @param entry Element und zugehörige Sichtbarkeitsaktualisierung.
       */
      (entry) => entry[0].getBoundingClientRect().top <= revealLine,
    );
  }

  /**
   * Entfernt einen Eintrag und stoppt bei leerer Warteliste die gemeinsame Beobachtung.
   * @param element Erledigtes oder aus dem DOM entferntes Reveal-Element.
   */
  private remove(element: HTMLElement): void {
    this.pending.delete(element);
    this.observer?.unobserve(element);
    if (this.pending.size === 0) this.stopObservation();
  }

  /** Gibt Observer, Browser-Ereignisse und die noch ausstehende Frame-Messung frei. */
  private stopObservation(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    /**
     * Browserfenster mit den zuvor registrierten Ereignissen.
     */
    const windowRef = this.document.defaultView;
    /**
     * Für die gemeinsame Messung registrierte Ereignistypen.
     */
    for (const type of this.scrollEvents) windowRef?.removeEventListener(type, this.requestCheck);
    if (this.frameId !== null) windowRef?.cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }
}

/** Liefert für sofort sichtbare Inhalte eine ereignisfreie Aufräumfunktion. */
function ignoreCleanup(): void {}
