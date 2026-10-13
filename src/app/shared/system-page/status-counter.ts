/* src/app/shared/system-page/status-counter.ts */
import { signal } from '@angular/core';

/** Zählt einmalig bis 404, ohne die semantische Fehlermeldung zu verändern. */
export class StatusCounter {
  readonly display = signal('404'); // Dekorative Ziffern mit konstant drei Stellen.
  readonly complete = signal(true); // Abschluss des einmaligen Zählvorgangs.
  private frameId = 0; // Noch ausstehender Browser-Frame.
  private startedAt?: number; // Zeitstempel des ersten Animations-Frames.
  private hasStarted = false; // Verhindert einen erneuten Zählvorgang derselben Instanz.
  private readonly advanceCallback = this.advance.bind(this); // Stabiler Callback der Zählanimation.

  /**
   * Verbindet die Animation mit dem verfügbaren Browserfenster.
   * @param windowRef Browserfenster oder null außerhalb des Browsers.
   */
  constructor(private readonly windowRef: Window | null) {}

  /** Beginnt den Zählvorgang einmalig mit der ersten sichtbaren Browser-Messung. */
  start(): void {
    if (this.hasStarted || !this.windowRef) return;
    this.hasStarted = true;
    this.display.set('000');
    this.complete.set(false);
    this.scheduleFrame();
  }

  /** Zeigt unmittelbar den Endwert und beendet noch ausstehende Frames. */
  finish(): void {
    this.stop();
    this.hasStarted = true;
    this.display.set('404');
    this.complete.set(true);
  }

  /** Gibt einen noch ausstehenden Frame beim Entfernen der Seite frei. */
  stop(): void {
    if (this.frameId) this.windowRef?.cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  /** Plant genau einen weiteren Schritt der Zählanimation. */
  private scheduleFrame(): void {
    this.frameId = this.windowRef?.requestAnimationFrame(this.advanceCallback) ?? 0;
  }

  /**
   * Überträgt den gebremsten Zählfortschritt in die dekorativen Ziffern.
   * @param timestamp Zeitstempel des aktuellen Browser-Frames.
   */
  private advance(timestamp: number): void {
    this.frameId = 0;
    this.startedAt ??= timestamp;
    /**
     * Auf die einmalige Dauer von 1,2 Sekunden begrenzter Fortschritt.
     */
    const progress = Math.min(1, Math.max(0, (timestamp - this.startedAt) / 1200));
    this.display.set(
      Math.round(404 * (1 - (1 - progress) ** 3))
        .toString()
        .padStart(3, '0'),
    );
    if (progress === 1) this.finish();
    else this.scheduleFrame();
  }
}
