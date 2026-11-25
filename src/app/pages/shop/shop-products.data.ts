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
  readonly name: Readonly<Record<ShopLanguage, string>>;
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
    slug: 'year-grid', code: 'CAL/001', name: { de: 'Wandkalender', en: 'Wall Calendar' }, category: 'indesign', cents: 1990, accent: '#b5ff3b',
    copy: {
      de: { description: 'Gestalte deinen Wandkalender in wenigen Schritten: Jahr, Format, Farbe und Logo auswählen – den Rest übernimmt das Skript. Für A1, A0, 1.070 × 700 mm oder ein eigenes Querformat.', features: ['Einseitige Jahresübersicht mit ISO-Kalenderwochen und optionalen Randmonaten', 'Jahresauswahl, individuelle Akzentfarbe und eigenes Logo', 'Gesetzliche Feiertage nach Bundesland ab 2017, optionale regionale Feiertage und Anlässe', 'Geburtstage über einen Eingabedialog; mehrere Personen pro Tag möglich', 'Deutsch und Englisch für Dialog und Kalender; lokale Ausführung als UXP-Skript'] },
      en: { description: 'Create your wall calendar in a few simple steps: choose the year, format, colour and logo, and let the script do the rest. For A1, A0, 1,070 × 700 mm or a custom landscape format.', features: ['Single-page annual overview with ISO weeks and optional adjacent months', 'Year selection, custom accent colour and logo', 'Public holidays by German federal state from 2017, optional local holidays and occasions', 'Birthday entry dialog with support for multiple people per day', 'German and English dialog and calendar; locally executed UXP script'] },
    },
  },
  {
    slug: 'monthly', code: 'CAL/002', name: { de: 'Monatskalender', en: 'Monthly Calendar' }, category: 'indesign', cents: 1990, accent: '#75d9ff',
    copy: {
      de: { description: 'Zwölf klassische Monatsansichten mit quadratischen Tagesfeldern, eigenen Akzentfarben und Logo.', features: ['Ein editierbares Monatsblatt mit quadratischen Tagesfeldern', 'Freie Jahresauswahl und automatische Datumsberechnung', 'Individuelle Akzentfarben und eigenes Logo'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'Twelve classic monthly views with square day cells, custom accent colours and logo.', features: ['One editable monthly sheet with square day cells', 'Select any supported year with automatic date calculation', 'Custom accent colours and logo'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'weekly-planner', code: 'CAL/003', name: { de: 'Wochenkalender', en: 'Weekly Calendar' }, category: 'indesign', cents: 1990, accent: '#ff79d7',
    copy: {
      de: { description: 'Ein vollständiger Wochenkalender mit 52 oder 53 ISO-Kalenderwochen, eigenen Akzentfarben und Logo.', features: ['Ein editierbares Blatt pro ISO-Kalenderwoche (52 oder 53)', 'Freie Jahresauswahl und automatische Datumsberechnung', 'Individuelle Akzentfarben und eigenes Logo'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'A complete weekly calendar with 52 or 53 ISO weeks, custom accent colours and logo.', features: ['One editable sheet per ISO calendar week (52 or 53)', 'Select any supported year with automatic date calculation', 'Custom accent colours and logo'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'calendar-bundle', code: 'CAL/SET', name: { de: 'Kalender-Komplettpaket', en: 'Complete Calendar Set' }, category: 'bundle', cents: 4990, accent: '#c8a2ff',
    copy: {
      de: { description: 'Drei Kalender für deine Gestaltung: das ganze Jahr, einzelne Monate und jede Woche.', features: ['Wandkalender, Monatskalender und Wochenkalender', 'Drei getrennt nutzbare Generatoren', 'Jeweils mit Dokumentation und Beispielen'], optionalFeatures: CALENDAR_OPTIONS.de },
      en: { description: 'Three calendars for your designs: the whole year, individual months and every week.', features: ['Wall Calendar, Monthly Calendar and Weekly Calendar', 'Three individually usable generators', 'Documentation and examples for each tool'], optionalFeatures: CALENDAR_OPTIONS.en },
    },
  },
  {
    slug: 'calendar-lite', code: 'CAL/LITE', name: { de: 'Kostenloses Kalendermuster', en: 'Free Calendar Sample' }, category: 'indesign', cents: 0, accent: '#ffca70',
    copy: {
      de: { description: 'Schau dir ein Kalenderlayout vorab an. Lade das kostenlose Musterbild direkt herunter.', features: ['Kompaktes Kalenderlayout', 'Musterdatei zum direkten Download', 'Einstieg ohne Kundenkonto'] },
      en: { description: 'Take a look at a calendar layout before buying. Download the free sample image directly.', features: ['Compact calendar layout', 'Sample file available for direct download', 'No account required'] },
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
