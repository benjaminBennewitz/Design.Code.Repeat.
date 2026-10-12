/* src/app/core/data/reference-projects/intranet/system.de.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Deutsche Intranet-Inhalte für Systemarchitektur und Fähigkeiten.
 */
export const INTRANET_SYSTEM_DE: Pick<PortfolioProject, 'chapters' | 'architecture' | 'capabilities'> = {
  chapters: [
    {
      eyebrow: 'Auth & Rechte',
      title: 'Zentrale Anmeldung mit fachlicher Rechte-Matrix',
      text: 'Die Plattform arbeitet mit einer gemeinsamen Login-Basis, JWT-/Refresh-Flow, CSRF-Endpunkt und einem Rechtekern aus Apps, Permission-Codes und User-Zuweisungen. Dadurch kann eine Oberfläche sichtbar sein, ohne automatisch jede Aktion freizugeben.',
      points: [
        'JWT-Cookie-Flow mit Refresh und Logout',
        'AppPermission/UserAppPermission als DB-Modell',
        'Developer-only Bereiche für System Health',
        'Routen- und Aktionsrechte getrennt gedacht',
      ],
    },
    {
      eyebrow: 'Produktion',
      title: 'XLSX-Import als stabiler Daten-Sync statt Tabellenkopie',
      text: 'Der Produktionsbereich verarbeitet AU-Dateien, Positionen, Versand, Archiv, Teilmengen und Statuslogik. Besonders wichtig ist der nicht-destruktive Reimport: gelöschte oder verschobene XLSX-Zeilen dürfen vorhandene DB-Slots nicht unkontrolliert zerstören.',
      points: [
        'OrderFile mit Import-Hash und Zeitstempel',
        'OrderPosition mit Soft-Removal und Fingerprint',
        'OrderImportConflict mit stabiler conflict_signature',
        'Mutation-Log und Blockierung bei offenen Konflikten',
      ],
    },
    {
      eyebrow: 'Projects Sync',
      title: 'Produktionszustände werden zu Aufgaben-Workflows',
      text: 'Projects übernimmt Produktionsbezüge über Sync-Links und Outbox-Modelle. Aufgaben, Unteraufgaben, Kommentare, Anhänge, Notifications und Pool-Logik werden aus Fachzuständen heraus erzeugt oder aktualisiert.',
      points: [
        'ProductionOrderTaskSyncLink als Kopplung',
        'Outbox/Celery-Weitergabe für robuste Verarbeitung',
        'Board-, Pool- und User-Refresh über Realtime-Service',
        'Systemuser für automatische Aufgaben',
      ],
    },
    {
      eyebrow: 'Realtime & Async',
      title: 'Live-UI ohne Polling-Spam',
      text: 'Echtzeitfunktionen laufen über Daphne, Django Channels und Redis. Zeitintensive Arbeiten wie Document-Share-Previews oder wiederkehrende Projects-Aufgaben werden an Celery ausgelagert, damit UI-Requests schnell bleiben.',
      points: [
        'WebSocket-Gruppen für Presence, DM, Import und Boards',
        'Redis als Channel Layer, Cache und Worker-Baustein',
        'Celery Beat für Fälligkeiten und Recurrences',
        'Preview-Generierung getrennt vom UI-Request',
      ],
    },
    {
      eyebrow: 'Document Share & Suche',
      title: 'Dokumente mit Vorschau, Typen, Rechten und Suchindex',
      text: 'Document Share verwaltet Kategorien, Tags, Medientypen, Favoriten, Recents und Vorschauen. Der Suchindex trennt Volltext von strukturierten Tokens, damit Dateinamen, Titel und nummerische Bereiche gezielter gefunden werden können.',
      points: [
        'Strukturierte Tokens für Exact-/Range-Suche',
        'Gecachte PDF-Vorschauen pro Dokument',
        'Kategorie-Rechte und User-Prefs',
        'Zentraler Storage-Service für lokale Mounts und Dateizugriffe',
      ],
    },
    {
      eyebrow: 'Ops',
      title: 'System Health als internes Kontrollzentrum',
      text: 'Das Backend enthält Health-Services für Datenbank, Redis, Cache, Channels, Systemd und Journal-Logs. Damit wird das Intranet nicht nur entwickelt, sondern im Betrieb beobachtbar gemacht.',
      points: [
        'DB-Ping und Tabellen-/Lock-Ansichten',
        'Redis- und Cache-Checks',
        'Systemd-Service-Status',
        'Journal-/Log-Auswertung ohne Secrets',
      ],
    },
  ],
  architecture: [
    {
      id: 'frontends',
      label: 'Angular Frontends',
      icon: 'deployed_code',
      role: 'Presentation Layer',
      text: 'Mehrere eigenständige Angular-Oberflächen bleiben fachlich getrennt. Shared Auth, shared-nav, shared-toast und Bug-Reporting sind zentral in jedem Frontend eingebunden; Guards, Interceptors und Designsystem folgen denselben globalen Konventionen.',
      connections: [
        'shared-nav · global',
        'shared-toast · global',
        'bug-reporter · global',
        'Django REST API',
        'Django Channels',
      ],
    },
    {
      id: 'auth',
      label: 'Auth & Rights',
      icon: 'admin_panel_settings',
      role: 'Access Control',
      text: 'Login, JWT-/Refresh-Flow, CSRF und AppPermission/UserAppPermission bilden den Zugriffskern. Registrierungen starten geschützt als pending; Freigabe und Developer-Zone bleiben explizit privilegiert.',
      connections: ['Accounts App', 'Rights Definitions', 'Shared Nav Guards'],
    },
    {
      id: 'api',
      label: 'Django API',
      icon: 'hub',
      role: 'Business Layer',
      text: 'Die API kapselt Serializer, Views, Permissions und Services für Produktion, Projects, Document Share, Reklamationen, Direct Messages und Ops-Funktionen.',
      connections: ['PostgreSQL', 'Redis', 'Celery', 'Channels'],
    },
    {
      id: 'database',
      label: 'PostgreSQL Models',
      icon: 'database',
      role: 'Persistence Layer',
      text: 'Relationale Modelle halten Nutzer, Rechte, Produktionsaufträge, Import-Konflikte, Task-Sync-Links, Dokumente, Notifications, Kommentare und Audit-/Health-Daten nachvollziehbar zusammen.',
      connections: ['OrderImportConflict', 'Task Sync Links', 'Document Search Tokens'],
    },
    {
      id: 'realtime',
      label: 'Channels / Redis',
      icon: 'stream',
      role: 'Realtime Layer',
      text: 'WebSocket-Endpunkte über Daphne und Django Channels übertragen News, App-Updates, Auth-Session-Status, Presence, Direct Messages, Produktionsimport-Events und Projects-Board-Refreshs.',
      connections: ['Redis Channel Layer', 'Angular Clients', 'Realtime Services'],
    },
    {
      id: 'workers',
      label: 'Celery Jobs',
      icon: 'settings_suggest',
      role: 'Async Layer',
      text: 'Celery und Celery Beat verarbeiten wiederkehrende Projects-Aufgaben und Document-Share-Preview-Jobs außerhalb des Request-Zyklus. Dadurch bleiben Uploads, Boards und Dokumentansichten reaktionsfähig.',
      connections: ['Redis Broker', 'Document Share Preview', 'Projects Recurrence'],
    },
    {
      id: 'ops',
      label: 'System Health',
      icon: 'monitor_heart',
      role: 'Observability',
      text: 'Ops-Services prüfen DB, Redis, Cache, Channels, Systemd und Logs. Der Bereich ist bewusst geschützt und liefert Betriebsfeedback ohne Secrets offenzulegen.',
      connections: ['DB Health Views', 'Service Health Views', 'Journal Service'],
    },
  ],
  capabilities: {
    eyebrow: 'extended_capabilities.index',
    title: 'Weitere Funktionen im Systemverbund',
    text: 'Die sichtbaren Oberflächen zeigen nur einen Teil der Plattform. Zentrale Services, Automatisierungen und Fachlogik arbeiten bewusst im Hintergrund.',
    items: [
      {
        label: 'Platform Core',
        title: 'Shared Services & Identity',
        text: 'Navigation, Auth, Toast und Bug-Reporter laufen als zentrale Libraries. App-Nachrichten werden global aggregiert; die Developer-Zone bündelt User, Rechte, Tools und Architektur-Doku. Registrierung über den Login ist zusätzlich passwortgeschützt, startet pending und benötigt aktive Freigabe.',
      },
      {
        label: 'Document Share',
        title: 'Storage, Rechte & Suche',
        text: 'Gemounteter lokaler Storage mit Tags, Kategorien, nutzerbezogenen Kategorie-Rechten, Passwortschutz, Favoriten, Recents und Medientyp-Whitelist. Preview, Direktöffnung, App-Tour und eine regex-nahe Search-DSL ergänzen den Workflow.',
      },
      {
        label: 'Production Planning',
        title: 'Autonomer Import & Steuerung',
        text: 'Ein Service scannt alle fünf Minuten definierte lokale Pfade und importiert XLSX-Dateien über Keyword- und Ausschlussregeln. Reimports werden als Edge, Update oder New klassifiziert; nur Edge blockiert bis zur Prüfung. Produktiv-/Historik-Sicht, Statusflags, Positionsbearbeitung, Mengenaggregation, Vorplanung und Deadlines steuern die Produktion.',
      },
      {
        label: 'Projects',
        title: 'Workflows & Collaboration',
        text: 'Kanban, KPI-/Prio-/Auslastungsdashboard und ein persönliches Dashboard mit dynamischer Neu-Spalte und Sortierregeln ergänzen Recurring Tasks, Inbox, Direct Messages und Chat. Der Pool verteilt freie Aufgaben und übernimmt synchronisierte Produktionsaufträge; Systemprojekte besitzen eigene Rechte.',
      },
      {
        label: 'Operations',
        title: 'Health & Maintenance',
        text: 'System Health überwacht Services, Datenbank, Redis, Worker und Logs. Ein globaler Maintenance Mode versetzt den Systemverbund zentral in Wartung und beendet aktive Sessions kontrolliert.',
      },
      {
        label: 'Quality Management',
        title: 'Reklamationen & Produktanalyse',
        text: 'Reklamationen führen manuelle Auftragshistorien, Medien und abteilungsübergreifende Prüfungen inklusive Produkt-/Problemstatistik. Die chemiespezifische Produktanalyse bildet mehrstufige Kurz-/Langzeittests, Erinnerungen, Problemerkennung, Radarprofile und Mehrartikelvergleiche ab.',
      },
    ],
  },
};
