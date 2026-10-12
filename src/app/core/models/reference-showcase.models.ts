/* src/app/core/models/reference-showcase.models.ts */
import type { ProjectMetric } from './reference-project.models';

/** Einzelne schwebende To-do-Karte im Hero eines Projektmanagement-Projekts. */
export interface ProjectBoardHeroTask {
  /** Sichtbarer Aufgabenname. */
  readonly title: string;
  /** Auf maximal etwa 100 Zeichen gekürzte Aufgabenbeschreibung. */
  readonly excerpt: string;
  /** Initialen der verantwortlichen Person. */
  readonly ownerInitials: string;
  /** Lokalisiertes Fälligkeitsdatum. */
  readonly dueDate: string;
  /** Maschinenlesbares Fälligkeitsdatum für das Time-Element. */
  readonly dueDateIso: string;
  /** Anzahl der angehängten Dateien. */
  readonly attachmentCount: number;
  /** Anzahl der Kommentare. */
  readonly commentCount: number;
  /** Gibt an, ob eine Automatisierungsregel aktiv ist. */
  readonly hasRule: boolean;
}

/** Lokalisierte Beschriftungen für Metadaten der Hero-Aufgabenkarten. */
export interface ProjectBoardHeroTaskLabels {
  /** Statuslabel der Karte. */
  readonly todo: string;
  /** Beschriftung der verantwortlichen Person. */
  readonly owner: string;
  /** Beschriftung des Fälligkeitsdatums. */
  readonly dueDate: string;
  /** Beschriftung der Anhänge. */
  readonly attachments: string;
  /** Beschriftung der Kommentare. */
  readonly comments: string;
  /** Beschriftung der Automatisierungsregel. */
  readonly rule: string;
}

/** Kleine Karte für Workflow-, UX- oder Gamification-Schwerpunkte. */
export interface ProjectBoardWorkflowCard {
  /** Material-Symbol der Schwerpunktkarte. */
  readonly icon: string;
  /** Titel des Schwerpunkts. */
  readonly title: string;
  /** Kurzer erklärender Text. */
  readonly text: string;
  /** Scannbare Detailpunkte. */
  readonly points: readonly string[];
}

/** Kompakter UX-Grundsatz der Maskottchen-Section. */
export interface ProjectBoardMascotPrinciple {
  /** Kurzer Titel des UX-Grundsatzes. */
  readonly title: string;
  /** Erklärender Text zum Grundsatz. */
  readonly text: string;
}

/** Story-Beat oder Lore-Karte zum Maskottchen. */
export interface ProjectBoardMascotStoryBeat {
  /** Kurzes Label für die Timeline oder Karte. */
  readonly label: string;
  /** Überschrift des Story-Beats. */
  readonly title: string;
  /** Erklärender Text. */
  readonly text: string;
}

/** Profil des Maskottchens einer Projektmanagement-App. */
export interface ProjectBoardMascotProfile {
  /** Kleine Beschriftung über dem Profil. */
  readonly eyebrow: string;
  /** Überschrift der Profil-Section. */
  readonly title: string;
  /** Name des Maskottchens. */
  readonly name: string;
  /** Rolle des Maskottchens im Produkt. */
  readonly role: string;
  /** Story- und UX-Text zum Maskottchen. */
  readonly text: string;
  /** Optionaler Bildpfad für ein echtes Maskottchen-Asset. */
  readonly asset?: string;
  /** Alternativtext für das Maskottchen-Asset. */
  readonly assetAlt: string;
  /** Geplanter Dateipfad, wenn das Asset später ergänzt wird. */
  readonly assetHint: string;
  /** Optionales Story-/Szenenbild als atmosphärischer Kontext. */
  readonly previewImage?: string;
  /** Alternativtext für das Story-/Szenenbild. */
  readonly previewAlt?: string;
  /** Kurze Bildlegende für das Story-/Szenenbild. */
  readonly previewCaption?: string;
  /** Kompakte UX-Grundsätze zur Rolle des Maskottchens. */
  readonly principles?: readonly ProjectBoardMascotPrinciple[];
  /** Verdichtete Story-Beats aus der internen Lore. */
  readonly storyBeats?: readonly ProjectBoardMascotStoryBeat[];
  /** Kompakte Fakten zur Maskottchen-Funktion. */
  readonly facts: readonly ProjectMetric[];
}

/** Projektspezifischer Showcase für Kanban-, Board- und Gamification-Projekte. */
export interface ProjectBoardShowcase {
  /** Kleine technische Beschriftung im Hero-Showcase. */
  readonly eyebrow: string;
  /** Titel des Board-Frames. */
  readonly title: string;
  /** Kurzer Status- oder Produkt-Hinweis im Board-Frame. */
  readonly status: string;
  /** Erklärender Text zum Board-Showcase. */
  readonly lead: string;
  /** Beschriftung des primären Hero-Links. */
  readonly ctaLabel: string;
  /** Kleine technische oder fachliche Tags im Showcase. */
  readonly chips: readonly string[];
  /** Zugängliche Beschriftung des Board-Containers. */
  readonly boardLabel: string;
  /** Lokalisierte Beschriftungen der Aufgabenmetadaten. */
  readonly heroTaskLabels: ProjectBoardHeroTaskLabels;
  /** Fünf schwebende Beispielaufgaben im Hero. */
  readonly heroTasks: readonly ProjectBoardHeroTask[];
  /** Eyebrow für die Workflow-Section. */
  readonly workflowEyebrow: string;
  /** Überschrift für die Workflow-Section. */
  readonly workflowTitle: string;
  /** Workflow-, UX- und Gamification-Karten. */
  readonly workflowCards: readonly ProjectBoardWorkflowCard[];
  /** Maskottchen-Profil des Projektmanagement-Systems. */
  readonly mascot: ProjectBoardMascotProfile;
  /** Eyebrow für die Galerie. */
  readonly galleryEyebrow: string;
  /** Überschrift für die Galerie. */
  readonly galleryTitle: string;
}

/** Beispielwert im Blutanalyse-Hero und im Werte-Guide. */
export interface ProjectBloodValuePreview {
  /** Abkürzung oder Laborwert-Name. */
  readonly label: string;
  /** Beispielwert oder verdichteter Status. */
  readonly value: string;
  /** Einheit oder Kontext des Laborwerts. */
  readonly unit: string;
  /** Referenz- oder Orientierungsbereich als UI-Text. */
  readonly range: string;
  /** Prozentuale Position auf einer visuellen Referenzskala. */
  readonly position: number;
  /** Zustand für visuelle Einordnung und Hilfetext. */
  readonly tone: 'low' | 'normal' | 'high' | 'watch';
  /** Benutzernahe Erklärung oder Hinweis zum Wert. */
  readonly hint: string;
}

/** Schritt im Dokumenten- und Datenfluss der Blutanalyse. */
export interface ProjectBloodPipelineStep {
  /** Material-Symbol des Prozessschritts. */
  readonly icon: string;
  /** Kurzer Titel des Prozessschritts. */
  readonly title: string;
  /** Benutzernahe Beschreibung des Prozessschritts. */
  readonly text: string;
  /** Technische oder fachliche Detailpunkte. */
  readonly points: readonly string[];
}

/** Darstellungsmodus im Werte-Guide der Daten-Dashboard-Seite. */
export type ProjectBloodGuideModeKey = 'scale' | 'bar' | 'chart';

/** Umschaltbarer Diagrammstil im Werte-Guide. */
export interface ProjectBloodGuideMode {
  /** Stabile ID für Zustand und CSS-Variante. */
  readonly key: ProjectBloodGuideModeKey;
  /** Sichtbares Label des Diagrammstils. */
  readonly label: string;
  /** Kurze Zusatzbeschreibung des Diagrammstils. */
  readonly description: string;
  /** Material-Symbol für den Modusbutton. */
  readonly icon: string;
}

/** Inhalt für Import-, Analyse- und Hilfesystem einer Blutanalyse-Detailseite. */
export interface ProjectBloodShowcase {
  /** Kleine technische Beschriftung im Hero-Showcase. */
  readonly eyebrow: string;
  /** Titel des Analyse-Frames. */
  readonly title: string;
  /** Kurzer Status- oder Modulhinweis. */
  readonly status: string;
  /** Erklärender Text zum Analyse-Showcase. */
  readonly lead: string;
  /** Beschriftung des primären Hero-Links. */
  readonly ctaLabel: string;
  /** Kleine technische oder fachliche Tags im Showcase. */
  readonly chips: readonly string[];
  /** Titel des Dokumentenbereichs im Hero. */
  readonly documentTitle: string;
  /** Hilfetext des Dokumentenbereichs im Hero. */
  readonly documentText: string;
  /** Titel der großen Hero-Datengrafik. */
  readonly heroChartTitle: string;
  /** Hilfetext der großen Hero-Datengrafik. */
  readonly heroChartText: string;
  /** Zugängliche Beschriftung des Analyse-Containers. */
  readonly previewLabel: string;
  /** Beispielwerte für Vorschau und Werte-Guide. */
  readonly values: readonly ProjectBloodValuePreview[];
  /** Eyebrow für den Datenfluss. */
  readonly pipelineEyebrow: string;
  /** Überschrift für den Datenfluss. */
  readonly pipelineTitle: string;
  /** Schritte vom Dokument zur Auswertung. */
  readonly pipelineSteps: readonly ProjectBloodPipelineStep[];
  /** Eyebrow für den Werte-Guide. */
  readonly guideEyebrow: string;
  /** Überschrift für den Werte-Guide. */
  readonly guideTitle: string;
  /** Zugängliche Beschriftung der Diagrammstil-Umschaltung. */
  readonly guideModeLabel: string;
  /** Sichtbare Diagrammstile für den Werte-Guide. */
  readonly guideModes: readonly ProjectBloodGuideMode[];
  /** Optionaler Hinweis zu geplanten, aber noch nicht umgesetzten Visualisierungsfunktionen. */
  readonly roadmapNote?: string;
  /** Hinweis, dass die Oberfläche Erklärung statt Diagnose liefert. */
  readonly disclaimer: string;
  /** Eyebrow für die Galerie. */
  readonly galleryEyebrow: string;
  /** Überschrift für die Galerie. */
  readonly galleryTitle: string;
}
