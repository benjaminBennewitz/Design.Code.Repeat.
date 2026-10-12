/* src/app/core/models/reference-case.models.ts */
import type { SeoContent, NavigationContent, HeroContent } from './reference-common.models';
import type {
  AboutContent,
  ExperienceContent,
  SkillsContent,
  CapabilityShowcaseContent,
} from './reference-profile.models';
import type { ProjectsContent, PortfolioProject } from './reference-project.models';
import type {
  ProcessContent,
  CtaContent,
  FaqItem,
  ClientsContent,
  BuiltWithoutContent,
  ContactContent,
  ThankYouContent,
  NotFoundPageContent,
  ImprintContent,
  FooterContent,
} from './reference-site.models';

export type * from './reference-common.models';
export type * from './reference-profile.models';
export type * from './reference-project.models';
export type * from './reference-catalog.models';
export type * from './reference-showcase.models';
export type * from './reference-site.models';

/** Vollständiger übersetzter Inhalt einer Sprache. */
export interface PortfolioContent {
  readonly meta: SeoContent;
  readonly nav: NavigationContent;
  readonly hero: HeroContent;
  readonly about: AboutContent;
  readonly experience: ExperienceContent;
  readonly skills: SkillsContent;
  /** Kompaktes Kompetenzprofil als Brücke zwischen Stack und Case Studies. */
  readonly capabilities: CapabilityShowcaseContent;
  readonly projectsIntro: ProjectsContent;
  readonly projects: readonly PortfolioProject[];
  readonly process: ProcessContent;
  readonly cta: CtaContent;
  readonly faqTitle: string;
  readonly faqSubtitle: string;
  readonly faqs: readonly FaqItem[];
  readonly clients: ClientsContent;
  /** Schmale Qualitäts-Section mit bewussten technischen Entscheidungen. */
  readonly builtWithout: BuiltWithoutContent;
  readonly contact: ContactContent;
  /** Inhalte der Dankeseite. */
  readonly thankYou: ThankYouContent;
  /** Inhalte der eigenständigen 404-Seite. */
  readonly notFoundPage: NotFoundPageContent;
  /** Inhalte der Impressumsseite. */
  readonly imprint: ImprintContent;
  readonly footer: FooterContent;
  readonly notFoundTitle: string;
  readonly notFoundText: string;
}

/** Portfolio-Inhalte ohne die umfangreichen, lazy geladenen Case-Study-Daten. */
export type PortfolioBaseContent = Omit<PortfolioContent, 'projects'>;
