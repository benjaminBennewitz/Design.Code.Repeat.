/* src/app/core/data/studio-content/references-page.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für Referenzübersicht.
 */
export const EN_REFERENCES_PAGE_CONTENT: Pick<StudioContent, 'referencesPage'> = {
  referencesPage: {
    seo: {
      title: 'References | Design. Code. Repeat.',
      description:
        'Selected references in web development, business software, interactive applications and graphic design.',
      keywords: ['web development references', 'Angular projects', 'Django projects', 'UI UX references'],
    },
    heading: {
      eyebrow: 'references.index',
      title: 'Techs & Clients.',
      text: 'From connected applications to public websites: explore the technical ideas behind a project alongside the websites built for clients. Two perspectives on development, design and everyday use.',
    },
    closing: {
      eyebrow: 'Design. Code. Repeat.',
      title: 'Different projects. One shared principle.',
      paragraphs: [
        'A practice website needs a different voice than an internal tool. A shop needs different workflows than a simulation. What connects them: design and technology need to fit the people who use them.',
        'That is why a new project starts with questions: What should become easier? Which information needs to reach people? What already exists? The answers shape a solution that stays understandable and can grow over time.',
      ],
      cta: 'Talk about your project',
    },
    techs: {
      title: 'Techs',
      text: 'Applications, experiments and a design archive. The case studies explore the problems behind each project and how interfaces, data and technical decisions work together.',
      features: [
        'Architecture and connected workflows',
        'Interaction, simulation and visual design',
        'Screenshots, demos and implementation insights',
      ],
      cta: 'Explore case studies',
    },
    clients: {
      title: 'Clients',
      text: 'Websites for businesses, practices and associations. The focus is on clear information, a fitting visual identity and functions that support their everyday work.',
      features: [
        'Business websites and local services',
        'Webshops and editorial content',
        'Custom frontends and small CMS solutions',
      ],
      cta: 'View client projects',
    },
    portfolioHint: 'More architecture, screens and technical decisions are available directly in each case study.',
    cta: 'Open case study',
    comingSoonEyebrow: 'Case Study / Deep Dive',
    comingSoonLabel: 'Coming soon',
    comingSoonText: 'The public DCR case study is currently being prepared.',
    deliveredHeading: {
      eyebrow: 'delivered.log',
      title: 'Delivered client projects.',
      text: 'Published websites and web systems from real client projects, from focused web presences to custom applications.',
    },
    deliveredCta: 'Open project',
    deliveredAriaLabel: 'Delivered client projects',
  },
};
