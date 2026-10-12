/* src/app/core/data/reference-projects/intranet/system.en.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Englische Intranet-Inhalte für Systemarchitektur und Fähigkeiten.
 */
export const INTRANET_SYSTEM_EN: Pick<PortfolioProject, 'chapters' | 'architecture' | 'capabilities'> = {
  chapters: [
    {
      eyebrow: 'Auth & Rights',
      title: 'Central login with domain permission matrix',
      text: 'The platform uses a shared login base, JWT/refresh flow, CSRF endpoint and a permission core built from apps, permission codes and user assignments. An interface can be visible without automatically allowing every action.',
      points: [
        'JWT cookie flow with refresh and logout',
        'AppPermission/UserAppPermission as database model',
        'Developer-only areas for system health',
        'Route and action permissions separated',
      ],
    },
    {
      eyebrow: 'Production',
      title: 'XLSX import as stable data sync, not table copy',
      text: 'The production area handles AU files, positions, shipping, archive, partial quantities and status logic. The non-destructive reimport is critical: removed or shifted XLSX rows must not silently destroy existing database slots.',
      points: [
        'OrderFile with import hash and timestamp',
        'OrderPosition with soft removal and fingerprint',
        'OrderImportConflict with stable conflict_signature',
        'Mutation log and blocking for open conflicts',
      ],
    },
    {
      eyebrow: 'Projects Sync',
      title: 'Production states become task workflows',
      text: 'Projects receives production context through sync links and outbox models. Tasks, subtasks, comments, attachments, notifications and pool logic are created or updated from domain state.',
      points: [
        'ProductionOrderTaskSyncLink as coupling',
        'Outbox/Celery handoff for robust processing',
        'Board, pool and user refresh through realtime service',
        'System user for automated tasks',
      ],
    },
    {
      eyebrow: 'Realtime & Async',
      title: 'Live UI without polling noise',
      text: 'Realtime features run through Daphne, Django Channels and Redis. Expensive work such as Document Share previews or recurring Projects tasks is moved to Celery so UI requests remain fast.',
      points: [
        'WebSocket groups for presence, DM, import and boards',
        'Redis as channel layer, cache and worker building block',
        'Celery Beat for due dates and recurrences',
        'Preview generation separated from UI requests',
      ],
    },
    {
      eyebrow: 'Document Share & Search',
      title: 'Documents with previews, types, rights and search index',
      text: 'Document Share manages categories, tags, media types, favorites, recents and previews. The search index separates full text from structured tokens so filenames, titles and numeric ranges can be found more precisely.',
      points: [
        'Structured tokens for exact/range search',
        'Cached PDF previews per document',
        'Category permissions and user preferences',
        'Central storage service for local mounts and file access',
      ],
    },
    {
      eyebrow: 'Ops',
      title: 'System Health as internal control center',
      text: 'The backend contains health services for database, Redis, cache, Channels, systemd and journal logs. This makes the intranet observable in operation, not just during development.',
      points: [
        'DB ping and table/lock views',
        'Redis and cache checks',
        'Systemd service status',
        'Journal/log evaluation without secrets',
      ],
    },
  ],
  architecture: [
    {
      id: 'frontends',
      label: 'Angular Frontends',
      icon: 'deployed_code',
      role: 'Presentation Layer',
      text: 'Multiple standalone Angular interfaces stay separated by domain. Shared auth, shared-nav, shared-toast and bug reporting are central components included in every frontend; guards, interceptors and the design system follow the same global conventions.',
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
      text: 'Login, JWT/refresh flow, CSRF and AppPermission/UserAppPermission form the access core. Registrations start protected as pending; approval and the developer zone remain explicitly privileged.',
      connections: ['Accounts App', 'Rights Definitions', 'Shared Nav Guards'],
    },
    {
      id: 'api',
      label: 'Django API',
      icon: 'hub',
      role: 'Business Layer',
      text: 'The API encapsulates serializers, views, permissions and services for production, Projects, Document Share, complaints, direct messages and ops features.',
      connections: ['PostgreSQL', 'Redis', 'Celery', 'Channels'],
    },
    {
      id: 'database',
      label: 'PostgreSQL Models',
      icon: 'database',
      role: 'Persistence Layer',
      text: 'Relational models connect users, permissions, production orders, import conflicts, task sync links, documents, notifications, comments and audit/health data.',
      connections: ['OrderImportConflict', 'Task Sync Links', 'Document Search Tokens'],
    },
    {
      id: 'realtime',
      label: 'Channels / Redis',
      icon: 'stream',
      role: 'Realtime Layer',
      text: 'WebSocket endpoints through Daphne and Django Channels transfer news, app updates, auth-session state, presence, direct messages, production import events and Projects board refreshes.',
      connections: ['Redis Channel Layer', 'Angular Clients', 'Realtime Services'],
    },
    {
      id: 'workers',
      label: 'Celery Jobs',
      icon: 'settings_suggest',
      role: 'Async Layer',
      text: 'Celery and Celery Beat process recurring Projects tasks and Document Share preview jobs outside the request cycle so uploads, boards and document views stay responsive.',
      connections: ['Redis Broker', 'Document Share Preview', 'Projects Recurrence'],
    },
    {
      id: 'ops',
      label: 'System Health',
      icon: 'monitor_heart',
      role: 'Observability',
      text: 'Ops services check DB, Redis, cache, Channels, systemd and logs. The area is intentionally protected and exposes operational feedback without leaking secrets.',
      connections: ['DB Health Views', 'Service Health Views', 'Journal Service'],
    },
  ],
  capabilities: {
    eyebrow: 'extended_capabilities.index',
    title: 'Additional capabilities across the platform',
    text: 'The visible interfaces show only part of the platform. Shared services, automations and domain logic intentionally operate in the background.',
    items: [
      {
        label: 'Platform Core',
        title: 'Shared Services & Identity',
        text: 'Navigation, auth, toast and bug reporting run as central libraries. App messages are aggregated globally; the developer zone bundles users, permissions, tools and architecture docs. Registration from login is additionally password-protected, starts pending and requires explicit approval.',
      },
      {
        label: 'Document Share',
        title: 'Storage, Permissions & Search',
        text: 'Mounted local storage with tags, categories, user-specific category permissions, password protection, favorites, recents and a media-type allowlist. Preview, direct opening, app tour and a regex-like search DSL complete the workflow.',
      },
      {
        label: 'Production Planning',
        title: 'Autonomous Import & Control',
        text: 'A service scans defined local paths every five minutes and imports XLSX files through keyword and exclusion rules. Reimports are classified as Edge, Update or New; only Edge blocks for review. Live/history views, status flags, position editing, quantity aggregation, preplanning and deadlines drive production.',
      },
      {
        label: 'Projects',
        title: 'Workflows & Collaboration',
        text: 'Kanban, KPI/priority/workload dashboards and a personal dashboard with a dynamic New column and sorting rules complement recurring tasks, inbox, direct messages and chat. The pool distributes open tasks and receives synced production work; system projects have dedicated permissions.',
      },
      {
        label: 'Operations',
        title: 'Health & Maintenance',
        text: 'System Health monitors services, database, Redis, workers and logs. A global maintenance mode puts the platform into maintenance centrally and terminates active sessions in a controlled way.',
      },
      {
        label: 'Quality Management',
        title: 'Complaints & Product Analysis',
        text: 'Complaints maintain manual order histories, media and cross-department reviews including product/issue statistics. Chemistry-specific product analysis covers multi-stage short/long-term tests, reminders, issue detection, radar profiles and multi-product comparison.',
      },
    ],
  },
};
