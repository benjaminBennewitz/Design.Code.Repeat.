import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FaqDisclosureDirective } from './faq-disclosure.directive';

let details: HTMLDetailsElement; // Kontrolliertes natives FAQ-Element.
let directive: FaqDisclosureDirective; // Getestete Animation mit Angular-Injektion.
let animation: { cancel: ReturnType<typeof vi.fn>; onfinish?: () => void }; // Steuerbarer Abschluss ohne Echtzeitwartezeit.

/** Registriert Übergangs-, Umkehr- und Präferenzprüfungen. */
function registerTests(): void {
  beforeEach(prepareTest);
  afterEach(cleanUpTest);
  it('hält Antworten beim Schließen bis zum Animationsende sichtbar', verifyClosing);
  it('kehrt bei einem zweiten Klick den laufenden Übergang um', verifyReversal);
  it('respektiert reduzierte Bewegung ohne Animation', verifyReducedMotion);
  it('gibt laufende Animationen beim Entfernen frei', verifyCleanup);
}

/** Erstellt eine isolierte Direktive mit steuerbarer Browseranimation. */
function prepareTest(): void {
  details = document.createElement('details');
  details.innerHTML = '<summary>Frage</summary><p>Antwort</p>';
  animation = { cancel: vi.fn() };
  details.animate = vi.fn().mockReturnValue(animation);
  TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: new ElementRef(details) }] });
  directive = TestBed.runInInjectionContext(createDirective);
}

/** Erstellt die Direktive im vorbereiteten Angular-Injektionskontext. */
function createDirective(): FaqDisclosureDirective {
  return new FaqDisclosureDirective();
}

/** Aktiviert die native Zusammenfassung mit einem abbrechbaren Klick. */
function clickSummary(): void {
  /* Der Ereignisempfänger entspricht auch einem per Tastatur ausgelösten Klick. */
  const event = new MouseEvent('click', { cancelable: true });
  Object.defineProperty(event, 'target', { value: details.querySelector('summary') });
  directive.toggle(event);
  expect(event.defaultPrevented).toBe(true);
}

/** Prüft, dass die Schließanimation vor dem nativen Verbergen endet. */
function verifyClosing(): void {
  details.open = true;
  clickSummary();
  expect(details.open).toBe(true);
  animation.onfinish?.();
  expect(details.open).toBe(false);
  expect(details.style.height).toBe('');
}

/** Prüft eine Umkehr noch vor Abschluss des Öffnens. */
function verifyReversal(): void {
  clickSummary();
  clickSummary();
  expect(details.animate).toHaveBeenCalledTimes(2);
  animation.onfinish?.();
  expect(details.open).toBe(false);
}

/** Prüft die vorhandene Einstellung für reduzierte Bewegung. */
function verifyReducedMotion(): void {
  document.documentElement.dataset['motion'] = 'reduced';
  clickSummary();
  expect(details.open).toBe(true);
  expect(details.animate).not.toHaveBeenCalled();
}

/** Prüft die Freigabe beim Entfernen eines Suchtreffers. */
function verifyCleanup(): void {
  clickSummary();
  directive.ngOnDestroy();
  expect(animation.cancel).toHaveBeenCalled();
  expect(details.style.overflow).toBe('');
}

/** Räumt Präferenzen und Angular-Testzustand nach jeder Prüfung auf. */
function cleanUpTest(): void {
  directive.ngOnDestroy();
  delete document.documentElement.dataset['motion'];
  TestBed.resetTestingModule();
}

describe('FaqDisclosureDirective', registerTests);
