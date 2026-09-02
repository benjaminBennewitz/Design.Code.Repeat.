/**
 * @file Einmalige vertiefte Intranet-Case-Study innerhalb der Studio-Site.
 * @description Ersetzt die fehlende Live-Demo durch eine strukturierte interne Detailseite mit Screenshots und Architekturkontext.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoPageContent, StudioLanguage } from '../../core/models/studio.models';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

interface IntranetMetric {
  readonly value: string;
  readonly label: string;
  readonly text: string;
}

interface IntranetModule {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
}

interface IntranetChapter {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly points: readonly string[];
}

interface IntranetShot {
  readonly title: string;
  readonly text: string;
  readonly image: string;
  readonly alt: string;
}

interface IntranetCaseContent {
  readonly seo: SeoPageContent;
  readonly backLabel: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly lead: string;
  readonly portfolioLabel: string;
  readonly noteTitle: string;
  readonly noteText: string;
  readonly metricHeading: { eyebrow: string; title: string; text: string };
  readonly metrics: readonly IntranetMetric[];
  readonly moduleHeading: { eyebrow: string; title: string; text: string };
  readonly modules: readonly IntranetModule[];
  readonly chapterHeading: { eyebrow: string; title: string; text: string };
  readonly chapters: readonly IntranetChapter[];
  readonly galleryHeading: { eyebrow: string; title: string; text: string };
  readonly shots: readonly IntranetShot[];
}

const INTRANET_CASE_CONTENT: Record<StudioLanguage, IntranetCaseContent> = {
  de: {
    seo: {
      title: 'Intranet – Private Case Study | Design. Code. Repeat.',
      description: 'Private Intranet-Case-Study mit Screenshots, Architekturkontext und zentralen Plattform-Bausteinen.',
      keywords: ['Intranet', 'Angular', 'Django', 'Case Study', 'Business Plattform', 'Screenshots'],
    },
    backLabel: 'Zurück zu den Referenzen',
    eyebrow: 'PRIVATE CASE STUDY',
    title: 'Intranet',
    summary: 'Mehrere Apps. Ein Backend. Ein Rechtekern. Statt einer öffentlichen Live-Demo zeigt diese Seite eine kuratierte Momentaufnahme des Systems.',
    lead: 'Das Intranet ist kein einzelnes Dashboard, sondern ein verbundener Systemraum für Produktion, Projects, Document Share, Rechteverwaltung und technische Betriebsansicht. Da reale Rechte, Datenflüsse, Worker, lokale Mounts und interne Services dazugehören, bleibt die öffentliche Darstellung bewusst bei Screenshots und Architekturkontext.',
    portfolioLabel: 'Vollständige Portfolio-Case-Study',
    noteTitle: 'Warum keine Live-Demo?',
    noteText: 'Authentifizierung, Rollen, Produktivdaten, Automatisierungen, Dateizugriffe und interne Betriebsdienste lassen sich öffentlich nicht sinnvoll oder sicher abbilden. Deshalb ersetzt diese Ansicht die Demo durch kuratierte Screens und die Systemlogik dahinter.',
    metricHeading: {
      eyebrow: 'SYSTEM SNAPSHOT',
      title: 'Ein Systemverbund statt einer Einzel-App',
      text: 'Die Kennzahlen zeigen bewusst nur Struktur und Architektur-Tiefe – nicht interne Betriebsdaten.',
    },
    metrics: [
      { value: '7', label: 'App-Module', text: 'Produktion, Projects, Document Share, Health, Reklamationen und weitere Bereiche greifen auf dieselbe Plattform zurück.' },
      { value: 'JWT', label: 'Auth-Kern', text: 'Zentrale Anmeldung, Refresh-Flow, CSRF-Endpunkt und Rechtezuweisungen bilden denselben Zugriffskern.' },
      { value: 'Live', label: 'Realtime', text: 'Channels, Redis und WebSockets halten Presence, Boards, Nachrichten und Importzustände synchron.' },
      { value: 'Async', label: 'Worker-Flows', text: 'Langlaufende Aufgaben laufen getrennt über Celery und halten UI-Requests schlank.' },
    ],
    moduleHeading: {
      eyebrow: 'APP SURFACE',
      title: 'Fachlich getrennt, technisch verbunden',
      text: 'Jede Oberfläche erfüllt eine eigene Aufgabe, nutzt aber denselben Auth-, Daten- und Navigationskern.',
    },
    modules: [
      { eyebrow: 'Produktion', title: 'Import, Status und operative Steuerung', text: 'AU-/XLSX-Daten werden geprüft, mit bestehenden Datensätzen abgeglichen und bei Konflikten kontrolliert behandelt. Status, Teilmengen und Verlauf bleiben direkt im Arbeitskontext sichtbar.' },
      { eyebrow: 'Projects', title: 'Boards, Pool und persönliche Workflows', text: 'Aufgaben, Kommentare, Anhänge, wiederkehrende Jobs und produktionsnahe Sync-Flows werden in einer gemeinsamen Arbeitsoberfläche gebündelt.' },
      { eyebrow: 'Document Share', title: 'Dateien mit Vorschau und Rechten', text: 'Dokumente, Kategorien, Suchlogik, Vorschauen und Zugriffsrechte laufen über einen gemeinsamen Storage- und Indexierungsansatz.' },
      { eyebrow: 'Operations', title: 'System Health und Wartungssteuerung', text: 'Datenbank, Redis, Worker, Dienste, Logs und Maintenance-Zustände bleiben in geschützten Ops-Ansichten kontrollierbar.' },
    ],
    chapterHeading: {
      eyebrow: 'ARCHITEKTUR',
      title: 'Was das System technisch zusammenhält',
      text: 'Nicht die Menge der Screens ist entscheidend, sondern der gemeinsam gedachte Plattformkern dahinter.',
    },
    chapters: [
      { eyebrow: 'Auth & Rechte', title: 'Zentrale Anmeldung mit rollenbasiertem Zugriff', text: 'Sichtbarkeit, Fachfunktion und Sonderrechte werden getrennt betrachtet. So kann eine App sichtbar sein, ohne automatisch jede Aktion freizugeben.', points: ['JWT-Cookie-Flow mit Refresh', 'AppPermission/UserAppPermission', 'Developer-Zonen und Pending-Lifecycle'] },
      { eyebrow: 'Sync & Daten', title: 'Fachliche Daten bleiben nachvollziehbar', text: 'Reimports, Konflikte, Statushistorien und gekoppelte Workflows werden nicht als Tabellenkopie behandelt, sondern als kontrollierter Datenprozess.', points: ['Import-Hashing und Konfliktmodell', 'Statushistorien und Soft-Removal', 'gekoppelte Workflow-Syncs'] },
      { eyebrow: 'Realtime', title: 'Aktive Oberflächen ohne Polling-Flut', text: 'Presence, Nachrichten, Board-Änderungen und Importfortschritte werden in Echtzeit übermittelt und halten mehrere Nutzer im gleichen Arbeitsstand.', points: ['Django Channels + Redis', 'WebSocket-Gruppen je Fachbereich', 'gezielte UI-Refreshs statt Reload-Spam'] },
      { eyebrow: 'Ops', title: 'Betrieb wird als Teil des Produkts mitgedacht', text: 'Monitoring, Logs, Maintenance und Dienstzustände sind nicht nachgelagert, sondern bewusst in den Systemverbund integriert.', points: ['DB-/Redis-/Worker-Checks', 'Maintenance Mode', 'geschützte Betriebsansichten'] },
    ],
    galleryHeading: {
      eyebrow: 'SCREEN SET',
      title: 'Anonymisierte Einblicke in die Oberfläche',
      text: 'Die Auswahl zeigt bewusst verschiedene Ebenen des Systems – vom Einstieg bis zu fachlichen Arbeitsbereichen.',
    },
    shots: [
      { title: 'Dashboard', text: 'Operativer Einstieg mit Kennzahlen, Schnellzugriffen und Plattformzustand.', image: 'assets/images/projects/intranet/intranet-dashboard.webp', alt: 'Intranet-Dashboard mit Kennzahlen und Schnellzugriffen' },
      { title: 'App-Übersicht', text: 'Zentrale Navigation über die verfügbaren Fachanwendungen abhängig von Rolle und Berechtigung.', image: 'assets/images/projects/intranet/intranet-app-overview.webp', alt: 'App-Übersicht mit mehreren Intranet-Modulen' },
      { title: 'Control Panel', text: 'Geschützter Bereich für systemweite Einstellungen und administrative Eingriffe.', image: 'assets/images/projects/intranet/intranet-control-panel.webp', alt: 'Control Panel des Intranets' },
      { title: 'Auftragsstatus', text: 'Produktionsdaten, Fortschritt und Bearbeitungszustände bleiben direkt im operativen Kontext sichtbar.', image: 'assets/images/projects/intranet/intranet-order-status.webp', alt: 'Ansicht eines Produktionsauftrags mit Statusinformationen' },
      { title: 'Document Share', text: 'Dateizugriff, Vorschau und Suche werden in einer gemeinsamen Arbeitsoberfläche gebündelt.', image: 'assets/images/projects/intranet/document-share.webp', alt: 'Document-Share-Oberfläche des Intranets' },
      { title: 'Projects Board', text: 'Boards verbinden Aufgaben, Zuständigkeiten und fachliche Produktionsbezüge.', image: 'assets/images/projects/intranet/projects-board.webp', alt: 'Projects-Board mit Aufgaben und Statusspalten' },
    ],
  },
  en: {
    seo: {
      title: 'Intranet – Private Case Study | Design. Code. Repeat.',
      description: 'Private intranet case study with screenshots, architecture context and key platform building blocks.',
      keywords: ['Intranet', 'Angular', 'Django', 'Case Study', 'Business Platform', 'Screenshots'],
    },
    backLabel: 'Back to references',
    eyebrow: 'PRIVATE CASE STUDY',
    title: 'Intranet',
    summary: 'Multiple apps. One backend. One permission core. Instead of a public live demo, this page shows a curated snapshot of the system.',
    lead: 'The intranet is not a single dashboard but a connected system space for production, projects, document sharing, permissions and technical operations. Because real permissions, data flows, workers, local mounts and internal services are part of it, the public presentation intentionally stays with screenshots and architecture context.',
    portfolioLabel: 'Full portfolio case study',
    noteTitle: 'Why no live demo?',
    noteText: 'Authentication, roles, production data, automations, file access and internal operating services cannot be represented publicly in a meaningful or safe way. This view therefore replaces the demo with curated screens and the system logic behind them.',
    metricHeading: {
      eyebrow: 'SYSTEM SNAPSHOT',
      title: 'A platform system instead of a single app',
      text: 'These metrics intentionally describe structure and architectural depth – not internal operating data.',
    },
    metrics: [
      { value: '7', label: 'App modules', text: 'Production, projects, document share, health, complaints and further areas all sit on the same platform.' },
      { value: 'JWT', label: 'Auth core', text: 'Central login, refresh flow, CSRF endpoint and permission assignment share the same access core.' },
      { value: 'Live', label: 'Realtime', text: 'Channels, Redis and WebSockets keep presence, boards, messages and import states in sync.' },
      { value: 'Async', label: 'Worker flows', text: 'Long-running tasks are offloaded through Celery so UI requests stay lean.' },
    ],
    moduleHeading: {
      eyebrow: 'APP SURFACE',
      title: 'Separated by domain, connected by platform',
      text: 'Each surface serves its own business goal while sharing the same auth, data and navigation core.',
    },
    modules: [
      { eyebrow: 'Production', title: 'Import, status and operational control', text: 'AU/XLSX data is validated, matched against existing records and handled safely when conflicts appear. Status, partial quantities and history remain visible inside the working context.' },
      { eyebrow: 'Projects', title: 'Boards, pool and personal workflows', text: 'Tasks, comments, attachments, recurring jobs and production-related sync flows are combined in one shared workspace.' },
      { eyebrow: 'Document Share', title: 'Files with previews and permissions', text: 'Documents, categories, search logic, previews and access rules use a shared storage and indexing approach.' },
      { eyebrow: 'Operations', title: 'System health and maintenance control', text: 'Database, Redis, workers, services, logs and maintenance states remain observable in protected operations views.' },
    ],
    chapterHeading: {
      eyebrow: 'ARCHITECTURE',
      title: 'What keeps the system together technically',
      text: 'The important part is not just the number of screens, but the shared platform core behind them.',
    },
    chapters: [
      { eyebrow: 'Auth & Permissions', title: 'Central sign-in with role-based access', text: 'Visibility, business actions and elevated permissions are handled as separate concerns. An app can be visible without automatically granting every action.', points: ['JWT cookie flow with refresh', 'AppPermission/UserAppPermission', 'Developer zones and pending lifecycle'] },
      { eyebrow: 'Sync & Data', title: 'Business data stays traceable', text: 'Reimports, conflicts, status histories and connected workflows are not treated as raw table copies, but as controlled data processes.', points: ['Import hashing and conflict model', 'Status histories and soft removal', 'connected workflow syncs'] },
      { eyebrow: 'Realtime', title: 'Active surfaces without polling noise', text: 'Presence, messaging, board changes and import progress are transmitted in realtime so multiple users stay on the same working state.', points: ['Django Channels + Redis', 'WebSocket groups per domain', 'targeted UI refresh instead of reload spam'] },
      { eyebrow: 'Ops', title: 'Operations is part of the product', text: 'Monitoring, logs, maintenance and service states are not an afterthought; they are intentionally integrated into the platform.', points: ['DB / Redis / worker checks', 'maintenance mode', 'protected operations views'] },
    ],
    galleryHeading: {
      eyebrow: 'SCREEN SET',
      title: 'Anonymized glimpses into the interface',
      text: 'The selection intentionally spans different layers of the system – from entry points to domain-specific work areas.',
    },
    shots: [
      { title: 'Dashboard', text: 'Operational entry point with metrics, quick actions and platform status.', image: 'assets/images/projects/intranet/intranet-dashboard.webp', alt: 'Intranet dashboard with metrics and quick actions' },
      { title: 'App Overview', text: 'Central navigation across available business apps depending on role and permissions.', image: 'assets/images/projects/intranet/intranet-app-overview.webp', alt: 'App overview with multiple intranet modules' },
      { title: 'Control Panel', text: 'Protected area for system-wide settings and administrative actions.', image: 'assets/images/projects/intranet/intranet-control-panel.webp', alt: 'Intranet control panel' },
      { title: 'Order Status', text: 'Production data, progress and processing states stay visible inside the operational context.', image: 'assets/images/projects/intranet/intranet-order-status.webp', alt: 'Production order view with status information' },
      { title: 'Document Share', text: 'File access, previews and search come together in one working surface.', image: 'assets/images/projects/intranet/document-share.webp', alt: 'Intranet document share interface' },
      { title: 'Projects Board', text: 'Boards combine tasks, responsibilities and business-related production context.', image: 'assets/images/projects/intranet/projects-board.webp', alt: 'Projects board with tasks and status columns' },
    ],
  },
};

@Component({
  selector: 'dcr-intranet-case-page',
  standalone: true,
  imports: [RouterLink, SectionHeadingComponent],
  templateUrl: './intranet-case-page.component.html',
  styleUrl: './intranet-case-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntranetCasePageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);

  readonly content = computed(() => INTRANET_CASE_CONTENT[this.languageService.language()]);
  readonly portfolioUrl = 'https://b2folio.de/projects/intranet';

  constructor() {
    effect(() => this.seoService.setPage(this.content().seo, '/referenzen/intranet'));
  }
}
