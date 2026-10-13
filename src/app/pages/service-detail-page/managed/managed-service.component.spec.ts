/* src/app/pages/service-detail-page/managed/managed-service.component.spec.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { STUDIO_TRANSLATIONS } from '../../../core/data/studio-content';
import { LanguageService } from '../../../core/services/language.service';
import { StudioService } from '../../../core/models/studio.models';
import { managedServiceContent } from './content/managed-service-content';
import { ManagedServiceComponent } from './managed-service.component';
import { ManagedServiceContent } from './managed-service.models';

/** Registriert Sprach- und Inhaltsprüfungen aller sechs Leistungsdetailseiten. */
function registerTests(): void {
  afterEach(cleanUpTest);
  it.each([
    ['de', 'managed-hosting'], ['en', 'managed-hosting'], ['de', 'email'], ['en', 'email'],
    ['de', 'webentwicklung'], ['en', 'webentwicklung'], ['de', 'softwareentwicklung'], ['en', 'softwareentwicklung'],
    ['de', 'ui-ux-design'], ['en', 'ui-ux-design'], ['de', 'wartung'], ['en', 'wartung'],
  ] as const)('zeigt Preise, eigenen FAQ-Inhalt und Navigation für %s/%s', verifyRendering);
  it('liefert eigene Inhalte für alle sechs Leistungen und keine für unbekannte Slugs', verifyServiceBoundary);
}

/** Gibt die Angular-Testinstanz nach jeder Prüfung frei. */
function cleanUpTest(): void {
  TestBed.resetTestingModule();
}

/**
 * Prüft die lokale Darstellung und alle serviceabhängigen FAQ-Einträge.
 * @param language Aktive Sprache der Testseite.
 * @param slug Kennung der ausgewählten Leistung.
 */
function verifyRendering(language: 'de' | 'en', slug: string): void {
  /**
   * Fachlicher Inhalt der ausgewählten Leistung in der gewählten Sprache.
   */
  const content = managedServiceContent(language, slug)!;
  /**
   * Gerenderte Testseite mit bestehenden Preisen und Leistungslisten.
   */
  const fixture = renderPage(language, slug, content);
  expect(fixture.nativeElement.querySelectorAll('h1')).toHaveLength(1);
  expect(fixture.nativeElement.querySelectorAll('details')).toHaveLength(faqCountFor(slug));
  expect(fixture.nativeElement.querySelectorAll('summary')).toHaveLength(faqCountFor(slug));
  expect(fixture.nativeElement.textContent).toContain(content.headline);
  expect(fixture.nativeElement.textContent).toContain(content.availability);
  expect(fixture.nativeElement.querySelector('.managed-offer__price').textContent).toBe(fixture.componentInstance.service().price);
  verifyNavigation(fixture.nativeElement, content);
  verifyGuidance(fixture.nativeElement, language);
  verifyPlans(fixture.nativeElement, slug);
}

/**
 * Erstellt die Präsentationskomponente mit ihren bestehenden zentralen Leistungsdaten.
 * @param language Sprache der zentralen Leistungsdaten.
 * @param slug Kennung der ausgewählten Leistung.
 * @param content Eigene Inhalte und FAQ-Einträge der Leistungsseite.
 */
function renderPage(language: 'de' | 'en', slug: string, content: ManagedServiceContent): ComponentFixture<ManagedServiceComponent> {
  configureLanguage(language);
  /**
   * Standalone-Testinstanz der erweiterten Leistungsansicht.
   */
  const fixture = TestBed.createComponent(ManagedServiceComponent);
  fixture.componentRef.setInput('service', serviceFor(language, slug));
  fixture.componentRef.setInput('content', content);
  fixture.componentRef.setInput('carePlans', STUDIO_TRANSLATIONS[language].carePlans);
  fixture.detectChanges();
  return fixture;
}

/**
 * Stellt eine isolierte Sprache ohne native Browserpräferenzen für den Darstellungstest bereit.
 * @param language Sprache der aktuellen Testinstanz.
 */
function configureLanguage(language: 'de' | 'en'): void {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), {
      provide: LanguageService,
      useValue: { language: /** Liefert die Sprache der aktuellen Testinstanz. */ () => language },
    }],
  });
}

/**
 * Liefert den bestehenden Service ohne eigene Preise oder Leistungsduplikate.
 * @param language Sprache der zentralen Leistungsdaten.
 * @param slug Kennung des angeforderten Services.
 */
function serviceFor(language: 'de' | 'en', slug: string): StudioService {
  return STUDIO_TRANSLATIONS[language].services.find(
    /**
     * Findet die ausgewählte Leistung über ihre stabile Kennung.
     * @param service Einzelne Leistung der zentralen Inhaltsfolge.
     */
    (service) => service.slug === slug,
  )!;
}

/**
 * Prüft die vollständig beschrifteten internen Links am Seitenende.
 * @param element Gerenderte Leistungsseite der Testinstanz.
 * @param content Eigene Navigation der ausgewählten Leistung.
 */
function verifyNavigation(element: HTMLElement, content: ManagedServiceContent): void {
  /**
   * Linkkarten der abschließenden Service-Navigation.
   */
  const links = element.querySelectorAll<HTMLAnchorElement>('.managed-links a');
  expect(links).toHaveLength(content.links.length);
  /**
   * Position der aktuellen Linkkarte innerhalb der zentralen Inhaltsfolge.
   */
  for (let index = 0; index < links.length; index++) {
    expect(links[index].getAttribute('href')).toBe(content.links[index].route);
    expect(links[index].textContent).toContain(content.links[index].title);
  }
}

/**
 * Prüft die sprachabhängige Hervorhebung für Kunden ohne technisches Vorwissen.
 * @param element Gerenderte Leistungsseite der Testinstanz.
 * @param language Sprache der aktuellen Inhaltsprüfung.
 */
function verifyGuidance(element: HTMLElement, language: 'de' | 'en'): void {
  expect(element.querySelector('dcr-service-guidance')?.textContent).toContain(
    language === 'de' ? 'Kein technisches Vorwissen nötig.' : 'No technical knowledge required.',
  );
}

/** Prüft die vollständige Zuordnung und die inhaltliche Trennung der Leistungen. */
function verifyServiceBoundary(): void {
  expect(managedServiceContent('de', 'webentwicklung')?.faqs).toHaveLength(7);
  expect(managedServiceContent('en', 'softwareentwicklung')?.faqs).toHaveLength(8);
  expect(managedServiceContent('de', 'unknown')).toBeUndefined();
  expect(managedServiceContent('de', 'email')?.faqs).not.toEqual(managedServiceContent('de', 'managed-hosting')?.faqs);
}

describe('ManagedServiceComponent', registerTests);

/**
 * Liefert die bewusst unterschiedlich umfangreichen FAQ-Listen der Leistungen.
 * @param slug Kennung der aktuell geprüften Leistungsseite.
 */
function faqCountFor(slug: string): number {
  return ['managed-hosting', 'softwareentwicklung'].includes(slug) ? 8 : ['email', 'webentwicklung'].includes(slug) ? 7 : 6;
}

/**
 * Prüft, dass alle drei bestehenden Wartungsoptionen nur auf ihrer Detailseite stehen.
 * @param element Gerenderte Leistungsseite.
 * @param slug Kennung der ausgewählten Leistung.
 */
function verifyPlans(element: HTMLElement, slug: string): void {
  expect(element.querySelectorAll('.managed-plans__grid article')).toHaveLength(slug === 'wartung' ? 3 : 0);
  expect(element.querySelectorAll('dcr-service-hook')).toHaveLength(2);
}
