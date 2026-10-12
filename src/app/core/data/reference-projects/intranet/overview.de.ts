/* src/app/core/data/reference-projects/intranet/overview.de.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Deutsche Intranet-Inhalte für Projektüberblick und Kennzahlen.
 */
export const INTRANET_OVERVIEW_DE: Pick<
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
  kicker: 'Mehrere Apps. Ein Backend. Ein Rechtekern.',
  summary:
    'Aus vielen internen Arbeitsschritten wird ein zusammenhängendes System: verlässliche Oberflächen, klare Zuständigkeiten und technische Kontrolle, die im laufenden Betrieb nicht im Weg steht.',
  description:
    'Das Intranet ist kein einzelnes Dashboard, sondern ein gewachsener Systemverbund aus fachlich getrennten Apps. Login, Produktion, Projects, Document Share, Reklamationen, Rechteverwaltung, Direct Messages und System Health laufen über eine zentrale Django-API, gemeinsame Authentifizierung, rollenbasierte App-Rechte und Echtzeitkanäle über Django Channels.',
  goal: 'Ziel war eine wartbare Plattform, die operative Daten nicht nur anzeigt, sondern Prozesse abbildet: AU-/XLSX-Importe, Konfliktauflösung, Produktionsstatus, automatische Aufgaben, Dokumentenvorschauen, Benachrichtigungen, User-Lifecycle und technische Health-Checks sollten nachvollziehbar, erweiterbar und rechtebasiert zusammenspielen.',
  role: 'Full-Stack-Entwicklung von Architektur, Datenmodell, API, WebSocket-Flows, Rechtekonzept, UI-Struktur, Designsystem, Debugging und Deployment-Logik. Dazu gehören Angular-Komponenten, Django-Services, Serializer, Guards, Signals, Celery-Jobs, Redis-/Channels-Integration und operative Fehleranalyse.',
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
    'Rechtebasierte App-Shell',
    'Produktionsimport mit Konfliktmodell',
    'WebSocket-Flows für Live-Zustände',
    'Celery-Jobs für Previews und Recurrences',
    'System-Health für DB, Redis, Channels und Dienste',
  ],
  requirements: [
    'App-übergreifende Authentifizierung',
    'Feingranulare Rechte pro App und Funktion',
    'Nachvollziehbarer XLSX-/AU-Reimport',
    'Live-Updates ohne harte Reloads',
    'Asynchrone Jobs außerhalb des Request-Zyklus',
    'Monitoring für Datenbank, Redis, WebSockets und Worker',
  ],
  detailMode: 'case-study',
  metrics: [
    {
      value: '7',
      label: 'App-Module',
      text: 'Fachliche Apps und Ops-Werkzeuge greifen auf dieselbe Plattform und denselben Rechtekern zurück.',
    },
    {
      value: '18+',
      label: 'WS-Kanäle',
      text: 'News, Apps, Auth-Session, Presence, DMs, Produktion und Projects senden Live-Zustände.',
    },
    {
      value: '128+',
      label: 'Job-Flows',
      text: 'Preview-Jobs, Recurrences, Imports und Sync-Prozesse laufen außerhalb der UI-Anfrage.',
    },
    {
      value: '7',
      label: 'Rechte-Layer',
      text: 'Rolle, App, Route, Aktion, Objektbezug, Developer-Zone und Session-Zustand werden getrennt betrachtet.',
    },
    {
      value: '24/7',
      label: 'Ops-Sicht',
      text: 'System Health macht Datenbank, Redis, Channels, Worker, Logs und Dienste sichtbar.',
    },
    {
      value: '5',
      label: 'Sync-Pipelines',
      text: 'Produktion, Projects, Document Share, Direct Messages und Health-Daten werden fachlich gekoppelt.',
    },
    {
      value: '12K+',
      label: 'Import-Aktionen',
      text: 'AU-/XLSX-Daten, Hashes, Konflikte und Soft-Removal werden nachvollziehbar behandelt.',
    },
  ],
  liveDemo: {
    status: 'private',
    text: 'Eine öffentliche Demo würde den realen Betrieb nur unzureichend abbilden: Authentifizierung, Rechte, Automatisierungen, Worker, lokale Mounts und interne Dienste sind Teil des Systemverbunds. Die Case Study zeigt deshalb anonymisierte Screenshots und die technische Architektur; produktiver Unternehmenscode und interne Daten bleiben geschützt und nicht öffentlich.',
  },
};
