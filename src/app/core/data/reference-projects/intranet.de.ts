/* src/app/core/data/reference-projects/intranet.de.ts */
import type { PortfolioProject } from '../../models/reference-project.models';
import { INTRANET_OVERVIEW_DE } from './intranet/overview.de';
import { INTRANET_PRESENTATION_DE } from './intranet/presentation.de';
import { INTRANET_TELEMETRY_DE } from './intranet/telemetry.de';
import { INTRANET_SYSTEM_DE } from './intranet/system.de';
import { INTRANET_GALLERY_DE } from './intranet/gallery.de';

/**
 * Vollständige deutsche Intranet-Case-Study.
 */
export const INTRANET_DE_PROJECT: PortfolioProject = {
  ...INTRANET_OVERVIEW_DE,
  ...INTRANET_PRESENTATION_DE,
  ...INTRANET_TELEMETRY_DE,
  ...INTRANET_SYSTEM_DE,
  ...INTRANET_GALLERY_DE,
};
