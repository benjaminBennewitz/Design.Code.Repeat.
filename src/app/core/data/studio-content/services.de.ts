/* src/app/core/data/studio-content/services.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Leistungsdefinitionen.
 */
export const DE_SERVICES_CONTENT: Pick<StudioContent, 'services'> = {
  services: [
    {
      slug: 'webentwicklung',
      icon: 'language',
      accent: 'primary',
      title: 'Webentwicklung',
      shortTitle: 'Web',
      kicker: 'Websites, Webpräsenzen und Frontends',
      summary:
        'Schnelle, responsive Websites mit sauberer Struktur, guter Nutzerführung und technischer Basis für SEO und Accessibility.',
      description:
        'Von der fokussierten Landingpage bis zur mehrseitigen Unternehmenspräsenz entsteht ein eigener Webauftritt ohne unnötig schweres Baukastensystem. Struktur, Designsystem, semantisches HTML, Performance und responsive Verhalten werden gemeinsam geplant.',
      price: 'ab 500 €',
      command: 'web --responsive --seo --a11y',
      outcomes: ['klarer digitaler Auftritt', 'schnelle Ladezeiten', 'wartbare Frontend-Struktur'],
      features: [
        'Unternehmenswebsites und Landingpages',
        'Angular oder bewusst schlanker HTML/JS-Stack',
        'Responsive UI und Designsystem',
        'SEO-Basics, Meta-Daten und interne Struktur',
        'WCAG-orientierte Accessibility',
      ],
      includes: [
        'Konzeption und Informationsarchitektur',
        'Frontend-Entwicklung',
        'Testing gängiger Viewports',
        'Performance- und Accessibility-Check',
      ],
      ctaLabel: 'Webprojekt besprechen',
    },
    {
      slug: 'softwareentwicklung',
      icon: 'terminal',
      accent: 'lime',
      title: 'Softwareentwicklung',
      shortTitle: 'Software',
      kicker: 'Webanwendungen, interne Tools und Automatisierung',
      summary:
        'Individuelle Business-Software für reale Prozesse: Daten, Rollen, Formulare, APIs, Workflows und Automatisierungen.',
      description:
        'Wenn Standardsoftware nicht zum Prozess passt, wird die Anwendung um den tatsächlichen Arbeitsablauf gebaut. Frontend, Django-Backend, Datenmodell, Berechtigungen und Integrationen werden als gemeinsames System entwickelt.',
      price: 'ab 1.650 €',
      command: 'app --angular --django --data',
      outcomes: ['weniger manuelle Arbeit', 'klare Zuständigkeiten', 'skalierbare Funktionsbasis'],
      features: [
        'Interne Tools und Dashboards',
        'Angular Frontends',
        'Django / Django REST APIs',
        'PostgreSQL und Datenmodelle',
        'Rollen- und Rechtekonzepte',
        'Automatisierungen und Hintergrundjobs',
      ],
      includes: [
        'Scope und Prozessanalyse',
        'Architektur und Datenmodell',
        'Frontend-/Backend-Umsetzung',
        'Dokumentierte Übergabe und Deployment-Vorbereitung',
      ],
      ctaLabel: 'Softwareprojekt einordnen',
    },
    {
      slug: 'ui-ux-design',
      icon: 'design_services',
      accent: 'pink',
      title: 'UI / UX / Design',
      shortTitle: 'Design',
      kicker: 'Interfaces, Designsysteme und visuelle Kommunikation',
      summary:
        'Gestaltung, die nicht nur dekoriert: klare Hierarchien, konsistente Zustände und wiederverwendbare visuelle Regeln.',
      description:
        'UI und UX werden eng mit der späteren technischen Umsetzung gedacht. So entstehen Systeme, deren Komponenten, States, Kontraste und responsive Regeln nicht nur im Designfile funktionieren.',
      price: 'nach Umfang',
      command: 'design --system --ui --brand',
      outcomes: ['klarere Nutzerführung', 'konsistente Oberflächen', 'schnellere Weiterentwicklung'],
      features: [
        'UI/UX-Konzeption',
        'Designsysteme und Komponentenlogik',
        'Responsive Layouts',
        'Grafikdesign und digitale Assets',
        'Interaktions- und Motion-Konzept',
      ],
      includes: [
        'Visuelle Richtung',
        'Komponenten- und State-Definition',
        'A11Y-orientierte Kontrastprüfung',
        'Entwicklungsnahe Übergabe',
      ],
      ctaLabel: 'Design besprechen',
    },
    {
      slug: 'wartung',
      icon: 'build_circle',
      accent: 'violet',
      title: 'Wartung & Betreuung',
      shortTitle: 'Care',
      kicker: 'Updates, Fehlerbehebung und Weiterentwicklung',
      summary:
        'Technische Betreuung für bestehende Projekte, damit kleine Probleme nicht zu einem großen Wartungsstau werden.',
      description:
        'Je nach Projekt können regelmäßige Checks, Content-Änderungen, Bugfixes und kleinere Weiterentwicklungen übernommen werden. Der Umfang bleibt transparent und wird nicht künstlich in große Retainer gezwungen.',
      price: 'ab 15 € / Monat',
      command: 'care --update --monitor --fix',
      outcomes: ['weniger Wartungsstau', 'planbare kleine Änderungen', 'technische Ansprechpartner'],
      features: [
        'Technische Checks',
        'Content- und Layoutanpassungen',
        'Bugfixes',
        'kleine Weiterentwicklungen',
        'priorisierte Betreuung je nach Modell',
      ],
      includes: ['abgestimmter Betreuungsumfang', 'nachvollziehbare Änderungen', 'keine versteckten Leistungspakete'],
      ctaLabel: 'Betreuung abstimmen',
    },
    {
      slug: 'managed-hosting',
      icon: 'dns',
      accent: 'orange',
      title: 'Managed Hosting',
      shortTitle: 'Hosting',
      kicker: 'Betreuter Betrieb statt anonymer Webspace',
      summary:
        'Hosting, Deployment, SSL, Monitoring, Backups und technische Administration als betreuter Layer zum Projekt.',
      description:
        'Managed Hosting richtet sich an Projekte, bei denen nicht nur Speicherplatz, sondern ein verlässlicher Betrieb gefragt ist. Server und Deployment werden passend zur Anwendung eingerichtet und technisch betreut.',
      price: 'nach Infrastruktur',
      command: 'ops --deploy --backup --monitor',
      outcomes: ['klarer Betriebszustand', 'wiederherstellbare Backups', 'weniger Infrastrukturaufwand'],
      features: [
        'Server-/Hosting-Einrichtung',
        'SSL und Deployment',
        'Monitoring und technische Checks',
        'Backups und Restore',
        'Updates und Security-Pflege',
        'technische Administration',
      ],
      includes: ['abgestimmtes Hosting-Setup', 'Deployment-Prozess', 'Backup-/Restore-Konzept', 'Monitoring-Basis'],
      ctaLabel: 'Hosting anfragen',
    },
    {
      slug: 'email',
      icon: 'alternate_email',
      accent: 'primary',
      title: 'E-Mail als Zusatzleistung',
      shortTitle: 'E-Mail',
      kicker: 'Postfächer unter eigener Domain',
      summary: 'E-Mail-Adressen, Aliase und technische Einrichtung als Ergänzung zur Website- oder Hosting-Betreuung.',
      description:
        'E-Mail bleibt bewusst Zusatzleistung und kein eigener Hosting-Geschäftsbereich. Postfächer und Aliase werden passend zur Domain eingerichtet und bei Bedarf technisch betreut.',
      price: 'optional zum Hosting',
      command: 'mail --domain --aliases --care',
      outcomes: ['professionelle Domain-Adressen', 'zentrale Einrichtung', 'weniger technische Reibung'],
      features: [
        'Postfächer unter eigener Domain',
        'Aliase',
        'Einrichtung auf Wunsch',
        'technische Betreuung',
        'Abstimmung mit Domain und Hosting',
      ],
      includes: [
        'Einrichtung der vereinbarten Konten',
        'DNS-/Mail-Konfiguration im vereinbarten Umfang',
        'Dokumentierte Zugangsdatenübergabe',
      ],
      ctaLabel: 'E-Mail-Setup besprechen',
    },
  ],
};
