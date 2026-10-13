/* src/app/pages/service-detail-page/managed/managed-service.models.ts */

import { SeoPageContent } from '../../../core/models/studio.models';

/** Eigenständiger Informationsblock der betreuten Leistungen. */
export interface ManagedInfo {
  readonly title: string;
  readonly text: string;
}

/** Eigene Kundeninformationen und FAQs einer Leistungsdetailseite. */
export interface ManagedServiceContent {
  readonly seo?: SeoPageContent;
  readonly hooks: readonly ManagedInfo[];
  readonly technicalTitle?: string;
  readonly technical?: readonly ManagedInfo[];
  readonly carePlanTitle?: string;
  readonly carePlanNote?: string;
  readonly back: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly introduction: string;
  readonly promise: string;
  readonly promiseText: string;
  readonly location?: string;
  readonly priceLabel: string;
  readonly priceNote: string;
  readonly availabilityLabel: string;
  readonly availability: string;
  readonly availabilityNote: string;
  readonly priceFactors: readonly string[];
  readonly offerLabel: string;
  readonly offerText: string;
  readonly benefitsTitle: string;
  readonly benefits: readonly ManagedInfo[];
  readonly scopeTitle: string;
  readonly includedTitle: string;
  readonly processTitle: string;
  readonly steps: readonly ManagedInfo[];
  readonly faqTitle: string;
  readonly faqs: readonly ManagedInfo[];
  readonly nextTitle: string;
  readonly nextText: string;
  readonly linksTitle: string;
  readonly links: readonly { readonly route: string; readonly title: string; readonly text: string }[];
}
