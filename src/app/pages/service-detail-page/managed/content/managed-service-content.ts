/* src/app/pages/service-detail-page/managed/content/managed-service-content.ts */
import { WEB_DE } from './web.de';
import { WEB_EN } from './web.en';
import { SOFTWARE_DE } from './software.de';
import { SOFTWARE_EN } from './software.en';
import { DESIGN_DE } from './design.de';
import { DESIGN_EN } from './design.en';
import { CARE_DE } from './care.de';
import { CARE_EN } from './care.en';
import { ManagedServiceContent } from '../managed-service.models';
import { EMAIL_DE } from './email.de';
import { EMAIL_EN } from './email.en';
import { HOSTING_DE } from './hosting.de';
import { HOSTING_EN } from './hosting.en';

const CONTENT: Readonly<Record<'de' | 'en', Readonly<Record<string, ManagedServiceContent>>>> = {
  de: { 'managed-hosting': HOSTING_DE, email: EMAIL_DE, webentwicklung: WEB_DE, softwareentwicklung: SOFTWARE_DE, 'ui-ux-design': DESIGN_DE, wartung: CARE_DE },
  en: { 'managed-hosting': HOSTING_EN, email: EMAIL_EN, webentwicklung: WEB_EN, softwareentwicklung: SOFTWARE_EN, 'ui-ux-design': DESIGN_EN, wartung: CARE_EN },
}; // Eigene Kundeninformationen für alle sechs Leistungsdetailseiten.

/**
 * Liefert die eigenen Kundeninformationen und FAQs zur ausgewählten Leistung.
 * @param language Aktive Sprache der Website.
 * @param slug Kennung der ausgewählten Leistung.
 */
export function managedServiceContent(language: 'de' | 'en', slug: string): ManagedServiceContent | undefined {
  return CONTENT[language][slug];
}
