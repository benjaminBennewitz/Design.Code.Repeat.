/* src/app/core/data/studio-content/services-page.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für Leistungsübersicht.
 */
export const EN_SERVICES_PAGE_CONTENT: Pick<StudioContent, 'servicesPage'> = {
  servicesPage: {
    seo: {
      title: 'Services | Web Development, Software, Design & Hosting',
      description:
        'Web development, business software, UI/UX, maintenance, managed hosting and email support by Design. Code. Repeat.',
      keywords: ['web development services', 'software development', 'UI UX', 'managed hosting', 'website maintenance'],
    },
    hero: {
      eyebrow: 'services.exe',
      title: 'Not every problem needs an app. But every project needs the right solution.',
      text: 'From a focused website to an internal business application, development, design and operations are assembled around the actual problem.',
      primaryCta: 'Classify your project',
      note: 'Prices are starting points. Scope, content, integrations, data model and operational requirements determine the actual effort.',
    },
    offersHeading: {
      eyebrow: 'entry.points',
      title: 'Three typical entry points.',
      text: 'Orientation for common project sizes, not rigid packages.',
    },
    qualityBaseline:
      'Responsive design, performance, technical SEO basics and accessibility are part of the quality baseline.',
    offerNote:
      'Custom functionality, migrations, complex content, integrations and special infrastructure are estimated transparently as separate scope.',
    careHeading: {
      eyebrow: 'maintenance.mode',
      title: 'Maintenance and continuous improvement.',
      text: 'For projects that need regular small updates, technical checks or prioritized support after launch.',
    },
    hostingHeading: {
      eyebrow: 'managed.ops',
      title: 'Operations as a service.',
      text: 'Hosting, deployment, monitoring and backups can be added as a managed technical layer. Email intentionally remains an optional add-on.',
    },
  },
};
