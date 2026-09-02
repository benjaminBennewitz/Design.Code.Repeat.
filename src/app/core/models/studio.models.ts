/**
 * @file Zentrale Typen der Studio-Website.
 * @description Hält Content-, Navigations-, Service-, Referenz- und Formularmodelle bewusst unabhängig von Komponenten.
 */

/** Unterstützte Sprachen. */
export type StudioLanguage = 'de' | 'en';

/** Unterstützte Themes. */
export type StudioTheme = 'dark' | 'light';

/** Farbakzent eines visuellen Content-Blocks. */
export type AccentTone = 'primary' | 'lime' | 'pink' | 'violet' | 'orange';

/** Einzelner Navigationslink. */
export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

/** SEO-Daten einer Seite. */
export interface SeoPageContent {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

/** Wiederverwendbare Section-Überschrift. */
export interface SectionHeadingContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly text?: string;
}

/** Leistungsdefinition für Übersicht und Detailseite. */
export interface StudioService {
  readonly slug: string;
  readonly icon: string;
  readonly accent: AccentTone;
  readonly title: string;
  readonly shortTitle: string;
  readonly kicker: string;
  readonly summary: string;
  readonly description: string;
  readonly price: string;
  readonly command: string;
  readonly outcomes: readonly string[];
  readonly features: readonly string[];
  readonly includes: readonly string[];
  readonly ctaLabel: string;
}

/** Einstiegspaket aus der ehemaligen Portfolio-Leistungsroute. */
export interface OfferCard {
  readonly title: string;
  readonly price: string;
  readonly claim: string;
  readonly description: string;
  readonly command: string;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  readonly featured?: boolean;
  readonly badge?: string;
}

/** Wartungs-/Betreuungsmodell. */
export interface CarePlan {
  readonly name: string;
  readonly price: string;
  readonly text: string;
  readonly features: readonly string[];
}

/** Veröffentlichtes Kundenprojekt ohne Case-Study-Tiefe. */
export interface DeliveredProject {
  readonly name: string;
  readonly url: string;
  readonly label: string;
  readonly stack: readonly string[];
  /** Optionaler lokaler Screenshot für die horizontale Kundenprojekt-Galerie. */
  readonly image?: string;
  /** Alternativtext des Screenshots; fällt bei rein dekorativem Placeholder leer aus. */
  readonly imageAlt?: string;
}

/** Technische Case Study der Studio-Website. */
export interface StudioReference {
  readonly slug: string;
  readonly name: string;
  readonly type: string;
  readonly year: string;
  readonly accent: AccentTone;
  readonly summary: string;
  readonly stack: readonly string[];
  /** Zusätzliche Kernpunkte für breitere Referenzkarten. */
  readonly details?: readonly string[];
  readonly image?: string;
  readonly imageAlt?: string;
  /** Optionaler projektspezifischer Hinweis für den Deep-Dive-Link. */
  readonly linkHint?: string;
  /** Optionales projektspezifisches CTA-Label für den Link. */
  readonly ctaLabel?: string;
  /** Interne Route, falls die Referenz direkt in der Studio-Seite vertieft wird. */
  readonly internalRoute?: string;
  /** Externer Portfolio-Link für Live-Demos oder tiefergehende Case Studies. */
  readonly portfolioUrl: string;
}

/** Prozessschritt. */
export interface ProcessStep {
  readonly index: string;
  readonly title: string;
  readonly text: string;
  readonly command: string;
}

/** FAQ-Eintrag. */
export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/** Technischer Kontaktgrund. */
export type ContactTopic =
  | 'website'
  | 'software'
  | 'design'
  | 'maintenance'
  | 'hosting'
  | 'other';

/** Option für das Kontaktformular. */
export interface ContactTopicOption {
  readonly value: ContactTopic;
  readonly label: string;
}

/** Vollständiger sprachabhängiger Website-Content. */
export interface StudioContent {
  readonly meta: {
    readonly hiddenTitle: string;
    readonly siteName: string;
  };
  readonly navigation: {
    readonly ariaLabel: string;
    readonly menuLabel: string;
    readonly closeLabel: string;
    readonly themeLabel: string;
    readonly languageLabel: string;
    readonly ctaLabel: string;
    readonly items: readonly NavigationItem[];
  };
  readonly home: {
    readonly seo: SeoPageContent;
    readonly hero: {
      readonly eyebrow: string;
      readonly title: string;
      readonly lead: string;
      readonly primaryCta: string;
      readonly secondaryCta: string;
      readonly status: readonly string[];
      readonly proof: readonly { readonly value: string; readonly label: string }[];
    };
    readonly services: SectionHeadingContent;
    readonly hosting: SectionHeadingContent & {
      readonly points: readonly string[];
      readonly emailTitle: string;
      readonly emailText: string;
      readonly cta: string;
    };
    readonly references: SectionHeadingContent;
    readonly process: SectionHeadingContent;
    readonly faq: SectionHeadingContent;
    readonly contact: SectionHeadingContent;
  };
  readonly servicesPage: {
    readonly seo: SeoPageContent;
    readonly hero: SectionHeadingContent & {
      readonly primaryCta: string;
      readonly note: string;
    };
    readonly offersHeading: SectionHeadingContent;
    readonly qualityBaseline: string;
    readonly offerNote: string;
    readonly careHeading: SectionHeadingContent;
    readonly hostingHeading: SectionHeadingContent;
  };
  readonly referencesPage: {
    readonly seo: SeoPageContent;
    readonly heading: SectionHeadingContent;
    readonly portfolioHint: string;
    readonly cta: string;
    readonly deliveredHeading: SectionHeadingContent;
    readonly deliveredCta: string;
    readonly deliveredAriaLabel: string;
  };
  readonly studioPage: {
    readonly seo: SeoPageContent;
    readonly heading: SectionHeadingContent;
    readonly intro: readonly string[];
    readonly vita: {
      readonly eyebrow: string;
      readonly title: string;
      readonly text: string;
      readonly facts: readonly string[];
    };
    readonly principlesHeading: SectionHeadingContent;
    readonly principles: readonly { readonly title: string; readonly text: string }[];
    readonly stackHeading: SectionHeadingContent;
    readonly stack: readonly string[];
  };
  readonly contactPage: {
    readonly seo: SeoPageContent;
    readonly heading: SectionHeadingContent;
    readonly directTitle: string;
    readonly directText: string;
    readonly emailLabel: string;
    readonly email: string;
  };
  readonly contactForm: {
    readonly nameLabel: string;
    readonly emailLabel: string;
    readonly companyLabel: string;
    readonly topicLabel: string;
    readonly messageLabel: string;
    readonly privacyLabel: string;
    readonly submitLabel: string;
    readonly sendingLabel: string;
    readonly requiredHint: string;
    readonly privacyTextBefore: string;
    readonly privacyLinkLabel: string;
    readonly privacyTextAfter: string;
    readonly privacyAriaLabel: string;
    readonly topics: readonly ContactTopicOption[];
    readonly errors: {
      readonly required: string;
      readonly nameLength: string;
      readonly email: string;
      readonly companyLength: string;
      readonly messageLength: string;
      readonly messageMaxLength: string;
      readonly privacy: string;
      readonly validation: string;
      readonly csrf: string;
      readonly payloadTooLarge: string;
      readonly rateLimit: string;
      readonly unavailable: string;
      readonly network: string;
      readonly server: string;
      readonly tooFast: string;
    };
  };
  readonly legal: {
    readonly noticeSeo: SeoPageContent;
    readonly privacySeo: SeoPageContent;
    readonly noticeTitle: string;
    readonly noticeSections: readonly { readonly title: string; readonly lines: readonly string[] }[];
    readonly privacyTitle: string;
    readonly privacySections: readonly { readonly title: string; readonly paragraphs: readonly string[] }[];
  };
  readonly footer: {
    readonly tagline: string;
    readonly servicesTitle: string;
    readonly companyTitle: string;
    readonly legalTitle: string;
    readonly signature: string;
  };
  readonly notFound: {
    readonly title: string;
    readonly text: string;
    readonly cta: string;
  };
  readonly thankYou: {
    readonly title: string;
    readonly text: string;
    readonly cta: string;
  };
  readonly services: readonly StudioService[];
  readonly offers: readonly OfferCard[];
  readonly carePlans: readonly CarePlan[];
  readonly references: readonly StudioReference[];
  readonly deliveredProjects: readonly DeliveredProject[];
  readonly process: readonly ProcessStep[];
  readonly faq: readonly FaqItem[];
}
