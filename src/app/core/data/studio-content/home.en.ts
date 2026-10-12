/* src/app/core/data/studio-content/home.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für Startseite.
 */
export const EN_HOME_CONTENT: Pick<StudioContent, 'home'> = {
  home: {
    seo: {
      title: 'Design. Code. Repeat. | Web Development, Software & Design',
      description:
        'Websites, custom web applications, UI/UX, maintenance and managed hosting in a technically clean, personally managed studio setup.',
      keywords: ['web development', 'Angular', 'Django', 'web applications', 'UI UX design', 'managed hosting'],
    },
    hero: {
      eyebrow: 'studio.system // online',
      title: 'Digital products that do more than look good. They get work done.',
      lead: 'Web development, custom software and design with one clear principle: understand the problem, build the system cleanly, operate the result for the long term.',
      primaryCta: 'Explore services',
      secondaryCta: 'Discuss a project',
      status: ['angular_22=ready', 'django=available', 'accessibility=baseline', 'hosting=managed'],
      proof: [
        { value: 'Full Stack', label: 'frontend to operations' },
        { value: 'DE / EN', label: 'internationally prepared' },
        { value: 'WCAG', label: 'accessibility built in' },
      ],
    },
    services: {
      eyebrow: 'services.loaded',
      title: 'What gets built depends on the problem.',
      text: 'No one-size-fits-all package: from focused web presence to internal business application, with architecture, UX and operations treated as one system.',
    },
    hosting: {
      eyebrow: 'ops.layer',
      title: 'Launch is not the finish line.',
      text: 'Managed hosting is not anonymous cheap webspace. It is a managed technical operation layer for projects that need to stay available and maintainable.',
      points: ['SSL & deployment', 'monitoring & backups', 'updates & security', 'restore & technical administration'],
      emailTitle: 'Email can be added.',
      emailText:
        'Mailboxes on your own domain, aliases, setup and technical support as an extension of website or hosting care.',
      cta: 'Explore hosting',
    },
    references: {
      eyebrow: 'selected.work',
      title: 'Real systems instead of interchangeable mockups.',
      text: 'Selected work covers different problem classes: internal tools, interactive applications, data workflows and visual systems.',
    },
    process: {
      eyebrow: 'workflow.exe',
      title: 'Clear process. Fewer surprises.',
      text: 'From initial scope to operations, it remains visible why a decision was made and what happens next.',
    },
    faq: {
      eyebrow: 'faq.query',
      title: 'Questions before they become tickets.',
      text: '',
    },
    contact: {
      eyebrow: 'connection.ready',
      title: 'A problem is enough to start.',
      text: 'You do not need a finished specification. A concrete goal, an annoying process or an existing site that no longer keeps up is enough for a first conversation.',
    },
  },
};
