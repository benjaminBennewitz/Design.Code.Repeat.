/* src/app/core/models/reference-profile.models.ts */
import type { HighlightItem } from './reference-common.models';

/** Inhalt der Über-mich-Section. */
export interface AboutContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: readonly string[];
  readonly highlights: readonly HighlightItem[];
  /** Interaktive Fun-Kennzahlen mit Einheitenwechsel. */
  readonly metrics: AboutMetricsContent;
  /** Zugängliche Beschriftung des About-Bildbereichs. */
  readonly imageLabel: string;
  /** Alternativtext für das About-Kaffeebild. */
  readonly imageAlt: string;
  /** Zugängliche Beschriftung des interaktiven About-Dialogs. */
  readonly dialogLabel: string;
  /** Text im interaktiven About-Dialog. */
  readonly dialogText: string;
  /** Beschriftung des Dialog-Aktionsbuttons. */
  readonly dialogAction: string;
  /** Beschriftung des Dialog-Aktionsbuttons nach dem ersten Klick. */
  readonly dialogActionAfterClick: string;
  /** Zugängliche Beschriftung des Dialog-Schließen-Buttons. */
  readonly dialogCloseLabel: string;
}

/** Inhalt des interaktiven Fun-Metrics-Fensters. */
export interface AboutMetricsContent {
  /** Beschriftung des Buttons zum Öffnen des Fensters. */
  readonly triggerLabel: string;
  /** Zugängliche Beschriftung des Dialogfensters. */
  readonly dialogLabel: string;
  /** Titel in der MS-DOS-Titelleiste. */
  readonly title: string;
  /** Zugängliche Beschriftung zum Schließen des Fensters. */
  readonly closeLabel: string;
  /** Beschriftung des normalen Einheitenmodus. */
  readonly metricLabel: string;
  /** Beschriftung des absurden Einheitenmodus. */
  readonly weirdLabel: string;
  /** Zugängliche Beschriftung der Modus-Umschaltung. */
  readonly unitSwitcherLabel: string;
  /** Kurzer Genauigkeitshinweis im Fenster. */
  readonly precisionText: string;
  /** Kleine Statuszeile im Fenster. */
  readonly statusText: string;
  /** Kennzahlen, die zwischen normal und absurd wechseln. */
  readonly facts: readonly AboutMetricFact[];
  /** Inhalte und Labels für den verzögerten Absurditäten-Rechner. */
  readonly calculator: AboutMetricsCalculatorContent;
}

/** Einzelne Kennzahl im Fun-Metrics-Fenster. */
/** Verfügbare Einheiten des Absurditäten-Rechners. */
export type AboutMetricsCalculatorUnitKey = 'miniSpringRoll' | 'wiener' | 'mentos' | 'gummyBear';

/** Inhalt des verzögerten Absurditäten-Rechners. */
export interface AboutMetricsCalculatorContent {
  /** Hauptzeile des seitlichen Teaser-Buttons. */
  readonly teaserTitle: string;
  /** Unterzeile des seitlichen Teaser-Buttons. */
  readonly teaserText: string;
  /** Zugängliche Beschriftung des Rechner-Dialogs. */
  readonly dialogLabel: string;
  /** Titel in der MS-DOS-Titelleiste. */
  readonly title: string;
  /** Kurzer Erklärungstext im Rechner. */
  readonly intro: string;
  /** Label für die Größeneingabe. */
  readonly heightLabel: string;
  /** Label für die Gewichtseingabe. */
  readonly weightLabel: string;
  /** Label für die Einheitenauswahl. */
  readonly unitLabel: string;
  /** Ergebnislabel für die Größe. */
  readonly heightResultLabel: string;
  /** Ergebnislabel für das Gewicht. */
  readonly weightResultLabel: string;
  /** Zugängliche Beschriftung zum Schließen des Rechners. */
  readonly closeLabel: string;
  /** Sichtbare Einheitennamen für die Auswahl. */
  readonly units: readonly AboutMetricsCalculatorUnitContent[];
}

/** Sichtbarer Einheitenname des Absurditäten-Rechners. */
export interface AboutMetricsCalculatorUnitContent {
  /** Stabile Einheit zur Verknüpfung mit den Rechenwerten. */
  readonly key: AboutMetricsCalculatorUnitKey;
  /** Voller sichtbarer Einheitenname. */
  readonly label: string;
  /** Kurzer Name für kompakte Ergebniszeilen. */
  readonly shortLabel: string;
}

export interface AboutMetricFact {
  /** Stabile ID für Tracking und Animation. */
  readonly id: string;
  /** Material-Symbol der Kennzahl. */
  readonly icon: string;
  /** Sichtbarer Name der Kennzahl. */
  readonly label: string;
  /** Normaler metrischer oder sachlicher Wert. */
  readonly metricValue: string;
  /** Einheit des normalen Werts. */
  readonly metricUnit: string;
  /** Kurzer Hinweis zum normalen Wert. */
  readonly metricNote: string;
  /** Absurder Alternativwert. */
  readonly weirdValue: string;
  /** Absurde Einheit oder leere Einheit bei Textwerten. */
  readonly weirdUnit: string;
  /** Kurzer Hinweis zum absurden Wert. */
  readonly weirdNote: string;
}

/** Inhalt des Erfahrungsbereichs. */
export interface ExperienceContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly ExperienceItem[];
}

/** Einzelner Erfahrungswert mit kurzer Einordnung. */
export interface ExperienceItem {
  readonly value: string;
  readonly suffix: string;
  readonly label: string;
  readonly text: string;
  readonly claim: string;
}

/** Inhalt des Skillbereichs. */
export interface SkillsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly groups: readonly SkillGroup[];
  readonly levelsTitle: string;
  readonly levelsSubtitle: string;
  /** Titel des kleinen Skill-Dialogfensters. */
  readonly levelsDialogTitle: string;
  /** Text des kleinen Skill-Dialogfensters. */
  readonly levelsDialogText: string;
  /** Zugängliche Beschriftung zum Schließen des Skill-Dialogfensters. */
  readonly levelsDialogCloseLabel: string;
  readonly levels: readonly SkillLevel[];
  readonly marquee: readonly string[];
}

/** Gruppe zusammengehöriger Skills. */
export interface SkillGroup {
  readonly title: string;
  readonly items: readonly string[];
}

/** Status eines Werkzeugs innerhalb des projektbasierten Einsatzprofils. */
export type SkillUsageStatus = 'CORE' | 'ACTIVE' | 'ROUTINE' | 'SPECIALIZED';

/** Projektbasierte Nutzungstiefe eines Tech-, Design- oder Automatisierungswerkzeugs. */
export interface SkillLevel {
  readonly label: string;
  /** Relative Nutzungstiefe ausschließlich für die visuelle Balkendarstellung. */
  readonly depth: number;
  /** Lesbarer Status anstelle einer pseudo-genauen Prozentbewertung. */
  readonly status: SkillUsageStatus;
  readonly group: string;
}

/** Inhalt des kompakten Kompetenzprofils auf der Startseite. */
export interface CapabilityShowcaseContent {
  /** Kleine technische Beschriftung oberhalb des Kompetenzprofils. */
  readonly eyebrow: string;
  /** Hauptaussage des kompakten Kompetenzprofils. */
  readonly title: string;
  /** Kurze Verbindung zwischen Techstack und Case Studies. */
  readonly subtitle: string;
  /** Beschriftung des Links zu den Case Studies. */
  readonly ctaLabel: string;
  /** Zugängliche Beschriftung der Kompetenzfelder. */
  readonly ariaLabel: string;
  /** Bewusst reduzierte Kompetenzfelder. */
  readonly items: readonly CapabilityShowcaseItem[];
}

/** Einzelnes Kompetenzfeld des Portfolio-Profils. */
export interface CapabilityShowcaseItem {
  /** Kurzes Systemlabel wie WEB, APP oder SYSTEM. */
  readonly label: string;
  /** Technisch-neutrale Kurzbeschreibung. */
  readonly text: string;
}

/** Inhalt der Angebots- und Preiskarten-Section. */
export interface PricingContent {
  /** SEO-Titel der eigenständigen Leistungsroute. */
  readonly metaTitle: string;
  /** SEO-Beschreibung der eigenständigen Leistungsroute. */
  readonly metaDescription: string;
  /** Kleine technische Beschriftung des Leistungs-Heros. */
  readonly eyebrow: string;
  /** Hauptüberschrift des Leistungs-Heros. */
  readonly title: string;
  /** Einleitung unter der Hero-Überschrift. */
  readonly subtitle: string;
  /** Primärer CTA zur Angebotsübersicht. */
  readonly heroPrimaryCtaLabel: string;
  /** Sekundärer CTA zum Kontaktbereich. */
  readonly heroSecondaryCtaLabel: string;
  /** Zugängliche Beschriftung des Scope-Dialog-Schließen-Buttons. */
  readonly heroDialogCloseLabel: string;
  /** Kleine Beschriftung oberhalb der Angebotsübersicht. */
  readonly offersEyebrow: string;
  /** Überschrift oberhalb der drei Angebotsstufen. */
  readonly offersTitle: string;
  /** Kurze Einleitung in die drei Angebotsstufen. */
  readonly offersSubtitle: string;
  /** Allgemeiner CTA unterhalb der Angebotsübersicht. */
  readonly offersCtaLabel: string;
  /** Hinweistext zu Einstiegspreisen und Aufwandsschätzung. */
  readonly note: string;
  /** Qualitätsstandard, der für jede Angebotskarte gilt. */
  readonly qualityBaseline: string;
  /** ARIA-Label der Angebotskartenliste. */
  readonly ariaLabel: string;
  /** Technisches Label des Maintenance-Bereichs. */
  readonly supportTitle: string;
  /** Aussagekräftige Überschrift des Maintenance-Bereichs. */
  readonly supportHeadline: string;
  /** Einleitungstext des Maintenance-Bereichs. */
  readonly supportText: string;
  /** CTA am Ende des Maintenance-Bereichs. */
  readonly supportCtaLabel: string;
  /** Technisches Label der abschließenden Kontakt-Section. */
  readonly outroEyebrow: string;
  /** Persönliche Abschlussüberschrift vor dem Footer. */
  readonly outroTitle: string;
  /** Kurzer persönlicher Abschluss- und Kontakttext. */
  readonly outroText: string;
  /** Primärer CTA der Abschluss-Section. */
  readonly outroPrimaryCtaLabel: string;
  /** Sekundärer CTA der Abschluss-Section. */
  readonly outroSecondaryCtaLabel: string;
  /** Kleine Terminal-Statuszeile der Abschluss-Section. */
  readonly outroStatus: string;
  /** Sichtbare Abo-Preise im Maintenance-Bereich. */
  readonly supportPlans: readonly PricingSupportPlan[];
  /** Sichtbare Angebotskarten. */
  readonly cards: readonly PricingCard[];
}

/** Einzelner monatlicher Support-Baustein. */
export interface PricingSupportPlan {
  /** Name des Support-Bausteins. */
  readonly name: string;
  /** Monatlicher Einstiegspreis des Support-Bausteins. */
  readonly price: string;
  /** Kurze Beschreibung des enthaltenen Supports. */
  readonly text: string;
}

/** Einzelne Angebots- oder Preiskarte. */
export interface PricingCard {
  /** Name des Angebots. */
  readonly title: string;
  /** Einstiegspreis als kompakte UI-Zeile. */
  readonly price: string;
  /** Kurzer Claim der Angebotsstufe. */
  readonly claim: string;
  /** Kurze Positionierung des Angebots. */
  readonly description: string;
  /** Kurzer Badge, zum Beispiel Empfehlung. */
  readonly badge?: string;
  /** Gibt an, ob die Karte visuell hervorgehoben wird. */
  readonly featured?: boolean;
  /** Kleine Terminal-Zeile als technischer Schnellscan. */
  readonly command: string;
  /** Enthaltene Leistungsbausteine. */
  readonly features: readonly string[];
  /** Buttontext der Karte. */
  readonly ctaLabel: string;
}
