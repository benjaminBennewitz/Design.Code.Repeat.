/* src/app/core/data/studio-content/offers.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Angebote und Betreuungspakete.
 */
export const DE_OFFERS_CONTENT: Pick<StudioContent, 'offers' | 'carePlans'> = {
  offers: [
    {
      title: 'Starter Website',
      price: 'ab 500 €',
      claim: 'Schnell sichtbar. Klar auf den Punkt.',
      description:
        'Für einzelne Angebote, Kampagnen oder kompakte Webauftritte, bei denen eine klare Botschaft wichtiger ist als unnötiger Umfang.',
      command: 'web --landing --responsive --fast',
      features: [
        'Kompakter Onepager oder zielgerichtete Landingpage',
        'Eigenständiges Responsive Design statt Standardvorlage',
        'Schneller, sauberer technischer Aufbau',
      ],
      ctaLabel: 'Projekt anfragen',
    },
    {
      title: 'Webpräsenz',
      price: 'ab 950 €',
      badge: 'Empfohlen',
      featured: true,
      claim: 'Gefunden werden ist nur der Anfang.',
      description:
        'Für Unternehmen und Marken, die Vertrauen aufbauen, Nutzer führen und aus Aufmerksamkeit echte Anfragen machen wollen.',
      command: 'web --brand --content --conversion',
      features: [
        'Durchdachte Struktur für Leistungen, Inhalte und Kontakt',
        'Visuelles System passend zu Marke und Zielgruppe',
        'Nutzerführung für mehr Engagement und Conversion',
      ],
      ctaLabel: 'Webpräsenz planen',
    },
    {
      title: 'Business App',
      price: 'ab 1.650 €',
      claim: 'Wenn Software anfangen soll, Arbeit abzunehmen.',
      description:
        'Für interne Tools, Dashboards und individuelle Webanwendungen, die reale Prozesse digital abbilden oder automatisieren.',
      command: 'app --data --roles --automation',
      features: [
        'Interfaces für echte Arbeitsabläufe statt Demo-Screens',
        'Rollen, Formulare, Daten, APIs und Automatisierungen',
        'Wartbare Architektur für Funktionen, die wachsen dürfen',
      ],
      ctaLabel: 'Anwendung besprechen',
    },
  ],
  carePlans: [
    {
      name: 'Basic Care',
      price: '15 € / Monat',
      text: 'Für seltene kleine Änderungen.',
      features: ['kleine Text-/Bildänderungen', 'kurzer technischer Monatscheck'],
    },
    {
      name: 'Content Care',
      price: '39 € / Monat',
      text: 'Für regelmäßig gepflegte Inhalte.',
      features: ['regelmäßige Content-Updates', 'kleine Layoutanpassungen', 'Pflege wichtiger SEO-Snippets'],
    },
    {
      name: 'Priority Care',
      price: '79 € / Monat',
      text: 'Für Projekte mit häufigeren kleinen Aufgaben.',
      features: ['priorisierte Änderungen', 'Monitoring-Checks', 'kurze technische Beratung'],
    },
  ],
};
