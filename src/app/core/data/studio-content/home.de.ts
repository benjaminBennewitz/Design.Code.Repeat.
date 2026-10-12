/* src/app/core/data/studio-content/home.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Startseite.
 */
export const DE_HOME_CONTENT: Pick<StudioContent, 'home'> = {
  home: {
    seo: {
      title: 'Design. Code. Repeat. | Webentwicklung, Software & Design',
      description:
        'Websites, individuelle Webanwendungen, UI/UX, Wartung und Managed Hosting aus einer technisch sauberen, persönlich betreuten Studio-Struktur.',
      keywords: [
        'Webentwicklung',
        'Angular',
        'Django',
        'Webanwendungen',
        'UI UX Design',
        'Managed Hosting',
        'Mönchengladbach',
      ],
    },
    hero: {
      eyebrow: 'studio.system // online',
      title: 'Digitale Produkte, die nicht nur gut aussehen, sondern Arbeit erledigen.',
      lead: 'Webentwicklung, individuelle Software und Design mit einem klaren Prinzip: Problem verstehen, System sauber bauen, Ergebnis langfristig betreiben.',
      primaryCta: 'Leistungen ansehen',
      secondaryCta: 'Projekt besprechen',
      status: ['angular_22=ready', 'django=available', 'accessibility=baseline', 'hosting=managed'],
      proof: [
        { value: 'Full Stack', label: 'Frontend bis Betrieb' },
        { value: 'DE / EN', label: 'international vorbereitet' },
        { value: 'WCAG', label: 'Barrierefreiheit mitgedacht' },
      ],
    },
    services: {
      eyebrow: 'services.loaded',
      title: 'Was gebaut wird, hängt vom Problem ab.',
      text: 'Keine Schubladenlösung: vom fokussierten Webauftritt bis zur internen Business-Anwendung – mit Architektur, UX und Betrieb als zusammenhängendem System.',
    },
    hosting: {
      eyebrow: 'ops.layer',
      title: 'Nach dem Launch ist nicht Schluss.',
      text: 'Managed Hosting ist kein anonymer Billig-Webspace, sondern betreuter technischer Betrieb für Projekte, die zuverlässig erreichbar und wartbar bleiben sollen.',
      points: ['SSL & Deployment', 'Monitoring & Backups', 'Updates & Security', 'Restore & technische Administration'],
      emailTitle: 'E-Mail optional dazu.',
      emailText:
        'Postfächer unter eigener Domain, Aliase, Einrichtung und technische Betreuung als Ergänzung zur Website-/Hosting-Betreuung.',
      cta: 'Hosting ansehen',
    },
    references: {
      eyebrow: 'selected.work',
      title: 'Echte Systeme statt austauschbarer Mockups.',
      text: 'Ausgewählte Projekte zeigen unterschiedliche Problemklassen: interne Tools, interaktive Anwendungen, Datenworkflows und visuelle Systeme.',
    },
    process: {
      eyebrow: 'workflow.exe',
      title: 'Klarer Prozess. Weniger Überraschungen.',
      text: 'Vom ersten Scope bis zum Betrieb bleibt sichtbar, warum eine Entscheidung getroffen wurde und was als Nächstes passiert.',
    },
    faq: {
      eyebrow: 'faq.query',
      title: 'Fragen, bevor sie zum Ticket werden.',
      text: '',
    },
    contact: {
      eyebrow: 'connection.ready',
      title: 'Ein Problem reicht als Startpunkt.',
      text: 'Du brauchst noch kein fertiges Lastenheft. Ein konkretes Ziel, ein nerviger Prozess oder eine vorhandene Website, die nicht mehr mitkommt, genügt für ein erstes Gespräch.',
    },
  },
};
