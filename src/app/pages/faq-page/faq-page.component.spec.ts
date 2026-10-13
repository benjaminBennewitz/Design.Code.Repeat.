/* src/app/pages/faq-page/faq-page.component.spec.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { STUDIO_TRANSLATIONS } from '../../core/data/studio-content';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { FaqPageComponent } from './faq-page.component';

let fixture: ComponentFixture<FaqPageComponent>; // Verbundene Testseite für Suche und Fokusführung.
const language = signal<'de' | 'en'>('de'); // Reaktive Sprache der kontrollierten Testinstanz.
const setPage = vi.fn(); // Geprüfte SEO-Ausgabe der zentralen Fragenroute.

/** Registriert UI-Prüfungen für Suche, leere Ergebnisse, Fokus und Sprachwechsel. */
function registerTests(): void {
  beforeEach(prepareTest);
  afterEach(cleanUpTest);
  it('zeigt sieben Themen und überträgt die FAQ-Canonical-Route', verifyInitialPage);
  it('filtert die sichtbaren nativen FAQ-Einträge nach Suchtext', verifyRenderedSearch);
  it('setzt einen leeren Zustand zurück und gibt den Suchfokus wieder', verifyReset);
  it('aktualisiert Fragen und SEO beim Sprachwechsel', verifyLanguage);
}

/** Bereitet eine isolierte, mit dem Dokument verbundene Testseite vor. */
function prepareTest(): void {
  language.set('de');
  setPage.mockClear();
  configureProviders();
  fixture = TestBed.createComponent(FaqPageComponent);
  document.body.append(fixture.nativeElement);
  fixture.detectChanges();
}

/** Stellt Router, Sprache und SEO ohne native Browserpräferenzen bereit. */
function configureProviders(): void {
  TestBed.configureTestingModule({ providers: [provideRouter([]), {
    provide: LanguageService, useValue: { language, content:
      /** Liest die zentralen Inhalte der reaktiven Testsprache. */
      () => STUDIO_TRANSLATIONS[language()],
    },
  }, { provide: SeoService, useValue: { setPage } }] });
}

/** Entfernt die verbundene Testseite und gibt Angular nach jeder Prüfung frei. */
function cleanUpTest(): void {
  fixture.nativeElement.remove();
  TestBed.resetTestingModule();
}

/** Prüft Themenstruktur, erreichbare Suche und die eigene SEO-Route. */
function verifyInitialPage(): void {
  expect(fixture.nativeElement.querySelectorAll('.faq-topic')).toHaveLength(7);
  expect(fixture.nativeElement.querySelectorAll('h1')).toHaveLength(1);
  expect(setPage).toHaveBeenLastCalledWith(fixture.componentInstance.ui().seo, '/faq');
}

/** Prüft die tatsächliche Eingabe im Suchfeld und die sichtbaren Ergebnisse. */
function verifyRenderedSearch(): void {
  /**
   * Verbundenes Suchfeld der gerenderten Fragenübersicht.
   */
  const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  input.value = 'WordPress';
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  expect(fixture.componentInstance.query()).toBe('WordPress');
  expect(fixture.nativeElement.querySelectorAll('details').length).toBeGreaterThan(0);
  expect(fixture.nativeElement.querySelectorAll('details')).toHaveLength(fixture.componentInstance.resultCount());
}

/** Prüft den leeren Zustand und die Fokus-Rückgabe beim Zurücksetzen. */
function verifyReset(): void {
  fixture.componentInstance.category.set('email');
  fixture.componentInstance.query.set('Redis');
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.faq-empty')).not.toBeNull();
  fixture.componentInstance.resetSearch();
  fixture.detectChanges();
  expect(fixture.componentInstance.category()).toBe('all');
  expect(fixture.componentInstance.query()).toBe('');
  expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
}

/** Prüft die reaktive Übersetzung von Inhalt, Suchoberfläche und Metadaten. */
function verifyLanguage(): void {
  language.set('en');
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Your questions. Clear answers.');
  expect(fixture.nativeElement.querySelector('label').textContent).toBe('Search questions and answers');
  expect(setPage).toHaveBeenLastCalledWith(fixture.componentInstance.ui().seo, '/faq');
}

describe('FaqPageComponent', registerTests);
