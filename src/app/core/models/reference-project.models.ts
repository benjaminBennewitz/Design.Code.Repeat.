/* src/app/core/models/reference-project.models.ts */
import type { HighlightItem } from './reference-common.models';
import type { ProjectBoardShowcase, ProjectBloodShowcase } from './reference-showcase.models';
import type { ProjectCatalogShowcase, ProjectGalleryItem } from './reference-catalog.models';

/** Inhalt der Projektübersicht. */
export interface ProjectsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  /** Ergänzende Einleitungstexte vor dem Projekt-Stack. */
  readonly introText: readonly string[];
  /** Beschriftung des Rücklinks von der Portfolio-Seite zur Experience. */
  readonly homeBackLabel: string;
  /** Titel des dekorativen Projekt-Terminalfensters. */
  readonly dialogTitle: string;
  /** ARIA-Label zum Schließen des Projekt-Terminalfensters. */
  readonly dialogCloseLabel: string;
  /** Zeilen im dekorativen Projekt-Terminalfenster. */
  readonly dialogLines: readonly string[];
  readonly detailLabel: string;
  /** Hinweis für vorübergehend deaktivierte Case-Studies. */
  readonly projectComingSoonLabel: string;
  readonly overviewLabel: string;
  readonly typeLabel: string;
  readonly yearLabel: string;
  readonly stackLabel: string;
  readonly descriptionLabel: string;
  readonly goalLabel: string;
  readonly roleLabel: string;
  readonly highlightsEyebrow: string;
  readonly highlightsTitle: string;
  readonly metaAriaLabel: string;
  readonly techStackAriaLabel: string;
  readonly previewAriaLabel: string;
  readonly trashPaperLabel: string;
  readonly typewriterLabel: string;
  /** Zugängliche Beschriftung für das interaktive Auge. */
  readonly eyeButtonLabel: string;
  /** Zugängliche Beschriftung für die interaktive Bombe. */
  readonly bombButtonLabel: string;
  /** Zugängliche Beschriftung für die Blutanalyse-Interaktion. */
  readonly bloodButtonLabel: string;
  /** Zugängliche Beschriftung für kompakte Projektkennzahlen. */
  readonly metricsLabel: string;
  /** Überschrift für Case-Study- und Deep-Dive-Bereiche. */
  readonly caseStudyLabel: string;
  /** Überschrift für Architekturkarten und Systemübersichten. */
  readonly architectureLabel: string;
  /** Kurzer Hinweis zur Architekturkarte und zu technischen Diagrammen. */
  readonly architectureHint: string;
  /** Überschrift für Demo- und Prototypbereiche. */
  readonly liveDemoLabel: string;
  /** Überschrift für Screenshot- und Mockup-Galerien. */
  readonly galleryLabel: string;
  /** Beschriftung für das zusätzliche Bild unter dem Projekt-Terminal. */
  readonly imageLabel: string;
  /** Alternativtext für das zusätzliche Bild unter dem Projekt-Terminal. */
  readonly imageAlt: string;
  /** Buttontext zum Wechseln des zusätzlichen Projektbildes. */
  readonly imageActionLabel: string;
  /** Buttontext nach dem Wechsel des zusätzlichen Projektbildes. */
  readonly imageActionActiveLabel: string;
  /** Beschriftung für einen externen Live-Demo-Link. */
  readonly openDemoLabel: string;
  /** Hinweis, wenn eine Live-Demo bewusst noch nicht öffentlich ist. */
  readonly demoUnavailableLabel: string;
  /** Überschrift für Erkenntnisse und technische Learnings. */
  readonly insightsLabel: string;
  /** Überschrift für ausgelagerte technische Umsetzungskapitel. */
  readonly detailLayerLabel: string;
  /** Kleine Beschriftung für die App-Landschaft auf Detailseiten. */
  readonly appLandscapeLabel: string;
  /** Überschrift für die App-Landschaft auf Detailseiten. */
  readonly appLandscapeTitle: string;
  /** Beschriftung für eine Demo-Anfrage. */
  readonly demoRequestLabel: string;
  /** Beschriftung für den externen GitHub-Link eines Projekts. */
  readonly githubLabel: string;
  /** Zugängliches Label zum Vergrößern oder Prüfen eines Evidence-Screens. */
  readonly zoomLabel: string;
  /** Zugängliches Label zum Schließen der gemeinsamen Projekt-Lightbox. */
  readonly lightboxCloseLabel: string;
  /** Zugängliches Label für das vorherige Bild der gemeinsamen Projekt-Lightbox. */
  readonly lightboxPreviousLabel: string;
  /** Zugängliches Label für das nächste Bild der gemeinsamen Projekt-Lightbox. */
  readonly lightboxNextLabel: string;
}

/** Layout-Variante für projektspezifische Detailmodule. */
export type ProjectDetailMode = 'case-study' | 'demo' | 'productivity' | 'data' | 'editorial';

/** Unterstützte Diagrammvarianten der Arcade-Tech-Telemetrie. */
export type TelemetryChartVariant = 'radial' | 'area' | 'step';

/** Einzelner numerischer Datenpunkt für wiederverwendbare SVG-Charts. */
export interface TelemetryChartDataPoint {
  /** Kurze Achsen- oder Legendenbeschriftung. */
  readonly label: string;
  /** Numerischer Mess- oder Indexwert. */
  readonly value: number;
}

/** Konfiguration eines einzelnen Telemetrie-Charts. */
export interface ProjectTelemetryChart {
  /** Stabile ID für SVG-IDs und Tracking. */
  readonly id: string;
  /** Kleine technische Beschriftung. */
  readonly eyebrow: string;
  /** Sichtbarer Chart-Titel. */
  readonly title: string;
  /** Kurze Einordnung der Datenquelle oder Skala. */
  readonly description: string;
  /** Chart-Typ innerhalb des gemeinsamen Visualisierungssystems. */
  readonly variant: TelemetryChartVariant;
  /** Numerische Datenpunkte. */
  readonly data: readonly TelemetryChartDataPoint[];
  /** Optionales Suffix für Messwerte. */
  readonly valueSuffix?: string;
  /** Optional fest definierter Maximalwert der Skala. */
  readonly maxValue?: number;
}

/** Vollbild-Telemetrie einer Projekt-Detailseite. */
export interface ProjectTelemetryContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly statusLabel: string;
  readonly statusValue: string;
  readonly source: string;
  readonly kpiAriaLabel: string;
  readonly charts: readonly ProjectTelemetryChart[];
}

/** Kleine Projektkennzahl für Detailseiten. */
export interface ProjectMetric {
  /** Kompakter Wert oder Status der Kennzahl. */
  readonly value: string;
  /** Beschriftung der Kennzahl. */
  readonly label: string;
  /** Ergänzende Kurzinfo zur Kennzahl. */
  readonly text: string;
}

/** Inhaltlicher Abschnitt für Case Study, Workflow oder Projektanalyse. */
export interface ProjectDetailChapter {
  /** Kleine Kategorie oder technische Einordnung. */
  readonly eyebrow: string;
  /** Überschrift des Abschnitts. */
  readonly title: string;
  /** Beschreibungstext des Abschnitts. */
  readonly text: string;
  /** Kurze Punkte, die den Abschnitt scannbar machen. */
  readonly points: readonly string[];
}

/** Interaktiver Knoten einer Architekturkarte. */
export interface ProjectArchitectureNode {
  /** Stabile ID für Auswahlzustand und Tastaturbedienung. */
  readonly id: string;
  /** Sichtbarer Name des Architekturbausteins. */
  readonly label: string;
  /** Material-Symbol des Knotens. */
  readonly icon: string;
  /** Kurze technische Rolle des Knotens. */
  readonly role: string;
  /** Beschreibung des Knotens. */
  readonly text: string;
  /** Verbundene Knoten als sichtbare Systembeziehungen. */
  readonly connections: readonly string[];
}

/** Einzelne Zeile des listenbasierten Projekt-Feature-Index. */
export interface ProjectCapabilityItem {
  /** Kurze fachliche oder technische Kategorie der Fähigkeit. */
  readonly label: string;
  /** Prägnanter Titel der Fähigkeit. */
  readonly title: string;
  /** Kompakte technische Beschreibung ohne Wiederholung der Modulkarte. */
  readonly text: string;
}

/** Listenbasierter Feature-Index für zusätzliche Projektfähigkeiten. */
export interface ProjectCapabilityIndex {
  /** Kleine technische Kennung oberhalb der Section. */
  readonly eyebrow: string;
  /** Überschrift des Feature-Index. */
  readonly title: string;
  /** Kurze Einordnung, warum die Liste ergänzend zur sichtbaren UI existiert. */
  readonly text: string;
  /** Kompakte, scanbare Fähigkeiten des Systems. */
  readonly items: readonly ProjectCapabilityItem[];
}

/** Interaktive App-Karte innerhalb einer Projekt-Detailseite. */
export interface ProjectAppModule {
  /** Stabile ID für Hover-, Fokus- und Auswahlzustände. */
  readonly id: string;
  /** Sichtbarer App- oder Modulname. */
  readonly title: string;
  /** Kurze fachliche Beschreibung des Moduls. */
  readonly text: string;
  /** Material-Symbol für die App-Karte. */
  readonly icon: string;
  /** Optionaler Status oder Badge der Karte. */
  readonly badge?: string;
  /** Zustand des Moduls im Portfolio-Kontext. */
  readonly status?: 'live' | 'private' | 'soon';
}

/** Kleines schließbares Terminal- oder MS-DOS-Fenster auf Detailseiten. */
export interface ProjectTerminalWidget {
  /** Stabile ID für Sichtbarkeitszustände. */
  readonly id: string;
  /** Fenstertitel im MS-DOS-Stil. */
  readonly title: string;
  /** Kurze Terminalzeilen im Fenster. */
  readonly lines: readonly string[];
  /** Visuelle Position im Hero. */
  readonly position: 'status' | 'events' | 'auth' | 'queue';
}

/** Optionaler Live-Demo-Hinweis oder externer Demo-Link. */
export interface ProjectLiveDemo {
  /** Aktueller Status der Demo. */
  readonly status: 'planned' | 'private' | 'available';
  /** Kurzer erklärender Text zur Demo. */
  readonly text: string;
  /** Optionaler externer Link zur Demo. */
  readonly url?: string;
  /** Optionaler externer Link zum zugehörigen GitHub-Repository. */
  readonly githubUrl?: string;
}

/** Detaildaten eines Portfolio-Projekts. */
export interface PortfolioProject {
  readonly slug: string;
  readonly name: string;
  /** Öffentlicher Status der Case-Study in der Projektübersicht. */
  readonly availability?: 'available' | 'coming-soon';
  /** Optionale Zeilen für eine bewusst gesetzte Hero-Headline. */
  readonly titleLines?: readonly string[];
  readonly kicker: string;
  readonly summary: string;
  /** Optionaler Kurz-Kicker für Projektübersichten, wenn Detailseiten ausführlicher formuliert sind. */
  readonly overviewKicker?: string;
  /** Optionaler Kurztext für Projektübersichten, ohne die Detailseite inhaltlich zu verkürzen. */
  readonly overviewSummary?: string;
  /** Optionaler kompakter Techstack für Projektübersichten und Projektkarten. */
  readonly overviewTechStack?: readonly string[];
  readonly description: string;
  readonly goal: string;
  readonly role: string;
  readonly year: string;
  readonly type: string;
  readonly accent: 'lime' | 'pink' | 'violet' | 'blue' | 'orange';
  readonly techStack: readonly string[];
  readonly highlights: readonly string[];
  /** Optionaler Titel des technischen Terminalfensters auf der Detailseite. */
  readonly terminalTitle?: string;
  /** Optionale Terminalzeilen für Projektstatus, Architektur und technische Fakten. */
  readonly terminalLines?: readonly string[];
  /** Optionale technische Highlight-Karten für den oberen Detailbereich. */
  readonly technicalHighlights?: readonly HighlightItem[];
  /** Optionaler Board-Showcase für Kanban- und Gamification-Projekte. */
  readonly boardShowcase?: ProjectBoardShowcase;
  /** Optionaler Blood-Showcase für Dokumentenimport und Laborwert-Auswertung. */
  readonly bloodShowcase?: ProjectBloodShowcase;
  /** Optionaler Designkatalog-Showcase für grafische Editorial-Projekte. */
  readonly catalogShowcase?: ProjectCatalogShowcase;
  /** Optionaler Stapel aus Produkt- und App-Karten im Hero. */
  readonly appModules?: readonly ProjectAppModule[];
  /** Optionale schließbare Terminalfenster im Hero. */
  readonly terminalWidgets?: readonly ProjectTerminalWidget[];
  /** Projektindividuelle Darstellungsvariante der Detailseite. */
  readonly detailMode: ProjectDetailMode;
  /** Kompakte Projektkennzahlen für den oberen Detailbereich. */
  readonly metrics: readonly ProjectMetric[];
  /** Vollflächiges KPI- und Chart-Dashboard der Projektseite. */
  readonly telemetry?: ProjectTelemetryContent;
  /** Tiefere Inhaltsabschnitte für Projektstory, Workflow oder Learnings. */
  readonly chapters: readonly ProjectDetailChapter[];
  /** Optionale Architekturkarte für komplexe Systemprojekte. */
  readonly architecture?: readonly ProjectArchitectureNode[];
  /** Optionaler listenbasierter Index zusätzlicher Projektfähigkeiten. */
  readonly capabilities?: ProjectCapabilityIndex;
  /** Screenshot-, Mockup- oder Platzhalter-Galerie. */
  readonly gallery: readonly ProjectGalleryItem[];
  /** Optionaler Live-Demo-Status oder externer Demo-Link. */
  readonly liveDemo?: ProjectLiveDemo;
  readonly requirements: readonly string[];
}
