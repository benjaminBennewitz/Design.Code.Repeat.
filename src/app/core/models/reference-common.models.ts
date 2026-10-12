/* src/app/core/models/reference-common.models.ts */

/**
 * @file Gemeinsame Sprach-, Theme-, SEO- und Einstiegstypen der Referenzseiten.
 */

/** Verfügbare Sprachen der Portfolio-Oberfläche. */
export type PortfolioLanguage = 'de' | 'en';

/** Verfügbare Theme-Varianten. */
export type PortfolioTheme = 'dark' | 'light';

/** Grundlegende SEO-Daten einer Seite. */
export interface SeoContent {
  /** Titel der aktuellen Seite. */
  readonly title: string;
  /** Meta-Description der aktuellen Seite. */
  readonly description: string;
  /** Suchbegriffe für Meta- und JSON-LD-Daten. */
  readonly keywords: string;
  /** Alternativtext für das Social-Preview-Bild. */
  readonly imageAlt: string;
  /** Titel, der bei inaktivem Browser-Tab angezeigt wird. */
  readonly hiddenTitle: string;
}

/** Navigations- und Bedienlabels. */
export interface NavigationContent {
  readonly home: string;
  readonly about: string;
  readonly skills: string;
  readonly projects: string;
  /** Navigationslabel für die ausgelagerte Portfolio-Route. */
  readonly portfolio: string;
  readonly snippets: string;
  readonly process: string;
  readonly faq: string;
  readonly contact: string;
  readonly menu: string;
  readonly close: string;
  readonly theme: string;
  readonly language: string;
  /** Zugängliches Label für den Markenlink. */
  readonly brandLabel: string;
  /** Zugängliches Label für den Achievement-Link. */
  readonly achievementLabel: string;
  /** Zugängliches Label für den schnellen Kontaktlink. */
  readonly contactAccessLabel: string;
}

/** Textblock für die Hero-Section. */
export interface HeroContent {
  readonly eyebrow: string;
  readonly title: string;
  /** Prägnanter Hero-Hook für die persönliche Portfolio-Positionierung. */
  readonly hook: string;
  readonly subtitle: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly consoleLines: readonly string[];
  readonly dialogLabel: string;
  /** Übersetzter Text des interaktiven Mixed-Reactions-Dialogs. */
  readonly dialogText: string;
  readonly statusLabel: string;
  /** Übersetzte Systemstatus-Zeilen im Hero. */
  readonly statusItems: readonly HeroStatusItem[];
  readonly stats: readonly StatItem[];
}

/** Einzelne übersetzbare Zeile im Hero-Systemstatus. */
export interface HeroStatusItem {
  readonly label: string;
  readonly value: string;
}

/** Kurzer Kennzahlenblock. */
export interface StatItem {
  readonly value: string;
  readonly label: string;
}

/** Kurzer Highlight-Eintrag. */
export interface HighlightItem {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}
