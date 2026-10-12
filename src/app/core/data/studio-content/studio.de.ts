/* src/app/core/data/studio-content/studio.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Studio-Profil.
 */
export const DE_STUDIO_CONTENT: Pick<StudioContent, 'studioPage'> = {
  studioPage: {
    identity: {
      name: 'Benjamin Bennewitz',
      role: 'Entwicklung, Design & Betrieb',
      location: 'Mönchengladbach · Deutschland',
      portraitAlt: 'Ben mit Kaffeetasse',
      facets: [
        { icon: 'data_object', title: 'Full Stack', text: 'Interfaces, Daten und Anwendungen' },
        { icon: 'design_services', title: 'Design', text: 'Visuelle Systeme und verständliche Bedienung' },
        { icon: 'dns', title: 'Betrieb', text: 'Vom Deployment bis zur Weiterentwicklung' },
      ],
    },
    collaboration: {
      heading: {
        eyebrow: 'Zusammenarbeit',
        title: 'Du sprichst mit dem Menschen, der es baut.',
        text: 'Hinter Design. Code. Repeat. stehe ich: Ben. Gestaltung, technische Entscheidungen und Umsetzung greifen bei mir direkt ineinander. Für dich bedeutet das kurze Wege und einen Ansprechpartner, der das Projekt als Ganzes im Blick behält.',
      },
      items: [
        {
          icon: 'forum',
          title: 'Direkter Austausch',
          text: 'Am Anfang stehen dein Ziel, die Menschen hinter dem Projekt und die Abläufe, die es unterstützen soll. Auch ohne fertiges Konzept können wir damit gemeinsam eine Richtung finden.',
        },
        {
          icon: 'account_tree',
          title: 'Entscheidungen, die du nachvollziehen kannst',
          text: 'Ich erkläre, welche Lösung ich vorschlage und warum. Umfang, technische Abhängigkeiten und Abwägungen sollen verständlich bleiben, damit du fundiert entscheiden kannst.',
        },
        {
          icon: 'handshake',
          title: 'Ein Blick über den Launch hinaus',
          text: 'Eine Website oder Anwendung wird später gepflegt und genutzt. Deshalb denke ich Änderungen, Betrieb und Weiterentwicklung mit. Wie viel Betreuung du brauchst, stimmen wir passend zum Projekt ab.',
        },
      ],
    },
    location: {
      heading: {
        eyebrow: 'Standort & Zusammenarbeit',
        title: 'Im Rheinland zu Hause. Digital überall nah dran.',
        text: 'Mein Ausgangspunkt ist Mönchengladbach. Das Rheinland mit Düsseldorf, Köln und Bonn liegt nah – die Zusammenarbeit ist aber nicht an eine Region gebunden. Websites, Anwendungen und Designprojekte begleite ich auch deutschlandweit im digitalen Austausch.',
      },
      regions: [
        { code: 'MG', name: 'Mönchengladbach' },
        { code: 'D', name: 'Düsseldorf' },
        { code: 'K', name: 'Köln' },
        { code: 'BN', name: 'Bonn' },
      ],
      note: 'Nähe ist für mich vor allem eine Frage der Zusammenarbeit. Ein Beispiel außerhalb des Rheinlands ist die Praxiswebsite in Weinheim: Entscheidend sind klare Absprachen und ein gemeinsames Verständnis für das Projekt.',
      cta: 'Kundenprojekte entdecken',
    },
    seo: {
      title: 'Studio | Design. Code. Repeat.',
      description:
        'Design. Code. Repeat. verbindet Full-Stack-Webentwicklung, UI/UX, Design und technische Betreuung in einer persönlichen Studio-Struktur.',
      keywords: ['Webstudio Mönchengladbach', 'Full Stack Developer', 'Grafikdesign', 'Angular Django'],
    },
    heading: {
      eyebrow: 'about.studio',
      title: 'Design & Code. Persönlich.',
      text: 'Design. Code. Repeat. verbindet Webentwicklung, individuelle Software, Design und technische Betreuung in einer direkten Studio-Struktur. B² ist die Developer-Signatur dahinter.',
    },
    intro: [
      'Ich begleite Projekte nicht nur bis zum hübschen Screen. Struktur, Frontend, Backend, Daten, Deployment und spätere Wartbarkeit werden als ein zusammenhängendes Produkt betrachtet.',
      'Die Zusammenarbeit bleibt bewusst direkt: Anforderungen werden verständlich übersetzt, technische Entscheidungen transparent gemacht und unnötige Komplexität vermieden.',
    ],
    vita: {
      eyebrow: 'vita.log // ben',
      title: 'Entwicklung und Design seit über 10 Jahren.',
      text: 'Ich bin Ben, staatlich geprüfter Medieninformatiker (Multimedia) und zertifizierter Web Developer Full Stack. Mein Schwerpunkt liegt dort, wo Gestaltung und Technik zusammenkommen: von UI/UX und visuellen Systemen bis zu Full-Stack-Anwendungen, Datenlogik und produktivem Betrieb.',
      facts: ['Medieninformatik · Multimedia', 'Web Developer · Full Stack', 'Design · UI/UX · Software'],
    },
    principlesHeading: {
      eyebrow: 'principles.cfg',
      title: 'Wie ich Projekte entscheide.',
      text: 'Nicht jede gute technische Möglichkeit ist automatisch die richtige Produktentscheidung.',
    },
    principles: [
      { title: 'Problem vor Stack', text: 'Technologie folgt den Anforderungen – nicht umgekehrt.' },
      { title: 'Wartbar vor clever', text: 'Klare Architektur und verständlicher Code schlagen unnötige Magie.' },
      { title: 'Zugänglich ab Start', text: 'A11Y, Kontrast und Tastaturbedienung werden nicht am Ende angeklebt.' },
      {
        title: 'Betrieb mitdenken',
        text: 'Deployment, Backups, Monitoring und Updates gehören zur realen Lebensdauer eines Produkts.',
      },
    ],
    stackHeading: {
      eyebrow: 'stack.current',
      title: 'Technik, die ich produktiv einsetze.',
      text: 'Fokus auf bewährte Webtechnologien statt unnötig großer Toolchain.',
    },
    stack: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML',
      'SCSS',
      'Python',
      'Django',
      'Django REST Framework',
      'PostgreSQL',
      'Redis',
      'Git',
      'Docker',
      'Nginx',
      'Linux',
    ],
  },
};
