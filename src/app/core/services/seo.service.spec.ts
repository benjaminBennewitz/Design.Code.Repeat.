/* src/app/core/services/seo.service.spec.ts */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoPageContent } from '../models/studio.models';
import { SeoService } from './seo.service';
import { TabTitleService } from './tab-title.service';

let seoDocument: Document;                                                                                      // Eigenständiges Dokument ohne Einfluss auf die Testoberfläche.
const page: SeoPageContent = { title: 'Testseite', description: 'Beschreibung', keywords: ['Studio', 'Test'] }; // SEO-Testinhalt.

/** Registriert Prüfungen für Metadaten, wiederholte Routenwechsel und Tab-Sichtbarkeit. */
function registerSeoTests(): void {
  beforeEach(prepareSeoTest);
  afterEach(cleanUpSeoTest);
  it('setzt routenabhängige Metadaten und sprachabhängige strukturierte Daten', expectPageMetadata);
  it('aktualisiert Canonical und JSON-LD ohne doppelte Elemente', expectRepeatedPageUpdate);
  it('setzt für Systemseiten die bestehende noindex-Regel', expectSystemPage);
  it('behält den aktiven SEO-Titel während eines versteckten Tabs', expectHiddenTabTitle);
}

/** Erstellt ein unabhängiges Dokument für die SEO-Serviceinstanzen. */
function prepareSeoTest(): void {
  seoDocument = document.implementation.createHTMLDocument('Alter Titel');
  seoDocument.documentElement.lang = 'en';
  Object.defineProperty(seoDocument, 'hidden', { configurable: true, value: false });
  TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: seoDocument }] });
}

/** Gibt die an das eigenständige Dokument gebundenen Services frei. */
function cleanUpSeoTest(): void {
  TestBed.resetTestingModule();
}

/** Prüft Social-Metadaten, Seitentitel und Sprache der kontrollierten JSON-LD-Ausgabe. */
function expectPageMetadata(): void {
  TestBed.inject(SeoService).setPage(page, '/referenzen/test', 'article');
  expect(seoDocument.title).toBe(page.title);
  expect(seoDocument.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).toBe(page.description);
  expect(seoDocument.querySelector<HTMLMetaElement>('meta[name="keywords"]')?.content).toBe('Studio, Test');
  expect(seoDocument.querySelector<HTMLMetaElement>('meta[property="og:type"]')?.content).toBe('article');
  expect(seoDocument.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.content).toBe(page.title);
  expect(readStructuredPage()).toMatchObject({ '@type': 'WebPage', name: page.title, inLanguage: 'en' });
}

/** Liefert die Seitendaten aus dem kontrollierten JSON-LD-Testdokument. */
function readStructuredPage(): Record<string, unknown> {
  return JSON.parse(seoDocument.getElementById('dcr-structured-data')!.textContent!)[1];
}

/** Prüft die Wiederverwendung vorhandener Canonical- und Script-Elemente. */
function expectRepeatedPageUpdate(): void {
  /**
   * SEO-Service für zwei aufeinanderfolgende Seitenaktualisierungen.
   */
  const service = TestBed.inject(SeoService);
  service.setPage(page, '/erste');
  /**
   * Bereits erzeugtes JSON-LD-Element vor der nächsten Routenaktualisierung.
   */
  const originalScript = seoDocument.getElementById('dcr-structured-data');
  service.setPage({ ...page, title: 'Zweite Seite' }, '/zweite');
  expect(seoDocument.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(seoDocument.querySelectorAll('#dcr-structured-data')).toHaveLength(1);
  expect(seoDocument.getElementById('dcr-structured-data')).toBe(originalScript);
  expect(readStructuredPage()).toMatchObject({ name: 'Zweite Seite' });
  expect(seoDocument.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toMatch(/\/zweite$/);
}

/** Prüft die bestehenden Metadaten einer nicht indexierbaren Systemseite. */
function expectSystemPage(): void {
  TestBed.inject(SeoService).setNoIndex('Danke', 'Anfrage angekommen', '/danke');
  expect(seoDocument.title).toBe('Danke');
  expect(seoDocument.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content).toBe('noindex, nofollow');
  expect(seoDocument.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toMatch(/\/danke$/);
}

/** Prüft den Rückkehrhinweis und die Wiederherstellung eines währenddessen geänderten SEO-Titels. */
function expectHiddenTabTitle(): void {
  /**
   * Titelservice für wechselnde Tab-Sichtbarkeit im unabhängigen Dokument.
   */
  const service = TestBed.inject(TabTitleService);
  service.setActiveTitle('Erste Seite');
  service.setHiddenTitle('Rückkehrhinweis');
  Object.defineProperty(seoDocument, 'hidden', { configurable: true, value: true });
  seoDocument.dispatchEvent(new Event('visibilitychange'));
  service.setActiveTitle('Zweite Seite');
  expect(seoDocument.title).toBe('Rückkehrhinweis');
  Object.defineProperty(seoDocument, 'hidden', { configurable: true, value: false });
  seoDocument.dispatchEvent(new Event('visibilitychange'));
  expect(seoDocument.title).toBe('Zweite Seite');
}

describe('SeoService und TabTitleService', registerSeoTests);
