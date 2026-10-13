/* src/app/core/data/studio-content/services.en.ts */
import type { StudioContent } from '../../models/studio.models';
import { DE_SERVICES_CONTENT } from './services.de';

/**
 * Englische Inhalte für Leistungsdefinitionen.
 */
export const EN_SERVICES_CONTENT: Pick<StudioContent, 'services'> = {
  services: [
    {
      ...DE_SERVICES_CONTENT.services[0],
      title: 'Web Development',
      shortTitle: 'Web',
      kicker: 'Websites, web presences and frontends',
      summary:
        'Fast responsive websites with clean structure, clear user journeys and a technical foundation for SEO and accessibility.',
      description:
        'From focused landing pages to multi-page company websites, the result is a distinct web presence without an unnecessarily heavy builder stack. Structure, design system, semantic HTML, performance and responsive behavior are planned together.',
      price: 'from €500',
      command: 'web --responsive --seo --a11y',
      outcomes: ['clear digital presence', 'fast loading', 'maintainable frontend structure'],
      features: [
        'Company websites and landing pages',
        'WordPress websites and editorial content maintenance',
        'Angular or intentionally lean HTML/JS stack',
        'Responsive UI and design system',
        'SEO basics, metadata and internal structure',
        'WCAG-oriented accessibility',
      ],
      includes: [
        'Concept and information architecture',
        'Frontend development',
        'Common viewport testing',
        'Performance and accessibility check',
      ],
      ctaLabel: 'Discuss web project',
    },
    {
      ...DE_SERVICES_CONTENT.services[1],
      title: 'Software Development',
      shortTitle: 'Software',
      kicker: 'Web applications, internal tools and automation',
      summary: 'Custom business software for real workflows: data, roles, forms, APIs, workflows and automation.',
      description:
        'When standard software does not fit the process, the application is built around the actual workflow. Frontend, Django backend, data model, permissions and integrations are developed as one system.',
      price: 'from €1,650',
      outcomes: ['less manual work', 'clear responsibilities', 'scalable functionality'],
      features: [
        'Internal tools and dashboards',
        'Angular frontends',
        'Django / Django REST APIs',
        'PostgreSQL data models',
        'Own Linux servers and virtual machines',
        'Redis and Celery for suitable background tasks',
        'Role and permission concepts',
        'Automation and background jobs',
      ],
      includes: [
        'Scope and process analysis',
        'Architecture and data model',
        'Frontend/backend implementation',
        'Documented handover and deployment preparation',
      ],
      ctaLabel: 'Assess software project',
    },
    {
      ...DE_SERVICES_CONTENT.services[2],
      title: 'UI / UX / Design',
      kicker: 'Interfaces, design systems and visual communication',
      summary: 'Design that does more than decorate: clear hierarchies, consistent states and reusable visual rules.',
      description:
        'UI and UX stay close to the later implementation. Components, states, contrast and responsive rules are designed so they work outside the design file.',
      price: 'by scope',
      outcomes: ['clearer user journeys', 'consistent interfaces', 'faster iteration'],
      features: [
        'UI/UX concept',
        'Design systems and component logic',
        'Responsive layouts',
        'Graphic design and digital assets',
        'Interaction and motion concept',
      ],
      includes: [
        'Visual direction',
        'Component and state definitions',
        'A11Y-oriented contrast check',
        'Developer-friendly handoff',
      ],
      ctaLabel: 'Discuss design',
    },
    {
      ...DE_SERVICES_CONTENT.services[3],
      title: 'Maintenance & Support',
      shortTitle: 'Care',
      kicker: 'Updates, bug fixing and continuous improvement',
      summary: 'Technical support for existing projects so small issues do not become a large maintenance backlog.',
      description:
        'Depending on the project, recurring checks, content changes, bug fixes and smaller improvements can be handled without forcing the work into oversized retainers.',
      price: 'from €15 / month',
      outcomes: ['less maintenance backlog', 'predictable small changes', 'technical point of contact'],
      features: [
        'Technical checks',
        'Content and layout changes',
        'Bug fixes',
        'Small improvements',
        'Prioritized support depending on plan',
      ],
      includes: ['Agreed support scope', 'Traceable changes', 'No hidden service bundles'],
      ctaLabel: 'Discuss support',
    },
    {
      ...DE_SERVICES_CONTENT.services[4],
      title: 'Managed Hosting',
      kicker: 'Managed operations instead of anonymous webspace',
      summary:
        'Hosting, deployment, SSL, monitoring, backups and technical administration as a managed layer around the project.',
      description:
        'Managed hosting is for projects that need more than storage. Server and deployment are configured around the application and technically maintained.',
      price: 'by infrastructure',
      outcomes: ['clear operating state', 'recoverable backups', 'less infrastructure work'],
      features: [
        'Server/hosting setup',
        'SSL and deployment',
        'Monitoring and technical checks',
        'Backups and restore',
        'Updates and security care',
        'Technical administration',
      ],
      includes: ['Matched hosting setup', 'Deployment process', 'Backup/restore concept', 'Monitoring baseline'],
      ctaLabel: 'Request hosting',
    },
    {
      ...DE_SERVICES_CONTENT.services[5],
      title: 'Email Add-on',
      shortTitle: 'Email',
      kicker: 'Mailboxes on your own domain',
      summary: 'Email addresses, aliases and technical setup as an extension of website or hosting support.',
      description:
        'Email intentionally remains an add-on rather than a separate hosting business. Mailboxes and aliases are configured around the domain and can be technically supported when needed.',
      price: 'optional with hosting',
      outcomes: ['professional domain email', 'central setup', 'less technical friction'],
      features: [
        'Mailboxes on own domain',
        'Aliases',
        'Setup on request',
        'Technical support',
        'Coordination with domain and hosting',
      ],
      includes: [
        'Setup of agreed accounts',
        'DNS/mail configuration within agreed scope',
        'Documented credential handover',
      ],
      ctaLabel: 'Discuss email setup',
    },
  ],
};
