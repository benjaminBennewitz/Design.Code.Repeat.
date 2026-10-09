/** @file Regressionstests für dynamische Anker, Scroll-Restoration und abgebrochene Sprünge. */
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { FragmentScrollService } from './fragment-scroll.service';

describe('FragmentScrollService', () => {
  let events: Subject<unknown>;
  let frames: Map<number, FrameRequestCallback>;
  let frameId: number;
  let scrollTo: ReturnType<typeof vi.spyOn>;

  const renderFrame = (): void => {
    const pending = [...frames.entries()];
    frames.clear();
    for (const [, callback] of pending) callback(0);
  };
  const navigate = (position: [number, number] | null = null): void => {
    events.next(new Scroll(new NavigationEnd(1, '/#prozess', '/#prozess'), position, 'prozess'));
  };

  beforeEach(() => {
    events = new Subject();
    frames = new Map();
    frameId = 0;
    document.body.innerHTML = '<div id="prozess" class="home-deferred-placeholder"></div>';
    Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loaded' } });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => { frames.delete(id); });
    scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { events } }] });
    TestBed.inject(FragmentScrollService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    document.documentElement.classList.remove('dcr-anchor-is-scrolling');
    document.body.innerHTML = '';
  });

  it('wartet auf echten Inhalt und korrigiert eine nachträgliche Höhenänderung', () => {
    const target = document.getElementById('prozess')!;
    let top = 700;
    vi.spyOn(target, 'getBoundingClientRect').mockImplementation(() => ({ top } as DOMRect));
    navigate();
    renderFrame();
    expect(scrollTo).not.toHaveBeenCalled();
    target.classList.remove('home-deferred-placeholder');
    renderFrame();
    top = 1700;
    for (let index = 0; index < 6; index++) renderFrame();
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1700, left: 0, behavior: 'instant' });
    expect(document.documentElement.classList.contains('dcr-anchor-is-scrolling')).toBe(false);
  });

  it('stellt gespeicherte Zurück-Positionen wieder her statt zum Ankeranfang zu springen', () => {
    document.getElementById('prozess')!.classList.remove('home-deferred-placeholder');
    navigate([0, 500]);
    for (let index = 0; index < 6; index++) renderFrame();
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 500, left: 0, behavior: 'instant' });
  });

  it('bricht eine alte Korrektur beim nächsten Routenwechsel ab', () => {
    navigate();
    events.next(new NavigationStart(2, '/kontakt'));
    expect(frames.size).toBe(0);
    expect(document.documentElement.classList.contains('dcr-anchor-is-scrolling')).toBe(false);
  });

  it('übernimmt nach manueller Scroll-Eingabe nicht erneut die Kontrolle', () => {
    navigate();
    window.dispatchEvent(new Event('wheel'));
    renderFrame();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(document.documentElement.classList.contains('dcr-anchor-is-scrolling')).toBe(false);
  });
});
