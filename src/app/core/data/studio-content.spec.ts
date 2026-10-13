/* src/app/core/data/studio-content.spec.ts */
/** @file Konsistenztests für den zentralen Studio-Content. */

import { STUDIO_TRANSLATIONS } from './studio-content';

const EXPECTED_CUSTOMER_NAMES = [
  'glashelden24.de',
  'Sk-uvgele.de',
  'beautynailresort.de',
  'praxis-perspektiefe.de',
  'KGV1925',
]; // Unveränderte Kundenfolge für beide Sprachvarianten.

/** Registriert die fachlichen Regressionstests dieses Bereichs. */
function registerTests(): void {
  it('hält die Service-Routen in DE und EN identisch und eindeutig', verifyServiceSlugs);
  it('liefert für alle sichtbaren Referenzen beide Sprachvarianten', verifyReferenceLanguages);
  it('trennt Case Studies von realisierten Kundenprojekten', verifyProjectCategories);
  it('verlinkt Praxis Perspektiefe und hält KGV1925 ohne öffentliche Domain', verifyCustomerLinks);
  it('enthält die vollständigen Portfolio-Preiskarten mit Command und eigenem CTA', verifyOfferCards);
  it('enthält keine leeren Pflichtinhalte in Services', verifyServiceContent);
  it('verlinkt Carly Managed in beiden Sprachen auf die DCR-Case-Domain', verifyManagedDemo);
  it('hält Dein Fußabdruck gesperrt und Globi Flow veröffentlicht', verifyProjectAvailability);
  it('hält Intranet und Design Archiv vollständig im DCR-Domainspace', verifyInternalCases);
}

/** Hält die Service-Routen in DE und EN identisch und eindeutig. */
function verifyServiceSlugs(): void {
  /**
   * Leistungs-Slugs der deutschen Inhalte.
   */
  const germanSlugs = STUDIO_TRANSLATIONS.de.services.map(slugOf);
  /**
   * Leistungs-Slugs der englischen Inhalte.
   */
  const englishSlugs = STUDIO_TRANSLATIONS.en.services.map(slugOf);

  expect(new Set(germanSlugs).size).toBe(germanSlugs.length);
  expect(englishSlugs).toEqual(germanSlugs);
  expect(germanSlugs).toHaveLength(6);
}

/** Liefert für alle sichtbaren Referenzen beide Sprachvarianten. */
function verifyReferenceLanguages(): void {
  /**
   * Referenzen der deutschen Inhalte.
   */
  const germanReferences = STUDIO_TRANSLATIONS.de.references;
  /**
   * Referenzen der englischen Inhalte.
   */
  const englishReferences = STUDIO_TRANSLATIONS.en.references;

  expect(englishReferences).toHaveLength(germanReferences.length);
  expect(englishReferences.map(slugOf)).toEqual(
    germanReferences.map(slugOf),
  );
}

/** Trennt Case Studies von realisierten Kundenprojekten. */
function verifyProjectCategories(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    /**
     * Studio-Inhalte der geprüften Sprache.
     */
    const content = STUDIO_TRANSLATIONS[language];

    expect(content.references).toHaveLength(5);
    expect(content.deliveredProjects).toHaveLength(5);
    expect(content.deliveredProjects.map(
      /**
       * Liest die stabile Kennung des geprüften Inhaltseintrags.
       * @param project Kundenprojekt aus den lokalisierten Studio-Inhalten.
       */
      (project) => project.name)).toEqual(EXPECTED_CUSTOMER_NAMES);
  }
}

/** Verlinkt Praxis Perspektiefe und hält KGV1925 ohne öffentliche Domain. */
function verifyCustomerLinks(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    expect(customerFor(language, 'praxis-perspektiefe.de')?.url).toBe('https://praxis-perspektiefe.de');
    expect(customerFor(language, 'KGV1925')?.url).toBe('#');
  }
}

/** Enthält die vollständigen Portfolio-Preiskarten mit Command und eigenem CTA. */
function verifyOfferCards(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    /**
     * Preiskarten der geprüften Sprache.
     */
    const offers = STUDIO_TRANSLATIONS[language].offers;
    expect(offers).toHaveLength(3);
    /**
     * Preiskarte mit ihren verpflichtenden Beschriftungen.
     */
    for (const offer of offers) {
      expect(offer.command.trim()).not.toBe('');
      expect(offer.ctaLabel.trim()).not.toBe('');
      expect(offer.features).toHaveLength(3);
    }
  }
}

/** Enthält keine leeren Pflichtinhalte in Services. */
function verifyServiceContent(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    /**
     * Leistung mit ihren verpflichtenden Inhalten.
     */
    for (const service of STUDIO_TRANSLATIONS[language].services) {
      expect(service.title.trim()).not.toBe('');
      expect(service.summary.trim()).not.toBe('');
      expect(service.features.length).toBeGreaterThan(0);
      expect(service.includes.length).toBeGreaterThan(0);
    }
  }
}

/** Verlinkt Carly Managed in beiden Sprachen auf die DCR-Case-Domain. */
function verifyManagedDemo(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    /**
     * Referenzeintrag der Managed-Hosting-Demo.
     */
    const carlyManaged = STUDIO_TRANSLATIONS[language].references.find(
      /**
       * Wählt den über Name oder Slug bezeichneten Inhaltseintrag.
       * @param reference Referenz aus den lokalisierten Studio-Inhalten.
       */
      (reference) => reference.slug === 'carly-managed',
    );

    expect(carlyManaged?.portfolioUrl).toBe('https://carly-managed-demo.design-code-repeat.de');
    expect(carlyManaged?.portfolioUrl).not.toContain('b2folio.de');
  }
}

/** Hält Dein Fußabdruck gesperrt und Globi Flow veröffentlicht. */
function verifyProjectAvailability(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    /**
     * Referenzeintrag des noch gesperrten Projekts.
     */
    const footprint = referenceFor(language, 'dein-fussabdruck');
    /**
     * Referenzeintrag der veröffentlichten Laborwerte-Demo.
     */
    const globiFlow = referenceFor(language, 'globi-flow');
    expect(footprint?.availability).toBe('coming-soon');
    expect(footprint?.portfolioUrl).toBeUndefined();
    expect(globiFlow?.availability).toBeUndefined();
    expect(globiFlow?.portfolioUrl).toBe('https://globi-flow-demo.design-code-repeat.de');
    expect(globiFlow?.portfolioUrl).not.toContain('b2folio.de');
  }
}

/** Hält Intranet und Design Archiv vollständig im DCR-Domainspace. */
function verifyInternalCases(): void {
  /**
   * Sprachvariante der aktuellen Inhaltsprüfung.
   */
  for (const language of ['de', 'en'] as const) {
    /**
     * Referenzen zur Prüfung der internen Case-Study-Routen.
     */
    const references = STUDIO_TRANSLATIONS[language].references;

    expect(referenceFor(language, 'intranet')?.internalRoute).toBe('/referenzen/intranet');
    expect(referenceFor(language, 'design-archive')?.internalRoute).toBe('/referenzen/design-archiv');
    expect(referenceFor(language, 'intranet')?.portfolioUrl).toBeUndefined();
    expect(referenceFor(language, 'design-archive')?.portfolioUrl).toBeUndefined();
  }
}

/**
 * Liest die gemeinsame stabile Kennung eines Service- oder Referenzeintrags.
 * @param item Inhaltseintrag mit einer stabilen Slug-Kennung.
 */
function slugOf(item: { readonly slug: string }): string {
  return item.slug;
}

/**
 * Liefert die über ihren Slug bezeichnete Referenz in der gewünschten Sprache.
 * @param language Geprüfte Sprachvariante.
 * @param slug Stabile Kennung der Referenz.
 */
function referenceFor(language: keyof typeof STUDIO_TRANSLATIONS, slug: string) {
  return STUDIO_TRANSLATIONS[language].references.find(
    /**
     * Vergleicht die stabile Kennung mit der angeforderten Referenz.
     * @param item Einzelner Referenzeintrag der gewählten Sprache.
     */
    (item) => item.slug === slug,
  );
}

/**
 * Liefert das über seinen Namen bezeichnete Kundenprojekt in der gewünschten Sprache.
 * @param language Geprüfte Sprachvariante.
 * @param name Sichtbarer Name des Kundenprojekts.
 */
function customerFor(language: keyof typeof STUDIO_TRANSLATIONS, name: string) {
  return STUDIO_TRANSLATIONS[language].deliveredProjects.find(
    /**
     * Vergleicht den Kundenprojektnamen mit dem angeforderten Eintrag.
     * @param project Einzelnes Kundenprojekt der gewählten Sprache.
     */
    (project) => project.name === name,
  );
}

describe('STUDIO_TRANSLATIONS', registerTests);
