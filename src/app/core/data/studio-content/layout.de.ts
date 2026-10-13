/* src/app/core/data/studio-content/layout.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für globale Navigation und Layouttexte.
 */
export const DE_LAYOUT_CONTENT: Pick<StudioContent, 'meta' | 'navigation' | 'footer' | 'notFound' | 'thankYou'> = {
  meta: {
    hiddenTitle: 'psst... komm zurück 👀',
    siteName: 'Design. Code. Repeat. Studio',
  },
  navigation: {
    ariaLabel: 'Hauptnavigation',
    menuLabel: 'Menü öffnen',
    closeLabel: 'Menü schließen',
    themeLabel: 'Farbschema wechseln',
    languageLabel: 'Sprache wechseln',
    ctaLabel: 'Kontakt',
    items: [
      { label: 'Start', href: '/' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Referenzen', href: '/referenzen' },
      { label: 'Studio', href: '/studio' },
      { label: 'Prozess', href: '/#prozess' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  footer: {
    tagline: 'Webentwicklung, Software, Design und betreuter Betrieb.',
    servicesTitle: 'Leistungen',
    companyTitle: 'Studio',
    legalTitle: 'Rechtliches',
    signature: 'built by B² // Design. Code. Repeat.',
  },
  notFound: {
    title: '404 // route not found',
    text: 'Diese Route ist nicht Teil des Systems oder wurde verschoben.',
    cta: 'Zur Startseite',
  },
  thankYou: {
    title: 'request.received',
    text: 'Danke. Deine Anfrage wurde an den Server übergeben. Ich melde mich über die angegebene E-Mail-Adresse.',
    cta: 'Zur Startseite',
  },
};
