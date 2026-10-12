/* src/app/core/data/studio-content/references-page.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Referenzübersicht.
 */
export const DE_REFERENCES_PAGE_CONTENT: Pick<StudioContent, 'referencesPage'> = {
  referencesPage: {
    seo: {
      title: 'Referenzen | Design. Code. Repeat.',
      description:
        'Ausgewählte Referenzen aus Webentwicklung, Business-Software, interaktiven Anwendungen und Grafikdesign.',
      keywords: ['Webentwicklung Referenzen', 'Angular Projekte', 'Django Projekte', 'UI UX Referenzen'],
    },
    heading: {
      eyebrow: 'references.index',
      title: 'Techs & Clients.',
      text: 'Von verbundenen Anwendungen bis zum öffentlichen Webauftritt: Hier stehen die technischen Ideen hinter einem Projekt neben den Websites, die daraus für Kunden entstehen. Zwei Perspektiven auf Entwicklung, Gestaltung und den Einsatz im Alltag.',
    },
    closing: {
      eyebrow: 'Design. Code. Repeat.',
      title: 'Andere Projekte. Dasselbe Prinzip.',
      paragraphs: [
        'Eine Praxiswebsite braucht eine andere Sprache als ein internes Werkzeug. Ein Shop andere Abläufe als eine Simulation. Was sie verbindet: Gestaltung und Technik müssen zu den Menschen passen, die damit arbeiten.',
        'Deshalb beginnt ein neues Projekt mit Fragen: Was soll einfacher werden? Welche Informationen müssen ankommen? Was ist schon vorhanden? Daraus entsteht eine Lösung, die verständlich bleibt und sich weiterentwickeln lässt.',
      ],
      cta: 'Über dein Projekt sprechen',
    },
    techs: {
      title: 'Techs',
      text: 'Anwendungen, Experimente und ein Design-Archiv. Die Case Studies zeigen, welche Aufgaben dahinterstehen und wie Interfaces, Daten und technische Entscheidungen zusammenspielen.',
      features: [
        'Architektur und verbundene Arbeitsabläufe',
        'Interaktion, Simulation und visuelle Gestaltung',
        'Screenshots, Demos und Einblicke in die Umsetzung',
      ],
      cta: 'Case Studies entdecken',
    },
    clients: {
      title: 'Clients',
      text: 'Websites für Unternehmen, Praxen und Vereine. Im Mittelpunkt stehen klare Informationen, ein passender visueller Auftritt und Funktionen, die im jeweiligen Alltag gebraucht werden.',
      features: [
        'Unternehmensauftritte und lokale Angebote',
        'Webshops und redaktionell gepflegte Inhalte',
        'Individuelle Frontends und kleine CMS-Lösungen',
      ],
      cta: 'Kundenprojekte ansehen',
    },
    portfolioHint:
      'Mehr Architektur, Screens und technische Entscheidungen gibt es direkt in der jeweiligen Case Study.',
    cta: 'Case Study öffnen',
    comingSoonEyebrow: 'Case Study / Deep Dive',
    comingSoonLabel: 'Demnächst verfügbar',
    comingSoonText: 'Die öffentliche DCR-Case-Study wird gerade vorbereitet.',
    deliveredHeading: {
      eyebrow: 'realisiert.log',
      title: 'Realisierte Kundenprojekte.',
      text: 'Veröffentlichte Websites und Websysteme aus realen Kundenprojekten – vom kompakten Auftritt bis zur individuellen Anwendung.',
    },
    deliveredCta: 'Projekt öffnen',
    deliveredAriaLabel: 'Realisierte Kundenprojekte',
  },
};
