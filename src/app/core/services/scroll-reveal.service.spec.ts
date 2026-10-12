/* src/app/core/services/scroll-reveal.service.spec.ts */
import { TestBed } from '@angular/core/testing';
import { ScrollRevealService } from './scroll-reveal.service';

/** Simuliert Scroll-Sprünge, ohne auf Zwischenpositionen des Browsers angewiesen zu sein. */
describe('ScrollRevealService', () => {
  let service: ScrollRevealService;
  let frame: FrameRequestCallback | undefined;
  let observerCallback: IntersectionObserverCallback;
  let disconnect: ReturnType<typeof vi.fn>;
  const cleanups: Array<() => void> = [];

  function elementAt(top: number, height = 100): HTMLElement {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      top, bottom: top + height, height, left: 0, right: 100, width: 100, x: 0, y: top,
      toJSON: () => ({}),
    });
    return element;
  }

  function flushFrame(): void {
    const callback = frame;
    frame = undefined;
    callback?.(0);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollRevealService);
    frame = undefined;
    disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { observerCallback = callback; }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnect;
    });
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => { frame = undefined; });
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
  });

  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
    delete document.documentElement.dataset['motion'];
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('deckt sichtbare und sehr hohe Elemente ohne Mindestüberschneidung auf', () => {
    const reveal = vi.fn();
    cleanups.push(service.register(elementAt(900, 5000), reveal));
    flushFrame();
    expect(reveal).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it('deckt bei einem einzigen Scroll-Sprung alle übersprungenen Inhalte auf', () => {
    const elements = [elementAt(1500), elementAt(2500), elementAt(3500)];
    const reveals = elements.map(() => vi.fn());
    elements.forEach((element, index) => cleanups.push(service.register(element, reveals[index]!)));
    flushFrame();
    reveals.forEach((reveal) => expect(reveal).not.toHaveBeenCalled());
    elements.forEach((element, index) => {
      vi.mocked(element.getBoundingClientRect).mockReturnValue(elementAt(-3500 + index * 1000).getBoundingClientRect());
    });
    window.dispatchEvent(new Event('scroll'));
    flushFrame();
    reveals.forEach((reveal) => expect(reveal).toHaveBeenCalledOnce());
    window.dispatchEvent(new Event('scroll'));
    flushFrame();
    reveals.forEach((reveal) => expect(reveal).toHaveBeenCalledOnce());
  });

  it('lässt kommende Inhalte verborgen und bündelt Scroll-Ereignisse pro Frame', () => {
    const reveal = vi.fn();
    cleanups.push(service.register(elementAt(1500), reveal));
    flushFrame();
    vi.mocked(window.requestAnimationFrame).mockClear();
    for (let index = 0; index < 10; index++) {
      window.dispatchEvent(new Event('scroll'));
    }
    expect(window.requestAnimationFrame).toHaveBeenCalledOnce();
    flushFrame();
    expect(reveal).not.toHaveBeenCalled();
  });

  it('prüft durch Layoutänderungen sichtbar gewordene Inhalte erneut', () => {
    const element = elementAt(1500);
    const reveal = vi.fn();
    cleanups.push(service.register(element, reveal));
    flushFrame();
    vi.mocked(element.getBoundingClientRect).mockReturnValue(elementAt(500).getBoundingClientRect());
    observerCallback([], {} as IntersectionObserver);
    flushFrame();
    expect(reveal).toHaveBeenCalledOnce();
  });

  it('deckt bei einem direkten Einstieg weiter unten auch vorherige Inhalte auf', () => {
    const reveal = vi.fn();
    cleanups.push(service.register(elementAt(-2000), reveal));
    flushFrame();
    expect(reveal).toHaveBeenCalledOnce();
  });

  it('entfernt ausstehende Reveals beim Routenwechsel einschließlich Browser-Frame', () => {
    const reveal = vi.fn();
    const cleanup = service.register(elementAt(500), reveal);
    cleanup();
    flushFrame();
    expect(reveal).not.toHaveBeenCalled();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(disconnect).toHaveBeenCalledOnce();
    vi.mocked(window.requestAnimationFrame).mockClear();
    window.dispatchEvent(new Event('scroll'));
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it.each(['off', 'reduced'])('zeigt bei Motion-Modus %s alle Inhalte sofort', (mode) => {
    document.documentElement.dataset['motion'] = mode;
    const reveal = vi.fn();
    cleanups.push(service.register(elementAt(2000), reveal));
    expect(reveal).toHaveBeenCalledOnce();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('zeigt bei reduzierter Systembewegung alle Inhalte sofort', () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    const reveal = vi.fn();
    cleanups.push(service.register(elementAt(2000), reveal));
    expect(reveal).toHaveBeenCalledOnce();
  });

  it('lässt Inhalte ohne IntersectionObserver sichtbar', () => {
    Reflect.deleteProperty(window, 'IntersectionObserver');
    const reveal = vi.fn();
    cleanups.push(service.register(elementAt(2000), reveal));
    expect(reveal).toHaveBeenCalledOnce();
  });
});
