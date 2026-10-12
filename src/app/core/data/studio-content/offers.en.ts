/* src/app/core/data/studio-content/offers.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für Angebote und Betreuungspakete.
 */
export const EN_OFFERS_CONTENT: Pick<StudioContent, 'offers' | 'carePlans'> = {
  offers: [
    {
      title: 'Starter Website',
      price: 'from €500',
      claim: 'Visible fast. Straight to the point.',
      description:
        'For individual offers, campaigns or compact web presences where a clear message matters more than unnecessary scope.',
      command: 'web --landing --responsive --fast',
      features: [
        'Compact onepager or purpose-built landing page',
        'Distinct responsive design instead of a standard template',
        'Fast, clean technical foundation',
      ],
      ctaLabel: 'Start a project',
    },
    {
      title: 'Web Presence',
      price: 'from €950',
      badge: 'Recommended',
      featured: true,
      claim: 'Being found is only the beginning.',
      description:
        'For businesses and brands that want to build trust, guide users and turn attention into real inquiries.',
      command: 'web --brand --content --conversion',
      features: [
        'Thoughtful structure for services, content and contact',
        'Visual system aligned with brand and audience',
        'User journeys built for engagement and conversion',
      ],
      ctaLabel: 'Plan web presence',
    },
    {
      title: 'Business App',
      price: 'from €1,650',
      claim: 'When software needs to start taking work off your plate.',
      description:
        'For internal tools, dashboards and custom web applications that digitize or automate real processes.',
      command: 'app --data --roles --automation',
      features: [
        'Interfaces designed around real workflows',
        'Roles, forms, data, APIs and automation',
        'Maintainable architecture built for growing functionality',
      ],
      ctaLabel: 'Discuss application',
    },
  ],
  carePlans: [
    {
      name: 'Basic Care',
      price: '€15 / month',
      text: 'For occasional small changes.',
      features: ['small text/image changes', 'short monthly technical check'],
    },
    {
      name: 'Content Care',
      price: '€39 / month',
      text: 'For regularly maintained content.',
      features: ['regular content updates', 'small layout changes', 'maintenance of important SEO snippets'],
    },
    {
      name: 'Priority Care',
      price: '€79 / month',
      text: 'For projects with more frequent small tasks.',
      features: ['prioritized changes', 'monitoring checks', 'short technical consulting'],
    },
  ],
};
