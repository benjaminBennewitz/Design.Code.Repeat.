/* src/app/core/data/studio-content/delivered-projects.en.ts */
import type { StudioContent } from '../../models/studio.models';
import { DE_DELIVERED_PROJECTS_CONTENT } from './delivered-projects.de';

/**
 * Englische Inhalte für realisierte Kundenprojekte.
 */
export const EN_DELIVERED_PROJECTS_CONTENT: Pick<StudioContent, 'deliveredProjects'> = {
  deliveredProjects: [
    {
      ...DE_DELIVERED_PROJECTS_CONTENT.deliveredProjects[0],
      summary:
        'A focused website for a window cleaning service. Services, price information and contact options give visitors a direct overview of the offering.',
      details: [
        'Services and price orientation',
        'Service areas and contact options',
        'Lean HTML, CSS and JavaScript implementation',
      ],
      label: 'Website / Direct, lean, fast',
      imageAlt: 'Homepage of glashelden24.de with hero, pricing overview and service sections',
    },
    {
      ...DE_DELIVERED_PROJECTS_CONTENT.deliveredProjects[1],
      summary:
        'A WordPress website for a UV gel business. Product information, consulting and news form the main areas of the website.',
      details: [
        'Structured product sections',
        'Consulting and company information',
        'Editable content with WordPress and Elementor',
      ],
      label: 'Company / WordPress presence',
      imageAlt: 'Homepage of Sk-uvgele.de with product areas, consulting and news',
    },
    {
      ...DE_DELIVERED_PROJECTS_CONTENT.deliveredProjects[2],
      summary:
        'A website for wellness and beauty services with an integrated shop. Treatments and products are presented within one shared online presence.',
      details: [
        'Treatment and service overview',
        'Product sales through WooCommerce',
        'Editorial content managed with WordPress',
      ],
      label: 'Wellness & Spa / Website + shop',
      imageAlt: 'Homepage of beautynailresort.de with treatments, recommendations and shop elements',
    },
    {
      ...DE_DELIVERED_PROJECTS_CONTENT.deliveredProjects[3],
      summary:
        'A website for a psychotherapy practice. Treatment information, practice details and contact options take centre stage in a calm, clear design.',
      details: [
        'Treatment and practice information',
        'Clear structure for orientation',
        'Custom Angular frontend and technical SEO',
      ],
      label: 'Psychotherapy / Website + SEO',
      imageAlt: 'Homepage of the psychotherapy practice with treatment information and practice details',
    },
    {
      ...DE_DELIVERED_PROJECTS_CONTENT.deliveredProjects[4],
      summary:
        'An association website with information, events and gardening content. A small CMS complements the Angular frontend for maintaining club information.',
      details: [
        'Association information and events',
        'Editorial gardening content',
        'Angular frontend with Django and REST API',
      ],
      label: 'Allotment association / Angular + mini CMS',
      imageAlt: 'Homepage of the allotment association with club information, events and gardening content',
    },
  ],
};
