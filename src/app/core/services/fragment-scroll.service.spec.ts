/* src/app/core/services/fragment-scroll.service.spec.ts */
/** @file Regressionstests für dynamische Anker, Scroll-Restoration und abgebrochene Sprünge. */
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { FragmentScrollService } from './fragment-scroll.service';

let anchorTop = 700; // Veränderbare Dokumentposition des getesteten Ankers.
let events: Subject<unknown>; // Kontrollierter Strom von Router-Ereignissen.

let frames: Map<number, FrameRequestCallback>; // Noch ausstehende Frames mit ihrer jeweiligen Kennung.

let frameId: number; // Fortlaufende Kennung der simulierten Browserframes.

let scrollTo: ReturnType<typeof vi.spyOn>; // Prüfbarer Aufruf der vertikalen Browsernavigation.


const renderFrame = /** Führt die bisher registrierten Router-Frames aus. */
  (): void => {
    /**
     * Kopie der zum aktuellen Render-Durchlauf geplanten Frames.
     */
    const pending = [...frames.entries()];
    frames.clear();
    /**
     * Auszuführender Callback des aktuellen Browserframes.
     */
    for (const [, callback] of pending) callback(0);
  }; // Führt die bisher angeforderten Browserframes aus.

const navigate =
  /**
   * Sendet einen Router-Scroll mit dem gewünschten Restaurationsziel.
   * @param position Optional gespeicherte Browserposition der Navigation.
   */
  (position: [number, number] | null = null): void => {
    events.next(new Scroll(new NavigationEnd(1, '/#prozess', '/#prozess'), position, 'prozess'));
  }; // Simuliert eine abgeschlossene Navigation zum Prozessanker.
/** Registriert die fachlichen Regressionstests dieses Bereichs. */
function registerTests(): void {
  beforeEach(prepareTest);
  afterEach(cleanUpTest);
  it('wartet auf echten Inhalt und korrigiert eine nachträgliche Höhenänderung', verifyDynamicAnchor);
  it('stellt gespeicherte Zurück-Positionen wieder her statt zum Ankeranfang zu springen', verifyRestoredPosition);
  it('bricht eine alte Korrektur beim nächsten Routenwechsel ab', verifyNavigationAbort);
  it('übernimmt nach manueller Scroll-Eingabe nicht erneut die Kontrolle', verifyManualScroll);
}

/** Bereitet eine isolierte Testinstanz mit kontrollierten Browserzuständen vor. */
function prepareTest(): void {
  events = new Subject();
  frames = new Map();
  frameId = 0;
  document.body.innerHTML = '<div id="prozess" class="home-deferred-placeholder"></div>';
  Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loaded' } });
  configureBrowserFrames();
  TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { events } }] });
  TestBed.inject(FragmentScrollService);
}

/** Ersetzt Browserframes und Navigation durch kontrollierte Testfunktionen. */
function configureBrowserFrames(): void {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(storeFrame);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(cancelFrame);
  scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(ignoreNavigation);
}

/**
 * Registriert einen Browserframe mit eigener Kennung.
 * @param callback Auszuführender Browserframe.
 */
function storeFrame(callback: FrameRequestCallback): number {
  frames.set(++frameId, callback);
  return frameId;
}

/**
 * Entfernt einen abgebrochenen Browserframe aus der Simulation.
 * @param id Kennung des angeforderten Browserframes.
 */
function cancelFrame(id: number): void {
  frames.delete(id);
}

/** Verhindert echte Browsernavigation während der Prüfung. */
function ignoreNavigation(): void { }

/** Liefert die nachträglich veränderbare Position des Prozessankers. */
function anchorRect(): DOMRect {
  return { top: anchorTop } as DOMRect;
}

/** Gibt Testinstanzen und simulierte Browserzustände frei. */
function cleanUpTest(): void {
  TestBed.resetTestingModule();
  vi.restoreAllMocks();
  document.documentElement.classList.remove('dcr-anchor-is-scrolling');
  document.body.innerHTML = '';
}

/** Wartet auf echten Inhalt und korrigiert eine nachträgliche Höhenänderung. */
function verifyDynamicAnchor(): void {
  /**
   * Ankerelement mit kontrollierbarer Höhe und Ladephase.
   */
  const target = document.getElementById('prozess')!;
  anchorTop = 700;
  vi.spyOn(target, 'getBoundingClientRect').mockImplementation(anchorRect);
  navigate();
  renderFrame();
  expect(scrollTo).not.toHaveBeenCalled();
  target.classList.remove('home-deferred-placeholder');
  renderFrame();
  anchorTop = 1700;
  /**
   * Laufende Position innerhalb der verarbeiteten Folge.
   */
  for (let index = 0;index < 6;index++) renderFrame();
  expect(scrollTo).toHaveBeenLastCalledWith({ top: 1700, left: 0, behavior: 'instant' });
  expect(document.documentElement.classList.contains('dcr-anchor-is-scrolling')).toBe(false);
}

/** Stellt gespeicherte Zurück-Positionen wieder her statt zum Ankeranfang zu springen. */
function verifyRestoredPosition(): void {
  document.getElementById('prozess')!.classList.remove('home-deferred-placeholder');
  navigate([0, 500]);
  /**
   * Laufende Position innerhalb der verarbeiteten Folge.
   */
  for (let index = 0;index < 6;index++) renderFrame();
  expect(scrollTo).toHaveBeenLastCalledWith({ top: 500, left: 0, behavior: 'instant' });
}

/** Bricht eine alte Korrektur beim nächsten Routenwechsel ab. */
function verifyNavigationAbort(): void {
  navigate();
  events.next(new NavigationStart(2, '/kontakt'));
  expect(frames.size).toBe(0);
  expect(document.documentElement.classList.contains('dcr-anchor-is-scrolling')).toBe(false);
}

/** Übernimmt nach manueller Scroll-Eingabe nicht erneut die Kontrolle. */
function verifyManualScroll(): void {
  navigate();
  window.dispatchEvent(new Event('wheel'));
  renderFrame();
  expect(scrollTo).not.toHaveBeenCalled();
  expect(document.documentElement.classList.contains('dcr-anchor-is-scrolling')).toBe(false);
}

describe('FragmentScrollService', registerTests);
