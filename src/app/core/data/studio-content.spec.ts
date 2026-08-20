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
});
