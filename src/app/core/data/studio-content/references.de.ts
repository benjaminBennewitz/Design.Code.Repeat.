/* src/app/core/data/studio-content/references.de.ts */
import type { StudioContent } from '../../models/studio.models';
import { CARLY_MANAGED_CASE_URL, GLOBI_FLOW_DEMO_URL } from './demo-links';

/**
 * Deutsche Inhalte für technische Referenzen.
 */
export const DE_REFERENCES_CONTENT: Pick<StudioContent, 'references'> = {
  references: [
    {
      slug: 'intranet',
      name: 'Intranet',
      type: 'Modular Business Platform',
      year: '2025–2026',
      accent: 'primary',
      summary:
        'Modulares Intranet mit Projektmanagement, automatisierter Auftragsverwaltung, Document Share, Admin Panel, Qualitäts- und Reklamationsmanagement u. v. m. – verbunden über einen gemeinsamen Rechte- und Datenkern.',
      stack: ['Angular', 'Django', 'PostgreSQL', 'Channels'],
      details: [
        'Zentraler Auth-, Rechte- und Datenkern',
        'Mehrere Fach-Apps in einem verbundenen System',
        'Private Case Study mit Screenshots statt Live-Demo',
      ],
      image: 'assets/images/projects/intranet/intranet-dashboard.webp',
      imageAlt: 'Intranet-Dashboard mit Kennzahlen und zentraler Navigation',
      linkHint:
        'Keine öffentliche Live-Demo: Die vertiefte DCR-Seite zeigt strukturierte Screenshots und die Systemlogik.',
      ctaLabel: 'Screenshots ansehen',
      internalRoute: '/referenzen/intranet',
    },
    {
      slug: 'carly-managed',
      name: 'Carly Managed',
      type: 'Project Management',
      year: '2026',
      accent: 'violet',
      summary:
        'Projektmanagement-App mit Kanban, Aufgaben, Kommentaren, Anhängen und Live-Kollaboration – ergänzt um eine spielerische Tamagotchi-Note durch das interaktive Maskottchen Carly.',
      stack: ['Angular', 'Django', 'WebSockets', 'Redis'],
      details: [
        'Board, Inbox, Pool und Teamflächen',
        'Live-Sync, Kommentare und Anhänge direkt am Task',
        'Carly als optionale Mascot-UX- und Gamification-Ebene',
      ],
      image: 'assets/images/projects/carly-managed/dashboard.webp',
      imageAlt: 'Carly-Managed-Dashboard mit Aufgabenübersicht und Team-Widgets',
      linkHint:
        'Die kontrollierte öffentliche Demo zeigt Carly Managed mit vorbereiteten Projekten und sicheren Testdaten.',
      ctaLabel: 'Live-Demo öffnen',
      portfolioUrl: CARLY_MANAGED_CASE_URL,
    },
    {
      slug: 'dein-fussabdruck',
      name: 'Dein Fußabdruck',
      type: 'Interactive Simulation',
      year: '2026',
      accent: 'lime',
      summary:
        'Interaktive Ökosystem-Simulation, die persönliche Entscheidungen in zeitversetzte, sichtbare Folgen übersetzt und komplexe Zusammenhänge spielerisch erfahrbar macht.',
      stack: ['Angular', 'TypeScript', 'Simulation', 'Motion'],
      details: [
        'Drei reagierende Ökosysteme',
        'Zeitversetzte Folgen statt Sofort-Effekte',
        'Vollständig clientseitige Simulation im Browser',
      ],
      linkHint: 'Die Case Study ist vorbereitet, aber noch nicht öffentlich freigeschaltet.',
      availability: 'coming-soon',
    },
    {
      slug: 'globi-flow',
      name: 'Globi Flow',
      type: 'Local OCR / Health Data Workflow',
      year: '2026',
      accent: 'primary',
      summary:
        'Lokales Laborwerte-Assistenzsystem für synthetische Testdaten: PDF-Textschicht oder OCR, prüfbare Werte, Review und Patientenbericht – mit gehärtetem Upload- und Verarbeitungsweg.',
      stack: ['Angular', 'Django', 'PostgreSQL', 'Redis/Celery', 'Tesseract'],
      details: [
        'Lokale PDF-/OCR-Verarbeitung mit Poppler und Tesseract',
        'Private Upload-Quarantäne mit Signatur-/MIME-Prüfung und lokalem ClamAV-Scan',
        'Session-/CSRF-Isolation, separater Parserprozess, Review-Freigabe und kontrollierter Patientenbericht',
      ],
      image: 'assets/images/projects/globi-flow.webp',
      imageAlt: 'Globi Flow Dashboard mit Statuskarten und Arbeitsübersicht',
      linkHint:
        'Die öffentliche Demo läuft isoliert mit ausschließlich synthetischen Testdaten; echte Gesundheitsdaten und externe Analyse-APIs sind ausgeschlossen.',
      ctaLabel: 'Live-Demo öffnen',
      portfolioUrl: GLOBI_FLOW_DEMO_URL,
    },
    {
      slug: 'design-archive',
      name: 'Design Archiv',
      type: 'Graphic Design / Editorial',
      year: '2017–2023',
      accent: 'pink',
      summary:
        'Interaktiver Designkatalog als kuratierte Reise durch Editorial, Retusche, Composing und experimentelle visuelle Arbeiten aus mehreren Jahren.',
      stack: ['Photoshop', 'Lightroom', 'Editorial', 'WebP'],
      details: [
        'Interaktiver Reader statt statischer PDF-Vorschau',
        'Editorial, Retusche und Composing über mehrere Jahre',
        'Kuratiertes Archiv mit echter WebP-Galerie',
      ],
      image: 'assets/images/projects/design-catalog/en/catalog-page-01.webp',
      imageAlt: 'Coveransicht des kuratierten Design-Archivs',
      internalRoute: '/referenzen/design-archiv',
    },
  ],
};
