/* src/app/core/data/reference-projects/intranet/telemetry.de.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Deutsche Intranet-Inhalte für Diagramminhalte.
 */
export const INTRANET_TELEMETRY_DE: Pick<PortfolioProject, 'telemetry'> = {
  telemetry: {
    eyebrow: 'platform_telemetry.exe',
    title: 'Ein System. Viele operative Ebenen.',
    subtitle: '',
    statusLabel: 'Platform',
    statusValue: 'MODULAR / LIVE',
    source: 'Source: documented modules',
    kpiAriaLabel: 'Intranet-Projektkennzahlen',
    charts: [
      {
        id: 'scope',
        eyebrow: 'building_blocks.radial',
        title: 'Dokumentierte Bausteine',
        description: 'Anzahl konkret benannter Bausteine pro Bereich. Der Ring zeigt damit Umfang, nicht Qualität.',
        variant: 'radial',
        maxValue: 7,
        data: [
          { label: 'Apps', value: 7 },
          { label: 'Backend-Domains', value: 6 },
          { label: 'Realtime-Flows', value: 6 },
          { label: 'Job-Familien', value: 2 },
          { label: 'Ops-Checks', value: 6 },
        ],
      },
      {
        id: 'flow',
        eyebrow: 'runtime_depth.area',
        title: 'Runtime Path Depth',
        description:
          'Anzahl beteiligter Architektur-Layer bei typischen Vorgängen. Beispiel Projects-Sync: UI → API → DB → Redis/Channels → Celery → UI.',
        variant: 'area',
        maxValue: 7,
        valueSuffix: ' Layer',
        data: [
          { label: 'Login', value: 4 },
          { label: 'Produktion', value: 5 },
          { label: 'Projects', value: 6 },
          { label: 'Doc Share', value: 6 },
          { label: 'Health', value: 5 },
        ],
      },
      {
        id: 'layers',
        eyebrow: 'async_chain.step',
        title: 'Async Processing Chain',
        description:
          'Keine Bewertung: Die Höhe entspricht der Reihenfolge im Ablauf – vom fachlichen Event bis zur Rückmeldung ins Frontend.',
        variant: 'step',
        maxValue: 6,
        valueSuffix: ' / 6',
        data: [
          { label: 'Event', value: 1 },
          { label: 'API', value: 2 },
          { label: 'Queue', value: 3 },
          { label: 'Worker', value: 4 },
          { label: 'Persist', value: 5 },
          { label: 'Realtime', value: 6 },
        ],
      },
    ],
  },
};
