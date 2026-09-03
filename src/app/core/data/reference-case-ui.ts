/**
 * @file UI-Texte für die lokal gespiegelten DCR-Case-Studies.
 * @description Hält die aus B²Folio übernommenen Detailseiten-Labels zweisprachig und unabhängig vom Studio-Basiscontent.
 */

import { PortfolioLanguage } from '../models/reference-case.models';

interface ReferenceCaseUiContent {
  readonly projectsIntro: {
    readonly dialogCloseLabel: string;
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
    readonly metricsLabel: string;
    readonly caseStudyLabel: string;
    readonly architectureLabel: string;
    readonly architectureHint: string;
    readonly liveDemoLabel: string;
    readonly galleryLabel: string;
    readonly openDemoLabel: string;
    readonly insightsLabel: string;
    readonly detailLayerLabel: string;
    readonly githubLabel: string;
    readonly zoomLabel: string;
    readonly lightboxCloseLabel: string;
    readonly lightboxPreviousLabel: string;
    readonly lightboxNextLabel: string;
  };
  readonly notFoundTitle: string;
  readonly notFoundText: string;
}

export const REFERENCE_CASE_UI: Record<PortfolioLanguage, ReferenceCaseUiContent> = {
  de: {
    projectsIntro: {
      dialogCloseLabel: 'Projekt-Terminalfenster schließen',
      overviewLabel: 'Zu den Case Studies',
      typeLabel: 'Typ',
      yearLabel: 'Jahr',
      stackLabel: 'Stack',
      descriptionLabel: 'Beschreibung',
      goalLabel: 'Anforderungen / Zielsetzung',
      roleLabel: 'Rolle / Aufgaben',
      highlightsEyebrow: 'Highlights',
      highlightsTitle: 'In diesem Projekt',
      metaAriaLabel: 'Projektinformationen',
      techStackAriaLabel: 'Techstack des Projekts',
      previewAriaLabel: 'Weitere Projekte',
      metricsLabel: 'Projektkennzahlen',
      caseStudyLabel: 'Case Study / Deep Dive',
      architectureLabel: 'Architektur-Blueprint',
      architectureHint: '',
      liveDemoLabel: 'Randnotiz',
      galleryLabel: 'Evidence Board / Annotierte Screens',
      openDemoLabel: 'Live-Demo öffnen',
      insightsLabel: 'Technischer Deep Dive',
      detailLayerLabel: 'Umsetzungsebenen',
      githubLabel: 'GitHub Repository',
      zoomLabel: 'Screen vergrößern',
      lightboxCloseLabel: 'Lightbox schließen',
      lightboxPreviousLabel: 'Vorherigen Screen anzeigen',
      lightboxNextLabel: 'Nächsten Screen anzeigen',
    },
    notFoundTitle: 'Case Study nicht gefunden',
    notFoundText: 'Die angeforderte DCR-Case-Study ist nicht verfügbar.',
  },
  en: {
    projectsIntro: {
      dialogCloseLabel: 'Close project terminal window',
      overviewLabel: 'Back to case studies',
      typeLabel: 'Type',
      yearLabel: 'Year',
      stackLabel: 'Stack',
      descriptionLabel: 'Description',
      goalLabel: 'Requirements / Goal',
      roleLabel: 'Role / Tasks',
      highlightsEyebrow: 'Highlights',
      highlightsTitle: 'Inside this project',
      metaAriaLabel: 'Project information',
      techStackAriaLabel: 'Project tech stack',
      previewAriaLabel: 'More projects',
      metricsLabel: 'Project metrics',
      caseStudyLabel: 'Case Study / Deep Dive',
      architectureLabel: 'Architecture blueprint',
      architectureHint: '',
      liveDemoLabel: 'Side note',
      galleryLabel: 'Evidence board / annotated screens',
      openDemoLabel: 'Open live demo',
      insightsLabel: 'Technical deep dive',
      detailLayerLabel: 'Implementation layers',
      githubLabel: 'GitHub repository',
      zoomLabel: 'Enlarge screen',
      lightboxCloseLabel: 'Close lightbox',
      lightboxPreviousLabel: 'Show previous screen',
      lightboxNextLabel: 'Show next screen',
    },
    notFoundTitle: 'Case study not found',
    notFoundText: 'The requested DCR case study is not available.',
  },
};
