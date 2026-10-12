/* src/app/core/data/studio-content/services-page.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Leistungsübersicht.
 */
export const DE_SERVICES_PAGE_CONTENT: Pick<StudioContent, 'servicesPage'> = {
  servicesPage: {
    seo: {
      title: 'Leistungen | Webentwicklung, Software, Design & Hosting',
      description:
        'Webentwicklung, Business-Software, UI/UX, Wartung, Managed Hosting und E-Mail-Betreuung bei Design. Code. Repeat.',
      keywords: ['Webentwicklung Leistungen', 'Softwareentwicklung', 'UI UX', 'Managed Hosting', 'Website Wartung'],
    },
    hero: {
      eyebrow: 'services.exe',
      title: 'Nicht jedes Problem braucht eine App. Aber jedes Projekt die richtige Lösung.',
      text: 'Von der kompakten Website bis zur internen Business-Anwendung: Entwicklung, Design und Betrieb werden passend zum tatsächlichen Problem zusammengesetzt.',
      primaryCta: 'Projekt einordnen',
      note: 'Preise sind Einstiegswerte. Umfang, Inhalte, Integrationen, Datenmodell und Betriebsanforderungen bestimmen den tatsächlichen Aufwand.',
    },
    offersHeading: {
      eyebrow: 'entry.points',
      title: 'Drei typische Einstiege.',
      text: 'Als Orientierung für häufige Projektgrößen – nicht als starre Baukästen.',
    },
    qualityBaseline: 'Responsive Design, Performance, grundlegendes SEO und Accessibility sind kein Aufpreis-Feature.',
    offerNote:
      'Individuelle Funktionen, Migrationen, komplexe Inhalte, Integrationen und besondere Infrastruktur werden transparent separat kalkuliert.',
    careHeading: {
      eyebrow: 'maintenance.mode',
      title: 'Pflege und Weiterentwicklung.',
      text: 'Für Projekte, die nach dem Launch regelmäßig kleine Änderungen, technische Checks oder priorisierte Betreuung brauchen.',
    },
    hostingHeading: {
      eyebrow: 'managed.ops',
      title: 'Betrieb als eigene Leistung.',
      text: 'Hosting, Deployment, Monitoring und Backups lassen sich als betreuter technischer Layer ergänzen. E-Mail bleibt bewusst ein optionales Add-on.',
    },
  },
};
