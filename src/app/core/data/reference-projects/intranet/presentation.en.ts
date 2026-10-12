/* src/app/core/data/reference-projects/intranet/presentation.en.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Englische Intranet-Inhalte für Hero und Terminaldarstellung.
 */
export const INTRANET_PRESENTATION_EN: Pick<
  PortfolioProject,
  'technicalHighlights' | 'appModules' | 'terminalWidgets' | 'terminalTitle' | 'terminalLines'
> = {
  technicalHighlights: [
    {
      icon: 'account_tree',
      title: 'Modular architecture',
      text: 'Separate Angular frontends share auth, navigation, toast and bug reporting as central libraries while domain apps remain independently extensible.',
    },
    {
      icon: 'admin_panel_settings',
      title: 'Roles & permissions',
      text: 'AppPermission, UserAppPermission, the developer zone and a pending→active user lifecycle separate visibility, domain actions and approval.',
    },
    {
      icon: 'sensors',
      title: 'Realtime communication',
      text: 'Daphne, Django Channels and Redis connect presence, direct messages, production imports and Projects boards without polling noise.',
    },
    {
      icon: 'bolt',
      title: 'Async processing',
      text: 'Celery, Celery Beat and dedicated worker queues handle Document Share previews, recurring Projects tasks and long-running jobs outside the request cycle.',
    },
  ],
  appModules: [
    {
      id: 'document-share',
      title: 'Document Share',
      text: 'Mounted document storage with categories, its own permission core, previews and specialized search logic.',
      icon: 'menu_book',
      badge: 'Live',
      status: 'live',
    },
    {
      id: 'production',
      title: 'Production planning',
      text: 'Largely autonomous XLSX sync with conflict classification, order control, quantity aggregation and production planning.',
      icon: 'factory',
      badge: 'Core',
      status: 'live',
    },
    {
      id: 'projects',
      title: 'Projects',
      text: 'Kanban, personal workflows, recurring tasks, messaging, pool logic and production sync within one permission context.',
      icon: 'hub',
      badge: 'Sync',
      status: 'live',
    },
    {
      id: 'health',
      title: 'System Health',
      text: 'Protected developer app for services, database, Redis, workers, logs and the global maintenance mode.',
      icon: 'database',
      badge: 'Ops',
      status: 'private',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      text: 'Customer and company container stocks as a structured overview for operational control.',
      icon: 'fact_check',
      badge: 'Soon',
      status: 'soon',
    },
    {
      id: 'complaints',
      title: 'Complaints',
      text: 'Order-linked complaint histories with media, cross-department review and statistical evaluation.',
      icon: 'crisis_alert',
      badge: 'Live',
      status: 'live',
    },
    {
      id: 'analysis',
      title: 'Product analytics',
      text: 'Multi-stage quality analysis with short/long-term tests, reminders, radar profiles and multi-product comparison.',
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
        '[14:02:12] group=production.import',
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
    'apps=login|production|projects|document_share|complaints|rights|system_health',
    'auth=jwt_cookie + csrf_endpoint + refresh_flow + auth_session_ws',
    'realtime=daphne/channels:news,apps,presence,dm,production_import,projects_board',
    'async=celery/beat:document_share_preview + projects_due_recurrences',
    'data=postgresql models with import_conflicts, task_sync_links, permissions',
    'ops=system_health checks:db,redis,cache,channels,systemd,journal',
    'rule=visibility follows app rights, role checks and domain permissions',
  ],
};
