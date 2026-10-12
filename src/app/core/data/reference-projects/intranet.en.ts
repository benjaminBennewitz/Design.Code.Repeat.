/* src/app/core/data/reference-projects/intranet.en.ts */
import type { PortfolioProject } from '../../models/reference-project.models';
import { INTRANET_OVERVIEW_EN } from './intranet/overview.en';
import { INTRANET_PRESENTATION_EN } from './intranet/presentation.en';
import { INTRANET_TELEMETRY_EN } from './intranet/telemetry.en';
import { INTRANET_SYSTEM_EN } from './intranet/system.en';
import { INTRANET_GALLERY_EN } from './intranet/gallery.en';

/**
 * Vollständige englische Intranet-Case-Study.
 */
export const INTRANET_EN_PROJECT: PortfolioProject = {
  ...INTRANET_OVERVIEW_EN,
  ...INTRANET_PRESENTATION_EN,
  ...INTRANET_TELEMETRY_EN,
  ...INTRANET_SYSTEM_EN,
  ...INTRANET_GALLERY_EN,
};
