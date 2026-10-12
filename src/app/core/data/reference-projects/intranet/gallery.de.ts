/* src/app/core/data/reference-projects/intranet/gallery.de.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Deutsche Intranet-Inhalte für Screenshots und Bildbeschreibungen.
 */
export const INTRANET_GALLERY_DE: Pick<PortfolioProject, 'gallery'> = {
  gallery: [
    {
      title: 'Login',
      text: 'Zentraler Einstieg in den Systemverbund mit gemeinsamer Authentifizierung und Session-Handling.',
      image: 'assets/images/projects/intranet/intranet-login.webp',
      alt: 'Login-Oberfläche des Intranets',
      size: 'md',
    },
    {
      title: 'Dashboard',
      text: 'Operativer Einstieg mit Kennzahlen, Statusinformationen und den wichtigsten Arbeitsbereichen.',
      image: 'assets/images/projects/intranet/intranet-dashboard.webp',
      alt: 'Dashboard des Intranets mit Kennzahlen und Statusinformationen',
      size: 'lg',
    },
    {
      title: 'App-Übersicht',
      text: 'Die verfügbaren Fachanwendungen werden abhängig von Rolle und App-Rechten zentral bereitgestellt.',
      image: 'assets/images/projects/intranet/intranet-app-overview.webp',
      alt: 'App-Übersicht des Intranets',
      size: 'md',
    },
    {
      title: 'Control Panel',
      text: 'Geschützter Administrationsbereich für zentrale System- und Anwendungseinstellungen.',
      image: 'assets/images/projects/intranet/intranet-control-panel.webp',
      alt: 'Control Panel des Intranets',
      size: 'lg',
    },
    {
      title: 'User-Rechte',
      text: 'Feingranulare App- und Funktionsrechte lassen sich nutzerbezogen verwalten und kontrollieren.',
      image: 'assets/images/projects/intranet/intranet-user-rights-modal.webp',
      alt: 'Dialog zur Verwaltung von Benutzerrechten',
      size: 'md',
    },
    {
      title: 'Produktionsimport',
      text: 'Eingehende AU-/XLSX-Daten werden geprüft, synchronisiert und bei Konflikten nachvollziehbar aufbereitet.',
      image: 'assets/images/projects/intranet/intranet-import-inbox.webp',
      alt: 'Import-Inbox für Produktionsdaten',
      size: 'lg',
    },
    {
      title: 'Auftragsstatus',
      text: 'Produktionszustände, Teilmengen und Bearbeitungsfortschritt bleiben im operativen Kontext sichtbar.',
      image: 'assets/images/projects/intranet/intranet-order-status.webp',
      alt: 'Statusansicht eines Produktionsauftrags',
      size: 'md',
    },
    {
      title: 'Auftragshistorie',
      text: 'Statuswechsel und relevante Änderungen können direkt am Auftrag nachvollzogen werden.',
      image: 'assets/images/projects/intranet/intranet-order-history-modal.webp',
      alt: 'Historie eines Produktionsauftrags',
      size: 'md',
    },
    {
      title: 'Wartungssteuerung',
      text: 'Wartungszustände können kontrolliert gesetzt und für betroffene Bereiche transparent kommuniziert werden.',
      image: 'assets/images/projects/intranet/intranet-maintenance-modal.webp',
      alt: 'Wartungsdialog des Intranets',
      size: 'md',
    },
    {
      title: 'Database Health',
      text: 'Datenbankstatus, Locks und technische Kennzahlen werden als geschützte Ops-Sicht aufbereitet.',
      image: 'assets/images/projects/intranet/intranet-db-health.webp',
      alt: 'Database-Health-Ansicht des Intranets',
      size: 'lg',
    },
    {
      title: 'Document Share',
      text: 'Dokumente, Kategorien, Vorschauen und berechtigte Suchpfade werden in einer gemeinsamen Oberfläche gebündelt.',
      image: 'assets/images/projects/intranet/document-share.webp',
      alt: 'Document-Share-Oberfläche des Intranets',
      size: 'lg',
    },
    {
      title: 'Projects · Einstieg',
      text: 'Persönlicher Einstieg in Aufgaben, Projekte und anstehende Arbeit innerhalb des gemeinsamen Workflows.',
      image: 'assets/images/projects/intranet/projects-welcome.webp',
      alt: 'Projects-Startansicht des Intranets',
      size: 'md',
    },
    {
      title: 'Projects · Board',
      text: 'Boards verbinden Aufgaben, Zuständigkeiten, Status und Produktionsbezüge in einer operativen Arbeitsfläche.',
      image: 'assets/images/projects/intranet/projects-board.webp',
      alt: 'Projects-Board des Intranets',
      size: 'lg',
    },
    {
      title: 'Projects · Inbox',
      text: 'Neue und zugewiesene Aufgaben werden zentral gesammelt und anschließend in den passenden Workflow überführt.',
      image: 'assets/images/projects/intranet/projects-inbox.webp',
      alt: 'Projects-Inbox des Intranets',
      size: 'md',
    },
  ],
};
