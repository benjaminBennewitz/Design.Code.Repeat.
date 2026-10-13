/* src/app/core/services/scroll-reveal.service.spec.ts */
import { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ScrollRevealService } from './scroll-reveal.service';

let service: ScrollRevealService; // Reveal-Service der aktuellen Testinstanz.

let frame: FrameRequestCallback | undefined; // Noch ausstehender simulierter Browserframe.

let observerCallback: IntersectionObserverCallback; // Callback der kontrollierten Sichtbarkeitsbeobachtung.

let disconnect: ReturnType<typeof vi.fn>; // Prüfbarer Abschluss der Sichtbarkeitsbeobachtung.

const cleanups: Array<() => void> = []; // Gesammelte Abmeldungen der registrierten Reveal-Elemente.


/**
 * Erstellt ein Testelement an einer kontrollierten Dokumentposition.
 * @param top Vertikale Dokumentposition des Testelements.
 * @param height Simulierte Höhe des Testelements.
 */
function elementAt(top: number, height = 100): HTMLElement {
  /**
   * Testelement mit kontrollierter Position im Dokument.
   */
  const element = document.createElement('div');
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top, bottom: top + height, height, left: 0, right: 100, width: 100, x: 0, y: top,
    toJSON: /** Erfüllt die Serialisierungsschnittstelle des simulierten DOM-Rechtecks. */
      () => ({}),
  });
  return element;
}


/** Führt den ausstehenden Reveal-Frame genau einmal aus. */
function flushFrame(): void {
  /**
   * Aktuell geplanter Browserframe.
   */
  const callback = frame;
  frame = undefined;
  callback?.(0);
}
/** Registriert die fachlichen Regressionstests dieses Bereichs. */
function registerTests(): void {
  beforeEach(prepareTest);
  afterEach(cleanUpTest);
  it('deckt sichtbare und sehr hohe Elemente ohne Mindestüberschneidung auf', verifyTallElement);
  it('deckt bei einem einzigen Scroll-Sprung alle übersprungenen Inhalte auf', verifySkippedContent);
  it('lässt kommende Inhalte verborgen und bündelt Scroll-Ereignisse pro Frame', verifyFrameBatching);
  it('prüft durch Layoutänderungen sichtbar gewordene Inhalte erneut', verifyLayoutChange);
  it('deckt bei einem direkten Einstieg weiter unten auch vorherige Inhalte auf', verifyDeepEntry);
  it('entfernt ausstehende Reveals beim Routenwechsel einschließlich Browser-Frame', verifyRouteCleanup);
  it.each(['off', 'reduced'])('zeigt bei Motion-Modus %s alle Inhalte sofort', verifyMotionModes);
  it('zeigt bei reduzierter Systembewegung alle Inhalte sofort', verifySystemMotion);
  it('lässt Inhalte ohne IntersectionObserver sichtbar', verifyMissingObserver);
}

/** Bereitet eine isolierte Testinstanz mit kontrollierten Browserzuständen vor. */
function prepareTest(): void {
  TestBed.configureTestingModule({});
  service = TestBed.inject(ScrollRevealService);
  frame = undefined;
  disconnect = vi.fn();
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
  vi.stubGlobal('matchMedia', vi.fn(fullMotion));
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(storeFrame);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearFrame);
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
}

/** Kontrolliert die Sichtbarkeitsbeobachtung ohne echte Layoutabhängigkeiten. */
class TestIntersectionObserver {
  observe = vi.fn(); // Prüfbarer Beginn einer Sichtbarkeitsbeobachtung.
  unobserve = vi.fn(); // Prüfbare Abmeldung eines Elements.
  disconnect = disconnect; // Prüfbarer Abschluss der aktuellen Beobachtung.

  /**
   * Speichert die vom Service registrierte Sichtbarkeitsprüfung.
   * @param callback Callback der kontrollierten Sichtbarkeitsbeobachtung.
   */
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
}

/** Simuliert uneingeschränkte Systembewegung. */
function fullMotion(): { matches: boolean } {
  return { matches: false };
}

/**
 * Speichert den angeforderten Reveal-Frame.
 * @param callback Auszuführender Browserframe.
 */
function storeFrame(callback: FrameRequestCallback): number {
  frame = callback;
  return 1;
}

/** Verwirft einen abgebrochenen Reveal-Frame. */
function clearFrame(): void {
  frame = undefined;
}

/** Gibt Testinstanzen und simulierte Browserzustände frei. */
function cleanUpTest(): void {
  cleanups.splice(0).forEach(
    /**
     * Meldet die bestehende Reveal-Registrierung ab.
     * @param cleanup Abmeldung einer noch bestehenden Reveal-Registrierung.
     */
    (cleanup) => cleanup());
  delete document.documentElement.dataset['motion'];
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  TestBed.resetTestingModule();
}

/** Deckt sichtbare und sehr hohe Elemente ohne Mindestüberschneidung auf. */
function verifyTallElement(): void {
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(elementAt(900, 5000), reveal));
  flushFrame();
  expect(reveal).toHaveBeenCalledOnce();
  expect(disconnect).toHaveBeenCalledOnce();
}

/** Deckt bei einem einzigen Scroll-Sprung alle übersprungenen Inhalte auf. */
function verifySkippedContent(): void {
  /**
   * Elemente vor und nach dem simulierten Scroll-Sprung.
   */
  const elements = [elementAt(1500), elementAt(2500), elementAt(3500)];
  /**
   * Unabhängiger Aufdeckungs-Callback pro Element.
   */
  const reveals = elements.map(createReveal);
  registerElements(elements, reveals);
  flushFrame();
  reveals.forEach(expectHidden);
  elements.forEach(moveAboveViewport);
  window.dispatchEvent(new Event('scroll'));
  flushFrame();
  reveals.forEach(expectRevealed);
  window.dispatchEvent(new Event('scroll'));
  flushFrame();
  reveals.forEach(expectRevealed);
}

/** Erstellt einen kontrollierten Aufdeckungs-Callback. */
function createReveal(): Mock<() => void> {
  return vi.fn<() => void>();
}

/**
 * Registriert die Elemente mit ihren jeweils eigenen Aufdeckungs-Callbacks.
 * @param elements Beobachtete Testelemente.
 * @param reveals Aufdeckungs-Callbacks in derselben Reihenfolge.
 */
function registerElements(elements: HTMLElement[], reveals: Mock<() => void>[]): void {
  /**
   * Laufende Position innerhalb der verarbeiteten Folge.
   */
  for (let index = 0;index < elements.length;index++) {
    cleanups.push(service.register(elements[index], reveals[index]));
  }
}

/**
 * Versetzt das Element an seine Position nach dem Scroll-Sprung.
 * @param element Testelement mit kontrollierten Layoutmaßen.
 * @param index Position innerhalb der Testfolge.
 */
function moveAboveViewport(element: HTMLElement, index: number): void {
  vi.mocked(element.getBoundingClientRect).mockReturnValue(elementAt(-3500 + index * 1000).getBoundingClientRect());
}

/**
 * Prüft, dass der kommende Inhalt noch verborgen bleibt.
 * @param reveal Aufdeckungs-Callback des Elements.
 */
function expectHidden(reveal: ReturnType<typeof vi.fn>): void {
  expect(reveal).not.toHaveBeenCalled();
}

/**
 * Prüft die genau einmalige Aufdeckung des Elements.
 * @param reveal Aufdeckungs-Callback des Elements.
 */
function expectRevealed(reveal: ReturnType<typeof vi.fn>): void {
  expect(reveal).toHaveBeenCalledOnce();
}

/** Lässt kommende Inhalte verborgen und bündelt Scroll-Ereignisse pro Frame. */
function verifyFrameBatching(): void {
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(elementAt(1500), reveal));
  flushFrame();
  vi.mocked(window.requestAnimationFrame).mockClear();
  /**
   * Laufende Position innerhalb der verarbeiteten Folge.
   */
  for (let index = 0;index < 10;index++) {
    window.dispatchEvent(new Event('scroll'));
  }
  expect(window.requestAnimationFrame).toHaveBeenCalledOnce();
  flushFrame();
  expect(reveal).not.toHaveBeenCalled();
}

/** Prüft durch Layoutänderungen sichtbar gewordene Inhalte erneut. */
function verifyLayoutChange(): void {
  /**
   * Testelement mit kontrollierter Position im Dokument.
   */
  const element = elementAt(1500);
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(element, reveal));
  flushFrame();
  vi.mocked(element.getBoundingClientRect).mockReturnValue(elementAt(500).getBoundingClientRect());
  observerCallback([], {} as IntersectionObserver);
  flushFrame();
  expect(reveal).toHaveBeenCalledOnce();
}

/** Deckt bei einem direkten Einstieg weiter unten auch vorherige Inhalte auf. */
function verifyDeepEntry(): void {
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(elementAt(-2000), reveal));
  flushFrame();
  expect(reveal).toHaveBeenCalledOnce();
}

/** Entfernt ausstehende Reveals beim Routenwechsel einschließlich Browser-Frame. */
function verifyRouteCleanup(): void {
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  /**
   * Abmeldung der aktuellen Reveal-Registrierung.
   */
  const cleanup = service.register(elementAt(500), reveal);
  cleanup();
  flushFrame();
  expect(reveal).not.toHaveBeenCalled();
  expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
  expect(disconnect).toHaveBeenCalledOnce();
  vi.mocked(window.requestAnimationFrame).mockClear();
  window.dispatchEvent(new Event('scroll'));
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
}

/**
 * Zeigt bei Motion-Modus %s alle Inhalte sofort.
 * @param mode Gewählter Testwert der parametrisierten Prüfung.
 */
function verifyMotionModes(mode: string): void {
  document.documentElement.dataset['motion'] = mode;
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(elementAt(2000), reveal));
  expect(reveal).toHaveBeenCalledOnce();
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
}

/** Zeigt bei reduzierter Systembewegung alle Inhalte sofort. */
function verifySystemMotion(): void {
  vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(elementAt(2000), reveal));
  expect(reveal).toHaveBeenCalledOnce();
}

/** Lässt Inhalte ohne IntersectionObserver sichtbar. */
function verifyMissingObserver(): void {
  Reflect.deleteProperty(window, 'IntersectionObserver');
  /**
   * Prüfbarer Aufdeckungsaufruf des registrierten Elements.
   */
  const reveal = vi.fn();
  cleanups.push(service.register(elementAt(2000), reveal));
  expect(reveal).toHaveBeenCalledOnce();
}

describe('ScrollRevealService', registerTests);
