/* src/app/core/data/studio-content.ts */
import type { StudioContent, StudioLanguage } from '../models/studio.models';
import { DE_LAYOUT_CONTENT } from './studio-content/layout.de';
import { DE_HOME_CONTENT } from './studio-content/home.de';
import { DE_SERVICES_PAGE_CONTENT } from './studio-content/services-page.de';
import { DE_SERVICES_CONTENT } from './studio-content/services.de';
import { DE_OFFERS_CONTENT } from './studio-content/offers.de';
import { DE_REFERENCES_PAGE_CONTENT } from './studio-content/references-page.de';
import { DE_REFERENCES_CONTENT } from './studio-content/references.de';
import { DE_DELIVERED_PROJECTS_CONTENT } from './studio-content/delivered-projects.de';
import { DE_STUDIO_CONTENT } from './studio-content/studio.de';
import { DE_CONTACT_CONTENT } from './studio-content/contact.de';
import { DE_LEGAL_CONTENT } from './studio-content/legal.de';
import { DE_PROCESS_CONTENT } from './studio-content/process.de';
import { EN_LAYOUT_CONTENT } from './studio-content/layout.en';
import { EN_HOME_CONTENT } from './studio-content/home.en';
import { EN_SERVICES_PAGE_CONTENT } from './studio-content/services-page.en';
import { EN_SERVICES_CONTENT } from './studio-content/services.en';
import { EN_OFFERS_CONTENT } from './studio-content/offers.en';
import { EN_REFERENCES_PAGE_CONTENT } from './studio-content/references-page.en';
import { EN_REFERENCES_CONTENT } from './studio-content/references.en';
import { EN_DELIVERED_PROJECTS_CONTENT } from './studio-content/delivered-projects.en';
import { EN_STUDIO_CONTENT } from './studio-content/studio.en';
import { EN_CONTACT_CONTENT } from './studio-content/contact.en';
import { EN_LEGAL_CONTENT } from './studio-content/legal.en';
import { EN_PROCESS_CONTENT } from './studio-content/process.en';

/**
 * Vollständige Übersetzungen; Inhalte werden nach Verantwortung und Sprache gepflegt.
 */
export const STUDIO_TRANSLATIONS: Record<StudioLanguage, StudioContent> = {
  de: {
    ...DE_LAYOUT_CONTENT,
    ...DE_HOME_CONTENT,
    ...DE_SERVICES_PAGE_CONTENT,
    ...DE_SERVICES_CONTENT,
    ...DE_OFFERS_CONTENT,
    ...DE_REFERENCES_PAGE_CONTENT,
    ...DE_REFERENCES_CONTENT,
    ...DE_DELIVERED_PROJECTS_CONTENT,
    ...DE_STUDIO_CONTENT,
    ...DE_CONTACT_CONTENT,
    ...DE_LEGAL_CONTENT,
    ...DE_PROCESS_CONTENT,
  },
  en: {
    ...EN_LAYOUT_CONTENT,
    ...EN_HOME_CONTENT,
    ...EN_SERVICES_PAGE_CONTENT,
    ...EN_SERVICES_CONTENT,
    ...EN_OFFERS_CONTENT,
    ...EN_REFERENCES_PAGE_CONTENT,
    ...EN_REFERENCES_CONTENT,
    ...EN_DELIVERED_PROJECTS_CONTENT,
    ...EN_STUDIO_CONTENT,
    ...EN_CONTACT_CONTENT,
    ...EN_LEGAL_CONTENT,
    ...EN_PROCESS_CONTENT,
  },
};
