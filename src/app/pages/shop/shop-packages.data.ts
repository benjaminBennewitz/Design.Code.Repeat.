/** @file Metadaten der vorliegenden Produktpakete; keine Downloadadressen. */

import { ShopLanguage } from './shop-products.data';

/** Eine Datei im veröffentlichten Lieferumfang. */
export interface ShopPackageFile {
  readonly path: string;
  readonly bytes: number;
  readonly icon: string;
  readonly description: Readonly<Record<ShopLanguage, string>>;
}

/** Beschreibt eine konkrete, unveränderliche Paketversion. */
export interface ShopPackage {
  readonly filename: string;
  readonly version: string;
  readonly bytes: number;
  readonly sha256: string;
  readonly files: readonly ShopPackageFile[];
}

/** Aus dem gelieferten ZIP abgeleitet; später aus der Shop-API beziehen. */
export const SHOP_PACKAGES: Readonly<Partial<Record<string, ShopPackage>>> = {
  'year-grid': {
    "filename": "DCR-TOOLS--WandkalenderA1.zip",
    "version": "0.1.8",
    "bytes": 52056,
    "sha256": "4c9be8f3b299e371cd8e15c5b9618eb80bd6c69c2adb86a48ac1f3de67e8bb35",
    "files": [
      {
        "path": "DCR-TOOLS_Year_Grid.idjs",
        "bytes": 50742,
        "icon": "code",
        "description": {
          "de": "UXP-Skript für InDesign",
          "en": "UXP script for InDesign"
        }
      },
      {
        "path": "Year-Grid-Dokumentation.html",
        "bytes": 16931,
        "icon": "description",
        "description": {
          "de": "Installation, Bedienung und Changelog (Deutsch)",
          "en": "Installation, usage and changelog (German)"
        }
      },
      {
        "path": "LICENSE.txt",
        "bytes": 1822,
        "icon": "gavel",
        "description": {
          "de": "Lizenzbedingungen",
          "en": "Licence terms"
        }
      },
      {
        "path": "Beispiele/Beispiel-Logo.pdf",
        "bytes": 4482,
        "icon": "picture_as_pdf",
        "description": {
          "de": "Vektorlogo zum Testen",
          "en": "Vector logo for testing"
        }
      },
      {
        "path": "Beispiele/Geburtstage.txt",
        "bytes": 182,
        "icon": "description",
        "description": {
          "de": "Zehn Beispiel-Geburtstagseinträge",
          "en": "Ten sample birthday entries"
        }
      },
      {
        "path": "Beispiele/Satzvorschau-A1.pdf",
        "bytes": 28473,
        "icon": "picture_as_pdf",
        "description": {
          "de": "A1-Satzvorschau aus dem Satzmodell",
          "en": "A1 preview rendered from the layout model"
        }
      }
    ]
  },
};

/** Formatiert Dateigrößen lokalisiert in binären Kilobyte. */
export function formatPackageSize(bytes: number, language: ShopLanguage): string {
  return `${new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-IE', { maximumFractionDigits: 1 }).format(bytes / 1024)} KiB`;
}
