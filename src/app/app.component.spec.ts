/* src/app/app.component.spec.ts */
import { ViewportScroller } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { LanguageService } from './core/services/language.service';

let fixture: ComponentFixture<AppComponent>; // Root-Komponente ohne gerenderte Kindkomponenten.
let events: Subject<unknown>; // Kontrollierte Router-Ereignisse der aktuellen Prüfung.
let frames: Map<number, FrameRequestCallback>; // Noch ausstehende Browser-Frames.
let frameId = 0; // Fortlaufende Identität der simulierten Frames.

/** Registriert Prüfungen für Seitennavigation, Render-Freigabe und Fragmentwechsel. */
function registerNavigationTests(): void {
  beforeEach(prepareNavigationTest);
  afterEach(cleanUpNavigationTest);
  it('blendet vor dem Scroll-Reset aus und gibt erst nach zwei Frames frei', expectRouteRenderDelay);
  it('blendet bei reinen Fragmentwechseln nicht erneut aus', expectFragmentNavigation);
  it('gibt eine abgebrochene Navigation unmittelbar frei', expectCancelledNavigation);
  it('erkennt nach dem Abschluss die neue Route als aktuellen Pfad', expectUpdatedRoutePath);
}

/** Erstellt unabhängige Router-, Scroll- und Frame-Doubles für die Root-Komponente. */
async function prepareNavigationTest(): Promise<void> {
  events = new Subject();
  frames = new Map();
  frameId = 0;
  vi.spyOn(window, 'scrollTo').mockImplementation(ignoreScroll);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(scheduleFrame);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(cancelFrame);
  TestBed.configureTestingModule({
    providers: [
      { provide: LanguageService, useValue: { content: navigationContent } },
      { provide: Router, useValue: { url: '/', events } },
      { provide: ViewportScroller, useValue: { setOffset: ignoreScroll } },
    ],
  });
  TestBed.overrideComponent(AppComponent, { set: { template: '', imports: [] } });
  await TestBed.compileComponents();
  fixture = TestBed.createComponent(AppComponent);
}

/** Gibt Root-Komponente, TestBed, Frames und temporäre Route-Klasse frei. */
function cleanUpNavigationTest(): void {
  fixture?.destroy();
  TestBed.resetTestingModule();
  vi.restoreAllMocks();
  document.documentElement.classList.remove('dcr-route-is-changing');
}

/** Liefert ausschließlich den für die Root-Navigation erforderlichen Tab-Hinweis. */
function navigationContent(): { meta: { hiddenTitle: string } } {
  return { meta: { hiddenTitle: 'Rückkehrhinweis' } };
}

/** Unterdrückt das im Test nicht verfügbare native Scrollen. */
function ignoreScroll(): void {}

/**
 * Erfasst eine im nächsten Browser-Frame auszuführende Funktion.
 * @param callback Geplanter Frame-Auftrag der Root-Komponente.
 */
function scheduleFrame(callback: FrameRequestCallback): number {
  frames.set(++frameId, callback);
  return frameId;
}

/**
 * Entfernt einen noch nicht ausgeführten Frame-Auftrag.
 * @param id Identität des abzubrechenden Frames.
 */
function cancelFrame(id: number): void {
  frames.delete(id);
}

/** Führt ausschließlich die zum Frame-Beginn ausstehenden Aufträge aus. */
function renderFrame(): void {
  /**
   * Snapshot vor neu angeforderten Aufträgen des nächsten Frames.
   */
  const pending = [...frames.values()];
  frames.clear();
  /**
   * Im aktuellen Frame auszuführender Callback.
   */
  for (const callback of pending) callback(0);
}

/** Prüft die bestehende Reihenfolge von Ausblenden, Scroll-Reset und Render-Freigabe. */
function expectRouteRenderDelay(): void {
  events.next(new NavigationStart(1, '/leistungen'));
  expect(fixture.componentInstance.isRouteChanging()).toBe(true);
  expect(document.documentElement.classList.contains('dcr-route-is-changing')).toBe(true);
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  events.next(new NavigationEnd(1, '/leistungen', '/leistungen'));
  renderFrame();
  expect(fixture.componentInstance.isRouteChanging()).toBe(true);
  renderFrame();
  expect(fixture.componentInstance.isRouteChanging()).toBe(false);
  expect(document.documentElement.classList.contains('dcr-route-is-changing')).toBe(false);
}

/** Prüft, dass reine Ankersprünge weiterhin dem Fragment-Service überlassen werden. */
function expectFragmentNavigation(): void {
  events.next(new NavigationStart(1, '/#faq'));
  expect(fixture.componentInstance.isRouteChanging()).toBe(false);
  expect(window.scrollTo).not.toHaveBeenCalled();
}

/** Prüft die sofortige Freigabe nach einem Router-Abbruch. */
function expectCancelledNavigation(): void {
  events.next(new NavigationStart(1, '/leistungen'));
  events.next(new NavigationCancel(1, '/leistungen', 'Test cancellation'));
  expect(fixture.componentInstance.isRouteChanging()).toBe(false);
  expect(document.documentElement.classList.contains('dcr-route-is-changing')).toBe(false);
}

/** Prüft fragmentunabhängige Folgesprünge auf einer bereits erreichten Route. */
function expectUpdatedRoutePath(): void {
  events.next(new NavigationStart(1, '/leistungen'));
  events.next(new NavigationEnd(1, '/leistungen', '/leistungen'));
  renderFrame();
  renderFrame();
  vi.mocked(window.scrollTo).mockClear();
  events.next(new NavigationStart(2, '/leistungen#service-index'));
  expect(fixture.componentInstance.isRouteChanging()).toBe(false);
  expect(window.scrollTo).not.toHaveBeenCalled();
}

describe('AppComponent-Navigation', registerNavigationTests);
