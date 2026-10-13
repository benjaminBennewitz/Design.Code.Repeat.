/* src/app/shared/system-page/status-counter.spec.ts */
import { describe, expect, it, vi } from 'vitest';
import { StatusCounter } from './status-counter';

/** Prüft den einmaligen dekorativen Statuszähler. */
function verifyCounter(): void {
  it('zählt zeitbasiert bis 404 und startet nicht erneut', verifyCompletion);
  it('beendet ausstehende Frames bei reduzierter Bewegung', verifyFinish);
  it('benötigt außerhalb des Browsers keine Animation', verifyServer);
}

/** Kontrolliert angeforderte Browserframes ohne reale Zeitabhängigkeit. */
class FrameControl {
  private callback: FrameRequestCallback = ignoreFrame; // Zuletzt angeforderter Browserframe.
  readonly browser = { // Minimales Browserfenster mit kontrollierter Frameplanung.
    requestAnimationFrame: vi.fn(this.requestFrame.bind(this)),
    cancelAnimationFrame: vi.fn(),
  }; // Kontrolliertes Browserfenster der Frame-Simulation.

  /**
   * Speichert den nächsten angeforderten Animationsschritt.
   * @param next Callback des angeforderten Frames.
   */
  private requestFrame(next: FrameRequestCallback): number {
    this.callback = next;
    return 1;
  }

  /**
   * Führt den zuletzt angeforderten Frame mit dem Testzeitstempel aus.
   * @param time Zeitstempel des simulierten Browserframes.
   */
  advance(time: number): void {
    this.callback(time);
  }
}

/** Bleibt ohne Wirkung, solange noch kein Browserframe angefordert wurde. */
function ignoreFrame(): void { }

/** Erstellt ein kontrollierbares Browserfenster für einzelne Animationsframes. */
function createBrowser(): FrameControl {
  return new FrameControl();
}

/** Prüft Endwert, übersprungene Frames und die einmalige Ausführung. */
function verifyCompletion(): void {
  /**
   * Kontrollierte Browserframes für den zeitbasierten Fortschritt.
   */
  const control = createBrowser();
  /**
   * Zähler mit einem minimalen Browserfenster.
   */
  const counter = new StatusCounter(control.browser as unknown as Window);
  counter.start();
  expect(counter.display()).toBe('000');
  control.advance(100);
  control.advance(700);
  expect(counter.display()).toBe('354');
  control.advance(2100);
  expect(counter.display()).toBe('404');
  expect(counter.complete()).toBe(true);
  counter.start();
  expect(control.browser.requestAnimationFrame).toHaveBeenCalledTimes(3);
}

/** Prüft den sofortigen statischen Abschluss und die Freigabe des Frames. */
function verifyFinish(): void {
  /**
   * Kontrollierte Browserframes für den vorzeitigen Abschluss.
   */
  const control = createBrowser();
  /**
   * Zähler mit abbrechbarer Frameplanung.
   */
  const counter = new StatusCounter(control.browser as unknown as Window);
  counter.start();
  counter.finish();
  expect(control.browser.cancelAnimationFrame).toHaveBeenCalledWith(1);
  expect(counter.display()).toBe('404');
  expect(counter.complete()).toBe(true);
}

/** Prüft den lesbaren Endwert ohne verfügbares Browserfenster. */
function verifyServer(): void {
  /**
   * Statischer Zähler ohne Browserabhängigkeiten.
   */
  const counter = new StatusCounter(null);
  counter.start();
  expect(counter.display()).toBe('404');
  expect(counter.complete()).toBe(true);
}

describe('StatusCounter', verifyCounter);
