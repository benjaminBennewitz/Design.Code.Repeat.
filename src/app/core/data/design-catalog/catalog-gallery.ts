/* src/app/core/data/design-catalog/catalog-gallery.ts */
import type { PortfolioLanguage } from '../../models/reference-common.models';
import type { ProjectGalleryItem } from '../../models/reference-catalog.models';
import type { DesignCatalogGallerySeed } from './catalog-seed.models';
import { DESIGN_CATALOG_GALLERY_ITEMS } from './gallery-items.data';
import { DESIGN_CATALOG_GALLERY_BACKGROUNDS } from './gallery-backgrounds.data';

/**
 * Erstellt die Galeriearbeiten in der ausgewählten Sprache.
 * @param language Sprache der sichtbaren Galerieinhalte.
 */
export function createDesignCatalogGalleryItems(language: PortfolioLanguage): readonly ProjectGalleryItem[] {
  /**
   * Vollständig aufbereitete Galerieeinträge in unveränderter Reihenfolge.
   */
  const gallery: ProjectGalleryItem[] = [];
  /**
   * Aktuell in einen sichtbaren Galerieeintrag übersetzte Archivarbeit.
   */
  for (const item of DESIGN_CATALOG_GALLERY_ITEMS) {
    gallery.push(createDesignCatalogGalleryItem(item, language));
  }
  return gallery;
}

/**
 * Verbindet Galerieasset und sprachabhängige Beschreibung.
 * @param item Rohdaten einer Archivarbeit.
 * @param language Sprache der sichtbaren Beschreibung.
 */
function createDesignCatalogGalleryItem(
  item: DesignCatalogGallerySeed,
  language: PortfolioLanguage,
): ProjectGalleryItem {
  /**
   * Gemeinsamer Bildpfad für Galerie und Bildhinweis.
   */
  const image = `assets/images/projects/design-catalog/masonry/${item.file}.webp`;
  return {
    ...item[language],
    image,
    imageHint: image,
    backgroundColor: item.backgroundColor ?? DESIGN_CATALOG_GALLERY_BACKGROUNDS[item.file],
    size: item.size,
    icon: item.icon,
    tools: item.tools,
    year: item.year,
  };
}
