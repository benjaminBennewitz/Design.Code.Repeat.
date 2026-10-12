/* src/app/core/data/reference-case-projects.ts */
import type { PortfolioLanguage } from '../models/reference-common.models';
import type { PortfolioProject } from '../models/reference-project.models';
import { INTRANET_DE_PROJECT } from './reference-projects/intranet.de';
import { DESIGN_ARCHIVE_DE_PROJECT } from './reference-projects/design-archive.de';
import { INTRANET_EN_PROJECT } from './reference-projects/intranet.en';
import { DESIGN_ARCHIVE_EN_PROJECT } from './reference-projects/design-archive.en';

/**
 * Lokale DCR-Case-Studies; der bestehende öffentliche Importpfad bleibt erhalten.
 */
export const REFERENCE_CASE_PROJECTS: Record<PortfolioLanguage, readonly PortfolioProject[]> = {
  de: [INTRANET_DE_PROJECT, DESIGN_ARCHIVE_DE_PROJECT],
  en: [INTRANET_EN_PROJECT, DESIGN_ARCHIVE_EN_PROJECT],
};
