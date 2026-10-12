/* src/app/core/data/reference-projects/intranet/telemetry.en.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Englische Intranet-Inhalte für Diagramminhalte.
 */
export const INTRANET_TELEMETRY_EN: Pick<PortfolioProject, 'telemetry'> = {
  telemetry: {
    eyebrow: 'platform_telemetry.exe',
    title: 'One system. Many operational layers.',
    subtitle: '',
    statusLabel: 'Platform',
    statusValue: 'MODULAR / LIVE',
    source: 'Source: documented modules',
    kpiAriaLabel: 'Intranet project metrics',
    charts: [
      {
        id: 'scope',
        eyebrow: 'building_blocks.radial',
        title: 'Documented Building Blocks',
        description: 'Count of concrete building blocks named per area. Ring size represents scope, not quality.',
        variant: 'radial',
        maxValue: 7,
        data: [
          { label: 'Apps', value: 7 },
          { label: 'Backend domains', value: 6 },
          { label: 'Realtime flows', value: 6 },
          { label: 'Job families', value: 2 },
          { label: 'Ops checks', value: 6 },
        ],
      },
      {
        id: 'flow',
        eyebrow: 'runtime_depth.area',
        title: 'Runtime Path Depth',
        description:
          'Number of architecture layers involved in typical operations. Example Projects sync: UI → API → DB → Redis/Channels → Celery → UI.',
        variant: 'area',
        maxValue: 7,
        valueSuffix: ' layers',
        data: [
          { label: 'Login', value: 4 },
          { label: 'Production', value: 5 },
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
          'Not a rating: height represents the step number in the chain, from domain event to feedback in the frontend.',
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
