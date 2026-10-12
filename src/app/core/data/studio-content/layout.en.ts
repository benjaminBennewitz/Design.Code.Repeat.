/* src/app/core/data/studio-content/layout.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für globale Navigation und Layouttexte.
 */
export const EN_LAYOUT_CONTENT: Pick<StudioContent, 'meta' | 'navigation' | 'footer' | 'notFound' | 'thankYou'> = {
  meta: {
    hiddenTitle: 'psst... come back 👀',
    siteName: 'Design. Code. Repeat. Studio',
  },
  navigation: {
    ariaLabel: 'Main navigation',
    menuLabel: 'Open menu',
    closeLabel: 'Close menu',
    themeLabel: 'Switch color scheme',
    languageLabel: 'Switch language',
    ctaLabel: 'Contact',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/leistungen' },
      { label: 'References', href: '/referenzen' },
      { label: 'Studio', href: '/studio' },
      { label: 'Process', href: '/#prozess' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  footer: {
    tagline: 'Web development, software, design and managed operations.',
    servicesTitle: 'Services',
    companyTitle: 'Studio',
    legalTitle: 'Legal',
    signature: 'built by B² // Design. Code. Repeat.',
  },
  notFound: {
    title: '404 // route not found',
    text: 'This route is not part of the system or has been moved.',
    cta: 'Back home',
  },
  thankYou: {
    title: 'request.received',
    text: 'Thank you. Your inquiry was handed to the server. I will reply via the email address you provided.',
    cta: 'Back home',
  },
};
