/** @file Konsistenztests für den zentralen Studio-Content. */

import { STUDIO_TRANSLATIONS } from './studio-content';

describe('STUDIO_TRANSLATIONS', () => {
  it('hält die Service-Routen in DE und EN identisch und eindeutig', () => {
    const germanSlugs = STUDIO_TRANSLATIONS.de.services.map((service) => service.slug);
    const englishSlugs = STUDIO_TRANSLATIONS.en.services.map((service) => service.slug);

    expect(new Set(germanSlugs).size).toBe(germanSlugs.length);
    expect(englishSlugs).toEqual(germanSlugs);
    expect(germanSlugs).toHaveLength(6);
  });

  it('liefert für alle sichtbaren Referenzen beide Sprachvarianten', () => {
    const germanReferences = STUDIO_TRANSLATIONS.de.references;
    const englishReferences = STUDIO_TRANSLATIONS.en.references;

    expect(englishReferences).toHaveLength(germanReferences.length);
    expect(englishReferences.map((reference) => reference.slug)).toEqual(
      germanReferences.map((reference) => reference.slug),
    );
  });


  it('trennt Case Studies von realisierten Kundenprojekten', () => {
    for (const language of ['de', 'en'] as const) {
      const content = STUDIO_TRANSLATIONS[language];

      expect(content.references).toHaveLength(5);
      expect(content.deliveredProjects).toHaveLength(4);
      expect(content.deliveredProjects.map((project) => project.name)).toEqual([
        'glashelden24.de',
        'Sk-uvgele.de',
        'beautynailresort.de',
        'KGV1925',
      ]);
    }
  });

  it('enthält die vollständigen Portfolio-Preiskarten mit Command und eigenem CTA', () => {
    for (const language of ['de', 'en'] as const) {
      const offers = STUDIO_TRANSLATIONS[language].offers;

      expect(offers).toHaveLength(3);
      for (const offer of offers) {
        expect(offer.command.trim()).not.toBe('');
        expect(offer.ctaLabel.trim()).not.toBe('');
        expect(offer.features).toHaveLength(3);
      }
    }
  });

  it('enthält keine leeren Pflichtinhalte in Services', () => {
    for (const language of ['de', 'en'] as const) {
      for (const service of STUDIO_TRANSLATIONS[language].services) {
        expect(service.title.trim()).not.toBe('');
        expect(service.summary.trim()).not.toBe('');
        expect(service.features.length).toBeGreaterThan(0);
        expect(service.includes.length).toBeGreaterThan(0);
      }
    }
  });

  it('verlinkt Carly Managed in beiden Sprachen auf die DCR-Case-Domain', () => {
    for (const language of ['de', 'en'] as const) {
      const carlyManaged = STUDIO_TRANSLATIONS[language].references.find(
        (reference) => reference.slug === 'carly-managed',
      );

      expect(carlyManaged?.portfolioUrl).toBe('https://cases.design-code-repeat.de/carly-managed/auth/login/');
      expect(carlyManaged?.portfolioUrl).not.toContain('b2folio.de');
    }
  });


  it('hält nicht veröffentlichte Case Studies ohne ausgehenden Link gesperrt', () => {
    for (const language of ['de', 'en'] as const) {
      for (const slug of ['dein-fussabdruck', 'globi-flow']) {
        const reference = STUDIO_TRANSLATIONS[language].references.find((item) => item.slug === slug);

        expect(reference?.availability).toBe('coming-soon');
        expect(reference?.portfolioUrl).toBeUndefined();
        expect(reference?.internalRoute).toBeUndefined();
      }
    }
  });

  it('hält Intranet und Design Archiv vollständig im DCR-Domainspace', () => {
    for (const language of ['de', 'en'] as const) {
      const references = STUDIO_TRANSLATIONS[language].references;

      expect(references.find((item) => item.slug === 'intranet')?.internalRoute).toBe('/referenzen/intranet');
      expect(references.find((item) => item.slug === 'design-archive')?.internalRoute).toBe('/referenzen/design-archiv');
      expect(references.find((item) => item.slug === 'intranet')?.portfolioUrl).toBeUndefined();
      expect(references.find((item) => item.slug === 'design-archive')?.portfolioUrl).toBeUndefined();
    }
  });

});
