/* src/app/core/data/studio-content/process.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für Arbeitsprozess und FAQ.
 */
export const EN_PROCESS_CONTENT: Pick<StudioContent, 'process' | 'faq'> = {
  process: [
    {
      index: '01',
      title: 'Understand',
      text: 'Goal, users, existing systems and real constraints are clarified.',
      command: 'scope --problem-first',
    },
    {
      index: '02',
      title: 'Structure',
      text: 'Information architecture, data, components and technical responsibilities are defined.',
      command: 'plan --architecture',
    },
    {
      index: '03',
      title: 'Build',
      text: 'Implementation happens in small traceable steps with ongoing UX, A11Y and performance checks.',
      command: 'build --iterate',
    },
    {
      index: '04',
      title: 'Verify',
      text: 'Functionality, responsive behavior, error states and critical paths are checked before launch.',
      command: 'test --before-launch',
    },
    {
      index: '05',
      title: 'Operate',
      text: 'Deployment, monitoring, updates and improvements can remain managed after launch.',
      command: 'ops --keep-running',
    },
  ],
  faq: [
    {
      question: 'Do I need a finished concept?',
      answer:
        'No. A goal, a problem and some context are enough to start. A sensible scope can be developed from there.',
      relatedLink: { label: 'See the project process', route: '/', fragment: 'prozess' },
    },
    {
      question: 'Do you only work with Angular and Django?',
      answer:
        'No. Angular and Django are my main stack for larger applications. A compact website may be better served by a leaner stack. Technology follows the problem.',
      relatedLink: { label: 'Technology in real projects', route: '/referenzen' },
    },
    {
      question: 'Are SEO and accessibility extra services?',
      answer:
        'Technical SEO basics, semantic structure, responsive implementation and WCAG-oriented accessibility are part of the quality baseline. Specialized SEO campaigns or extensive audits are separate topics.',
      relatedLink: { label: 'Web development capabilities', route: '/leistungen/webentwicklung' },
    },
    {
      question: 'What does managed hosting mean?',
      answer:
        'More than storage: setup, SSL, deployment, monitoring, backups, restore and technical administration are managed around the project.',
      relatedLink: { label: 'Managed hosting in detail', route: '/leistungen/managed-hosting' },
    },
    {
      question: 'Can email be included?',
      answer:
        'Yes, as an optional extension to domain, website or managed hosting. Depending on the setup this includes mailboxes, aliases and technical configuration.',
      relatedLink: { label: 'Email setup and support', route: '/leistungen/email' },
    },
    {
      question: 'Can you improve an existing project?',
      answer:
        'Yes, if the codebase, access and technical state allow a responsible takeover. First we evaluate whether targeted improvement or a clean rebuild makes more economic sense.',
      relatedLink: { label: 'Maintenance and ongoing development', route: '/leistungen/wartung' },
    },
  ],
};
