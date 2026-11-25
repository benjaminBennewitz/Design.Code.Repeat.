/** @file Beispielprodukte für die Frontend-Vorschau von DCR//TOOLS. */

export type ShopLanguage = 'de' | 'en';
export type ShopCategory = 'indesign' | 'excel' | 'word' | 'photoshop' | 'illustrator' | 'project' | 'bundle';

interface ProductCopy {
  readonly description: string;
  readonly features: readonly string[];
  readonly optionalFeatures?: readonly string[];
}

/** Darstellungsdaten eines Produkts mit Preis in Cent. */
export interface ShopProduct {
  readonly slug: string;
  readonly code: string;
  readonly name: string;
  readonly category: ShopCategory;
  readonly cents: number;
  readonly accent: string;
  readonly copy: Readonly<Record<ShopLanguage, ProductCopy>>;
}

/** Gemeinsame optionale Erweiterungen der Kalendergeneratoren. */
const CALENDAR_OPTIONS = {
  de: ['Geburtstage über ein Formular erfassen und für weitere Jahre speichern', 'Feiertage nach Bundesland auswählen'],
  en: ['Enter birthdays in a form and save them for future years', 'Select public holidays by German federal state'],
} as const;

/** Erste Kollektion zur Erprobung von Einzelprodukten, Bundle und Gratisdownload. */
export const SHOP_PRODUCTS: readonly ShopProduct[] = [
  {
    slug: 'year-grid', code: 'CAL/001', name: 'Year Grid', category: 'indesign', cents: 1990, accent: '#b5ff3b',
    copy: {
      de: { description: 'Ein kompletter Jahreskalender auf einem Blatt mit eigenen Akzentfarben und Logo.', features: ['Zwölf Monate in einem editierbaren Raster', 'Freie Jahresauswahl und automatische Datumsberechnung', 'Individuelle Akzentfarben und eigenes Logo'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'A complete year on one sheet with custom accent colours and logo.', features: ['Twelve months in an editable grid', 'Select any supported year with automatic date calculation', 'Custom accent colours and logo'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'monthly', code: 'CAL/002', name: 'Monthly', category: 'indesign', cents: 1990, accent: '#75d9ff',
    copy: {
      de: { description: 'Zwölf klassische Monatsansichten mit quadratischen Tagesfeldern, eigenen Akzentfarben und Logo.', features: ['Ein editierbares Monatsblatt mit quadratischen Tagesfeldern', 'Freie Jahresauswahl und automatische Datumsberechnung', 'Individuelle Akzentfarben und eigenes Logo'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'Twelve classic monthly views with square day cells, custom accent colours and logo.', features: ['One editable monthly sheet with square day cells', 'Select any supported year with automatic date calculation', 'Custom accent colours and logo'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'weekly-planner', code: 'CAL/003', name: 'Weekly Planner', category: 'indesign', cents: 1990, accent: '#ff79d7',
    copy: {
      de: { description: 'Ein vollständiger Wochenkalender mit 52 oder 53 ISO-Kalenderwochen, eigenen Akzentfarben und Logo.', features: ['Ein editierbares Blatt pro ISO-Kalenderwoche (52 oder 53)', 'Freie Jahresauswahl und automatische Datumsberechnung', 'Individuelle Akzentfarben und eigenes Logo'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'A complete weekly calendar with 52 or 53 ISO weeks, custom accent colours and logo.', features: ['One editable sheet per ISO calendar week (52 or 53)', 'Select any supported year with automatic date calculation', 'Custom accent colours and logo'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'calendar-bundle', code: 'CAL/SET', name: 'Complete Bundle', category: 'bundle', cents: 4990, accent: '#c8a2ff',
    copy: {
      de: { description: 'Die gesamte Calendar Series mit Jahresübersicht, Monatsblättern und Wochenplanung.', features: ['Year Grid, Monthly und Weekly Planner', 'Drei getrennt nutzbare Generatoren', 'Jeweils mit Dokumentation und Beispielen'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'The complete Calendar Series with an annual overview, monthly sheets and weekly planning.', features: ['Year Grid, Monthly and Weekly Planner', 'Three individually usable generators', 'Documentation and examples for each tool'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'calendar-lite', code: 'CAL/LITE', name: 'Calendar Lite', category: 'indesign', cents: 0, accent: '#ffca70',
    copy: {
      de: { description: 'Ein kostenloser Einstieg in die Calendar Series. In der Vorschau kannst du das Musterlayout direkt laden.', features: ['Kompaktes Kalenderlayout', 'Musterdatei zum direkten Download', 'Einstieg ohne Kundenkonto'] },
      en: { description: 'A free introduction to the Calendar Series. Download the sample layout directly from this preview.', features: ['Compact calendar layout', 'Sample file available for direct download', 'No account required'] },
    },
  },
];

/** Liefert den lokalisierten Preis für einen Betrag in Cent. */
export function formatShopPrice(cents: number, language: ShopLanguage): string {
  return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/** Liefert die lokale Adresse einer Vorschaugrafik. */
export function shopImage(product: ShopProduct, view: 'cover' | 'layout' = 'cover'): string {
  return `assets/images/shop/${product.slug}-${view}.${view === 'cover' ? 'svg' : 'webp'}`;
}
