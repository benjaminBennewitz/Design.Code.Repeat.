/** @file Noch nicht bestellbare Produktkonzepte für DCR//TOOLS. */

import { ShopCategory, ShopLanguage } from './shop-products.data';

/** Ein Produktkonzept oder individuelles Anfrageangebot ohne Kaufberechtigung. */
export interface ShopConcept {
  readonly code: string;
  readonly name: string;
  readonly category: Exclude<ShopCategory, 'bundle'>;
  readonly icon: string;
  readonly inquiryOnly?: boolean;
  readonly accent: string;
  readonly description: Readonly<Record<ShopLanguage, string>>;
}

/** Ideen werden erst nach einer Machbarkeitsprüfung zu regulären Produkten. */
export const SHOP_CONCEPTS: readonly ShopConcept[] = [
  {
    code: 'ID/004', name: 'Style Engine', category: 'indesign', icon: 'format_paint', accent: '#ff79b8',
    description: {
      de: 'Importierte Texte anhand eigener Muster analysieren, Absatz- und Zeichenformate vorschlagen und kontrolliert anwenden.',
      en: 'Analyse imported text using custom patterns, suggest paragraph and character styles and apply them under your control.',
    },
  },
  {
    code: 'ID/005', name: 'GREP Studio', category: 'indesign', icon: 'manage_search', accent: '#ff79b8',
    description: {
      de: 'GREP-Suchregeln mit Trefferliste, sichtbaren Sonderzeichen, Vorschau und wiederverwendbaren Regelketten verwalten.',
      en: 'Manage GREP rules with match lists, visible special characters, previews and reusable rule sequences.',
    },
  },
  {
    code: 'XL/001', name: 'Regex Studio', category: 'excel', icon: 'manage_search', accent: '#72e4a7',
    description: {
      de: 'Zellinhalte und Arbeitsblätter mit regulären Ausdrücken durchsuchen und Ersetzungen vorab prüfen.',
      en: 'Search cell contents and worksheets using regular expressions and preview replacements.',
    },
  },
  {
    code: 'XL/002', name: 'Vacation Planner', category: 'excel', icon: 'event_available', accent: '#72e4a7',
    description: {
      de: 'Urlaub, Resturlaub und Abwesenheiten kleiner Teams in einer interaktiven Arbeitsmappe planen.',
      en: 'Plan leave, remaining allowances and absences for small teams in an interactive workbook.',
    },
  },
  {
    code: 'XL/003', name: 'Dashboard Studio', category: 'excel', icon: 'dashboard', accent: '#72e4a7',
    description: {
      de: 'Übersichtliche Arbeitsmappen mit Kennzahlen, Filtern und Auswertungen für wiederkehrende Berichte. Konkrete Anwendungsfälle sind offen.',
      en: 'Workbooks with KPIs, filters and analytics for recurring reports. Specific use cases remain open.',
    },
  },
  {
    code: 'WD/001', name: 'Regex Studio', category: 'word', icon: 'manage_search', accent: '#92b6ff',
    description: {
      de: 'Erweiterte Textsuche mit RegEx, Trefferliste und kontrollierter Ersetzung unter Erhalt der Dokumentstruktur.',
      en: 'Advanced text search with regex, match lists and controlled replacement while preserving document structure.',
    },
  },
  {
    code: 'WD/002', name: 'Format Studio', category: 'word', icon: 'format_align_left', accent: '#92b6ff',
    description: {
      de: 'Wiederkehrende Formatierungsaufgaben, Absatzformate, Abstände und Ausrichtungen vereinheitlichen.',
      en: 'Standardise recurring formatting tasks, paragraph styles, spacing and alignment.',
    },
  },
  {
    code: 'PS/001', name: 'Custom Photoshop Automation', category: 'photoshop', icon: 'photo_library', accent: '#75d9ff', inquiryOnly: true,
    description: {
      de: 'Individuelle Automatisierung für Bildbearbeitung, Ebenen, wiederkehrende Exporte und deinen Photoshop-Workflow.',
      en: 'Custom automation for image editing, layers, recurring exports and your Photoshop workflow.',
    },
  },
  {
    code: 'AI/001', name: 'Custom Illustrator Automation', category: 'illustrator', icon: 'draw', accent: '#ffba69', inquiryOnly: true,
    description: {
      de: 'Individuelle Skripte für Vektor-Workflows, Zeichenflächen, Varianten und wiederkehrende Aufgaben.',
      en: 'Custom scripts for vector workflows, artboards, variants and repetitive tasks.',
    },
  },
  {
    code: 'MP/001', name: 'Custom Project Automation', category: 'project', icon: 'account_tree', accent: '#c8a2ff', inquiryOnly: true,
    description: {
      de: 'Individuelle Unterstützung für Projektberichte, Auswertungen und Exporte. Die technische Machbarkeit wird vorab geprüft.',
      en: 'Custom support for project reports, analysis and exports. Technical feasibility is assessed first.',
    },
  },
];
