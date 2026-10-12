/* src/app/core/data/reference-projects/intranet/overview.en.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Englische Intranet-Inhalte für Projektüberblick und Kennzahlen.
 */
export const INTRANET_OVERVIEW_EN: Pick<
  PortfolioProject,
  | 'slug'
  | 'name'
  | 'kicker'
  | 'summary'
  | 'description'
  | 'goal'
  | 'role'
  | 'year'
  | 'type'
  | 'accent'
  | 'techStack'
  | 'highlights'
  | 'requirements'
  | 'detailMode'
  | 'metrics'
  | 'liveDemo'
> = {
  slug: 'intranet',
  name: 'Intranet',
  kicker: 'Multiple apps. One backend. One permission core.',
  summary:
    'Many internal workflows become one connected system: reliable interfaces, clear responsibilities and technical control that does not get in the way during daily operations.',
  description:
    'The intranet is not a single dashboard, but a growing system of domain-specific apps. Login, production, Projects, Document Share, complaints, rights management, direct messages and system health run through one Django API, shared authentication, role-based app permissions and realtime channels through Django Channels.',
  goal: 'The goal was a maintainable platform that does more than display operational data: AU/XLSX imports, conflict resolution, production status, automatic tasks, document previews, notifications, user lifecycle and technical health checks should work together in a traceable, extensible and permission-aware way.',
  role: 'Full-stack development across architecture, data model, API, WebSocket flows, permission concept, UI structure, design system, debugging and deployment logic. This includes Angular components, Django services, serializers, guards, signals, Celery jobs, Redis/Channels integration and operational troubleshooting.',
  year: '2025–2026',
  type: 'Intranet / Business Application',
  accent: 'blue',
  techStack: [
    'Angular',
    'TypeScript',
    'Django REST',
    'Django Channels',
    'Daphne',
    'PostgreSQL',
    'Redis',
    'Celery',
    'Celery Beat',
    'JWT / Refresh',
    'WebSockets',
    'Local Mounts / File Access',
    'SCSS',
  ],
  highlights: [
    'Permission-based app shell',
    'Production import with conflict model',
    'WebSocket flows for live state',
    'Celery jobs for previews and recurrences',
    'System health for DB, Redis, Channels and services',
  ],
  requirements: [
    'Cross-app authentication',
    'Fine-grained permissions per app and action',
    'Traceable XLSX/AU reimport',
    'Live updates without hard reloads',
    'Async jobs outside the request cycle',
    'Monitoring for database, Redis, WebSockets and workers',
  ],
  detailMode: 'case-study',
  metrics: [
    {
      value: '7',
      label: 'App modules',
      text: 'Domain apps and ops tools share the same platform foundation and permission core.',
    },
    {
      value: '18+',
      label: 'WS channels',
      text: 'News, apps, auth session, presence, DMs, production and Projects publish live state.',
    },
    {
      value: '128+',
      label: 'Job flows',
      text: 'Preview jobs, recurrences, imports and sync flows run outside the UI request.',
    },
    {
      value: '7',
      label: 'Permission layers',
      text: 'Role, app, route, action, object scope, developer zone and session state are handled separately.',
    },
    {
      value: '24/7',
      label: 'Ops view',
      text: 'System Health exposes database, Redis, Channels, workers, logs and service state.',
    },
    {
      value: '5',
      label: 'Sync pipelines',
      text: 'Production, Projects, Document Share, direct messages and health data are connected by domain logic.',
    },
    {
      value: '12K+',
      label: 'Import actions',
      text: 'AU/XLSX data, hashes, conflicts and soft-removal states are kept traceable.',
    },
  ],
  liveDemo: {
    status: 'private',
    text: 'A public demo would only approximate the real operating environment: authentication, permissions, automations, workers, local mounts and internal services are part of the wider system. The case study therefore uses anonymized screenshots and the technical architecture, while production company code and internal data remain protected and private.',
  },
};
