/* src/app/core/data/design-catalog/gallery-items.data.ts */
import type { DesignCatalogGallerySeed } from './catalog-seed.models';
import { COMPOSITING_GALLERY_ITEMS } from './gallery/compositing.data';
import { PHOTOGRAPHY_GALLERY_ITEMS } from './gallery/photography.data';
import { LAYOUT_GALLERY_ITEMS } from './gallery/layout.data';
import { GENERATIVE_GALLERY_ITEMS } from './gallery/generative.data';
import { EDITORIAL_GALLERY_ITEMS } from './gallery/editorial.data';
import { VECTOR_GALLERY_ITEMS } from './gallery/vector.data';
import { ARCHIVE_GALLERY_ITEMS } from './gallery/archive.data';

/**
 * Galeriearbeiten in unveränderter Reihenfolge des bisherigen Archivs.
 */
export const DESIGN_CATALOG_GALLERY_ITEMS: readonly DesignCatalogGallerySeed[] = [
  ...COMPOSITING_GALLERY_ITEMS,
  ...PHOTOGRAPHY_GALLERY_ITEMS,
  ...LAYOUT_GALLERY_ITEMS,
  ...GENERATIVE_GALLERY_ITEMS,
  ...EDITORIAL_GALLERY_ITEMS,
  ...VECTOR_GALLERY_ITEMS,
  ...ARCHIVE_GALLERY_ITEMS,
];
