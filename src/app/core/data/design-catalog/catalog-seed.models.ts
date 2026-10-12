/* src/app/core/data/design-catalog/catalog-seed.models.ts */
import type { ProjectCatalogPage, ProjectGalleryItem } from '../../models/reference-catalog.models';

export interface DesignCatalogChapterSeed {
  /** Sichtbare Kapitelnummer. */
  readonly number: string;
  /** Kapitelname aus dem Katalog. */
  readonly title: string;
  /** Unterzeile aus dem Katalog. */
  readonly subtitle: string;
  /** Erste Seite des Kapitels im Reader. */
  readonly startPage: number;
  /** Kurzer Kontexttext aus dem Inhaltsverzeichnis. */
  readonly text: string;
  /** Zugeordnetes Werkzeug oder Thema. */
  readonly tool: string;
  /** Visuelle Seitenstimmung für Platzhalter und Animation. */
  readonly mood: ProjectCatalogPage['mood'];
}

export interface DesignCatalogGalleryTextSeed {
  /** Sichtbarer Titel der Galeriearbeit. */
  readonly title: string;
  /** Kurzer Kartentext unter dem Masonry-Bild. */
  readonly text: string;
  /** Ausführlicher Lightbox-Text zur Gestaltungsidee. */
  readonly detail: string;
  /** Alternativtext für das Galeriebild. */
  readonly alt: string;
}

export interface DesignCatalogGallerySeed {
  /** Zweistellige oder vorhandene Dateinummer im Masonry-Ordner. */
  readonly file: string;
  /** Visuelle Gewichtung im Masonry-Raster. */
  readonly size: ProjectGalleryItem['size'];
  /** Material-Symbol für Fallbacks und interne Semantik. */
  readonly icon: string;
  /** Aus dem Asset analysierte Container-Hintergrundfarbe. */
  readonly backgroundColor?: string;
  /** Genutzte oder naheliegende Werkzeuge. */
  readonly tools: readonly string[];
  /** Jahr oder grober Zeitraum der Arbeit. */
  readonly year: string;
  /** Deutsche Texte für die Galerie. */
  readonly de: DesignCatalogGalleryTextSeed;
  /** Englische Texte für die Galerie. */
  readonly en: DesignCatalogGalleryTextSeed;
}
