/* src/app/core/data/reference-projects/intranet/presentation.de.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Deutsche Intranet-Inhalte für Hero und Terminaldarstellung.
 */
export const INTRANET_PRESENTATION_DE: Pick<
  PortfolioProject,
  'technicalHighlights' | 'appModules' | 'terminalWidgets' | 'terminalTitle' | 'terminalLines'
> = {
  technicalHighlights: [
    {
      icon: 'account_tree',
      title: 'Modulare Architektur',
      text: 'Getrennte Angular-Frontends teilen Auth, Navigation, Toast und Bug-Reporting als zentrale Libraries; die Fachdomänen bleiben unabhängig erweiterbar.',
    },
    {
      icon: 'admin_panel_settings',
      title: 'Rollen & Rechte',
      text: 'AppPermission, UserAppPermission, Developer-Zone und ein Pending→Active-User-Lifecycle trennen Sichtbarkeit, Fachaktion und Freigabe konsequent.',
    },
    {
      icon: 'sensors',
      title: 'Echtzeit-Kommunikation',
      text: 'Daphne, Django Channels und Redis verbinden Presence, Direct Messages, Produktionsimport und Projects-Boards ohne Polling-Flut.',
    },
    {
      icon: 'bolt',
      title: 'Asynchrone Verarbeitung',
      text: 'Celery, Celery Beat und getrennte Worker-Queues übernehmen Document-Share-Previews, wiederkehrende Projects-Aufgaben und langlaufende Jobs außerhalb des Request-Zyklus.',
    },
  ],
  appModules: [
    {
      id: 'document-share',
      title: 'Document Share',
      text: 'Gemounteter Dokument-Storage mit Kategorien, eigenem Rechtekern, Vorschauen und spezialisierter Suchlogik.',
      icon: 'menu_book',
      badge: 'Live',
      status: 'live',
    },
    {
      id: 'production',
      title: 'Produktionsplanung',
      text: 'Weitgehend autonomer XLSX-Sync mit Konfliktklassifizierung, Auftragssteuerung, Mengenaggregation und Produktionsplanung.',
      icon: 'factory',
      badge: 'Core',
      status: 'live',
    },
    {
      id: 'projects',
      title: 'Projects',
      text: 'Kanban, persönliche Workflows, Recurring Tasks, Messaging, Pool-Logik und Produktions-Sync in einem Rechtekontext.',
      icon: 'hub',
      badge: 'Sync',
      status: 'live',
    },
    {
      id: 'health',
      title: 'System Health',
      text: 'Geschützte Dev-App für Services, Datenbank, Redis, Worker, Logs und den globalen Maintenance Mode.',
      icon: 'database',
      badge: 'Ops',
      status: 'private',
    },
    {
      id: 'inventory',
      title: 'Inventur',
      text: 'Bestände, Kunden- und Firmengebinde als strukturierte Übersicht für operative Kontrolle.',
      icon: 'fact_check',
      badge: 'Demnächst',
      status: 'soon',
    },
    {
      id: 'complaints',
      title: 'Reklamationen',
      text: 'Auftragsbezogene Reklamationshistorien mit Medien, abteilungsübergreifender Prüfung und statistischer Auswertung.',
      icon: 'crisis_alert',
      badge: 'Live',
      status: 'live',
    },
    {
      id: 'analysis',
      title: 'Produktanalyse',
      text: 'Mehrstufige QM-Analysen mit Kurz-/Langzeittests, Erinnerungen, Radarprofilen und Mehrartikelvergleich.',
      icon: 'monitoring',
      badge: 'Lab',
      status: 'private',
    },
  ],
  terminalWidgets: [
    {
      id: 'status',
      title: 'system-status.bat',
      position: 'status',
      lines: ['SYSTEM STATUS', 'API latency: 38ms', 'DB connections: 32', 'Celery queue: healthy', 'Status: OK'],
    },
    {
      id: 'events',
      title: 'websocket.log',
      position: 'events',
      lines: [
        '[14:02:11] WS connected',
        '[14:02:12] group=produktion.import',
        '[14:02:13] event=progress.update',
        '[14:02:14] event=board.refresh',
      ],
    },
    {
      id: 'queue',
      title: 'queue-jobs.bat',
      position: 'queue',
      lines: [
        'document_share_preview=running',
        'projects_recurrence=scheduled',
        'failed_jobs=0',
        'worker=document_share_preview@host',
      ],
    },
  ],
  terminalTitle: 'intranet.deep_dive.exe',
  terminalLines: [
    'apps=login|produktion|projects|document_share|reklamation|rights|system_health',
    'auth=jwt_cookie + csrf_endpoint + refresh_flow + auth_session_ws',
    'realtime=daphne/channels:news,apps,presence,dm,produktion_import,projects_board',
    'async=celery/beat:document_share_preview + projects_due_recurrences',
    'data=postgresql models with import_conflicts, task_sync_links, permissions',
    'ops=system_health checks:db,redis,cache,channels,systemd,journal',
    'rule=visibility follows app rights, role checks and domain permissions',
  ],
};
