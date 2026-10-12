/* src/app/core/models/reference-catalog.models.ts */
import type { PortfolioLanguage } from './reference-common.models';

/** Platzhalter oder echtes Bild für eine Projektgalerie. */
export interface ProjectGalleryItem {
  /** Titel des Screenshot-, Mockup- oder Asset-Slots. */
  readonly title: string;
  /** Kurze Einordnung des visuellen Inhalts. */
  readonly text: string;
  /** Optionaler Bildpfad für echte Screenshots oder Galeriebilder. */
  readonly image?: string;
  /** Dominante Hintergrundfarbe für rahmende Bildcontainer. */
  readonly backgroundColor?: string;
  /** Geplanter Dateipfad, wenn ein Galeriebild später ergänzt wird. */
  readonly imageHint?: string;
  /** Alternativtext für echte Screenshots. */
  readonly alt?: string;
  /** Visuelle Gewichtung im Masonry-Layout. */
  readonly size: 'sm' | 'md' | 'lg';
  /** Kurze Callout-Texte für annotierte Screenshot-Karten. */
  readonly annotations?: readonly string[];
  /** Material-Symbol für Platzhalter- und Mockup-Previews. */
  readonly icon?: string;
  /** Optionaler Detailtext für Lightbox- und Galerieansichten. */
  readonly detail?: string;
  /** Optionale Werkzeug- oder Kontext-Tags für visuelle Arbeiten. */
  readonly tools?: readonly string[];
  /** Optionaler Jahrgang oder Zeitraum der visuellen Arbeit. */
  readonly year?: string;
}

/** Einzelne Seite im digitalen Designkatalog. */
export interface ProjectCatalogPage {
  /** Sichtbare Seitenzahl oder Seitenkennung. */
  readonly number: string;
  /** Position der Seite im Spread, wenn nur eine Seite sichtbar ist. */
  readonly side?: 'left' | 'right';
  /** Kleine Kapitel- oder Bildbeschriftung. */
  readonly eyebrow: string;
  /** Titel der Katalogseite. */
  readonly title: string;
  /** Kurzer editorialer Seiteninhalt. */
  readonly text: string;
  /** Optionaler Dateipfad für ein echtes Katalogseitenmotiv. */
  readonly image?: string;
  /** Sprachabhängige Dateipfade für lokalisierte Katalogseiten. */
  readonly imageByLanguage?: Partial<Record<PortfolioLanguage, string>>;
  /** Dateityp des Katalogseitenmotivs. */
  readonly assetType?: 'image' | 'pdf';
  /** Alternativtext für das Katalogseitenmotiv. */
  readonly alt: string;
  /** Geplanter Dateipfad, wenn das Motiv später ergänzt wird. */
  readonly imageHint: string;
  /** Visuelle Stimmung der Seite für CSS-Varianten. */
  readonly mood: 'cover' | 'image' | 'type' | 'detail';
}

/** Eintrag im Katalog-Inhaltsverzeichnis. */
export interface ProjectCatalogTocItem {
  /** Sichtbare Kapitelnummer. */
  readonly number: string;
  /** Titel des Kapitels. */
  readonly title: string;
  /** Untertitel des Kapitels. */
  readonly subtitle: string;
  /** Kurzer Kontexttext zum Kapitel. */
  readonly text: string;
  /** Optionaler Werkzeug- oder Themenschwerpunkt. */
  readonly tool?: string;
  /** Zielindex im Reader. */
  readonly targetSpreadIndex: number;
}

/** Doppelseite des digitalen Designkatalogs. */
export interface ProjectCatalogSpread {
  /** Stabile ID für Navigation und Tracking. */
  readonly id: string;
  /** Titel der Doppelseite. */
  readonly title: string;
  /** Kurzer Kontext zur Doppelseite. */
  readonly text: string;
  /** Linke und rechte Katalogseite im proportionalen Sonderformat-Spread. */
  readonly pages: readonly ProjectCatalogPage[];
}

/** Inhalt für interaktive Editorial- und Designkatalog-Projekte. */
export interface ProjectCatalogShowcase {
  /** Kleine Beschriftung im Hero-Showcase. */
  readonly eyebrow: string;
  /** Titel des Katalog-Showcases. */
  readonly title: string;
  /** Kurzer Status- oder Format-Hinweis. */
  readonly status: string;
  /** Editorialer Einführungstext zum Katalog. */
  readonly lead: string;
  /** Beschriftung des primären Hero-Links. */
  readonly ctaLabel: string;
  /** Kleine Tags zu Werkzeugen, Medien oder Gestaltung. */
  readonly chips: readonly string[];
  /** Zugängliche Beschriftung des Katalog-Readers. */
  readonly readerLabel: string;
  /** Eyebrow für die große Reader-Section. */
  readonly readerEyebrow: string;
  /** Überschrift für die große Reader-Section. */
  readonly readerTitle: string;
  /** Hinweis zur Interaktion mit dem Reader. */
  readonly readerHint: string;
  /** Beschriftung für den Button zum Öffnen des Inhaltsverzeichnisses. */
  readonly tocOpenLabel: string;
  /** Beschriftung für den Button zum Schließen des Inhaltsverzeichnisses. */
  readonly tocCloseLabel: string;
  /** Titel des Inhaltsverzeichnis-Overlays. */
  readonly tocTitle: string;
  /** Beschriftung für vorherige Doppelseite. */
  readonly previousLabel: string;
  /** Beschriftung für nächste Doppelseite. */
  readonly nextLabel: string;
  /** Kapitel aus dem sichtbaren Katalog-Inhaltsverzeichnis. */
  readonly tocItems?: readonly ProjectCatalogTocItem[];
  /** Interaktive Doppelseiten des Katalogs. */
  readonly spreads: readonly ProjectCatalogSpread[];
  /** Eyebrow für die Masonry-Galerie. */
  readonly galleryEyebrow: string;
  /** Überschrift für die Masonry-Galerie. */
  readonly galleryTitle: string;
  /** Beschriftung für Lightbox-Buttons. */
  readonly lightboxOpenLabel: string;
  /** Beschriftung für Lightbox schließen. */
  readonly lightboxCloseLabel: string;
  /** Beschriftung für vorheriges Galeriebild. */
  readonly lightboxPreviousLabel: string;
  /** Beschriftung für nächstes Galeriebild. */
  readonly lightboxNextLabel: string;
}
