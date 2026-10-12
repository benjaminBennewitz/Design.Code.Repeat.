/* src/app/shared/reference-case-study/controllers/gallery-lightbox.spec.ts */
import { signal } from '@angular/core';
import { REFERENCE_CASE_PROJECTS } from '../../../core/data/reference-case-projects';
import { CaseAssetLoader } from './case-asset-loader';
import { GalleryLightbox } from './gallery-lightbox';
import { trapOverlayFocus } from './overlay-focus';

let lightbox: GalleryLightbox;               // Lightbox der aktuellen Testinstanz.
let frame: FrameRequestCallback | undefined; // Noch nicht ausgeführter Fokus-Frame.
let trigger: HTMLButtonElement;              // Auslösendes Element außerhalb des Dialogs.
let panel: HTMLElement;                      // Dialogbereich der Lightbox im Test-DOM.

/** Registriert Lightbox-Tests für Navigation, Fokus und Lifecycle. */
function registerLightboxTests(): void {
  beforeEach(prepareLightbox);
  afterEach(cleanupLightbox);
  it('gibt den Fokus nach dem Schließen an den Auslöser zurück', expectReturnFocus);
  it('sperrt und entsperrt den Body-Scroll mit dem Dialogzustand', expectScrollLock);
  it('verwirft einen alten Bildwechsel nach dem Öffnen eines anderen Eintrags', expectLatestOpenWins);
  it('setzt schnelle Navigation vom zuletzt angeforderten Bild aus fort', expectRapidNavigation);
  it('räumt ausstehende Fokuswechsel und Scroll-Sperren auf', expectLifecycleCleanup);
  it('hält die Vorwärts- und Rückwärtsnavigation im Dialog', expectFocusWrapping);
}

/** Erstellt Test-DOM und kontrollierte Lightbox-Zeitsteuerung. */
function prepareLightbox(): void {
  vi.useFakeTimers();
  vi.spyOn(CaseAssetLoader.prototype, 'preload').mockImplementation(loadReadyAsset);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(captureFrame);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(cancelFrame);
  document.body.innerHTML =
    '<button id="trigger">Öffnen</button><div class="project-detail__lightbox-panel"><button class="project-detail__lightbox-close">Schließen</button><button id="last">Weiter</button></div>';
  trigger = document.querySelector<HTMLButtonElement>('#trigger')!;
  panel = document.querySelector<HTMLElement>('.project-detail__lightbox-panel')!;
  lightbox = new GalleryLightbox(signal(REFERENCE_CASE_PROJECTS.de[1]), new CaseAssetLoader());
  trigger.focus();
}

/** Entfernt Dialogzustand, Test-DOM und Zeitsteuerung. */
function cleanupLightbox(): void {
  lightbox.reset();
  frame = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
}

/** Liefert einen bereits geladenen Bildauftrag. */
function loadReadyAsset(): Promise<void> {
  return Promise.resolve();
}

/**
 * Speichert den nächsten Fokus-Frame ohne ihn sofort auszuführen.
 * @param callback Geplanter Fokuswechsel des Dialogs.
 */
function captureFrame(callback: FrameRequestCallback): number {
  frame = callback;
  return 1;
}

/** Verwirft einen noch ausstehenden Fokus-Frame. */
function cancelFrame(): void {
  frame = undefined;
}

/** Führt den zuletzt geplanten Fokuswechsel aus. */
function flushFrame(): void {
  /**
   * Zuletzt geplanter Fokuswechsel des Dialogs.
   */
  const callback = frame;
  frame = undefined;
  callback?.(0);
}

/** Prüft den Dialogfokus und dessen Rückgabe nach dem Schließen. */
function expectReturnFocus(): void {
  lightbox.open(0);
  flushFrame();
  expect(document.activeElement).toBe(panel.firstElementChild);
  lightbox.close();
  flushFrame();
  expect(document.activeElement).toBe(trigger);
}

/** Prüft die zur Lightbox gehörende Body-Scroll-Sperre. */
function expectScrollLock(): void {
  lightbox.open(0);
  lightbox.synchronizeScrollLock();
  expect(document.body.classList.contains('bp-lightbox-open')).toBe(true);
  lightbox.close();
  lightbox.synchronizeScrollLock();
  expect(document.body.classList.contains('bp-lightbox-open')).toBe(false);
}

/** Prüft, dass ein erneutes Öffnen einen älteren Bildwechsel ungültig macht. */
async function expectLatestOpenWins(): Promise<void> {
  lightbox.open(0);
  lightbox.selectAdjacent(1);
  lightbox.open(5);
  await vi.advanceTimersByTimeAsync(400);
  expect(lightbox.index()).toBe(5);
  expect(lightbox.phase()).toBe('idle');
}

/** Prüft fortlaufende Zielindizes bei schneller Lightbox-Navigation. */
async function expectRapidNavigation(): Promise<void> {
  lightbox.open(0);
  lightbox.selectAdjacent(1);
  lightbox.selectAdjacent(1);
  await vi.advanceTimersByTimeAsync(120);
  expect(lightbox.index()).toBe(2);
  expect(lightbox.phase()).toBe('fade-in');
  await vi.advanceTimersByTimeAsync(220);
  expect(lightbox.phase()).toBe('idle');
}

/** Prüft das Aufräumen während eines ausstehenden Dialogwechsels. */
async function expectLifecycleCleanup(): Promise<void> {
  lightbox.open(0);
  lightbox.synchronizeScrollLock();
  lightbox.selectAdjacent(1);
  lightbox.reset();
  await vi.advanceTimersByTimeAsync(400);
  expect(lightbox.index()).toBeNull();
  expect(frame).toBeUndefined();
  expect(document.body.classList.contains('bp-lightbox-open')).toBe(false);
}

/** Prüft das zyklische Halten des Tastaturfokus an beiden Dialogrändern. */
function expectFocusWrapping(): void {
  panel.lastElementChild!.dispatchEvent(new Event('focus'));
  (panel.lastElementChild as HTMLElement).focus();
  trapOverlayFocus(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }), panel);
  expect(document.activeElement).toBe(panel.firstElementChild);
  trapOverlayFocus(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }), panel);
  expect(document.activeElement).toBe(panel.lastElementChild);
}

describe('GalleryLightbox', registerLightboxTests);
