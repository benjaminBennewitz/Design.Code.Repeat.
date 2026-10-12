/* src/app/shared/reference-case-study/controllers/catalog-reader.models.ts */
import type { ProjectCatalogPage, ProjectCatalogSpread } from '../../../core/models/reference-catalog.models';
/** Katalogseite mit vorbereitetem Bildpfad. */
export interface CatalogReaderPage extends ProjectCatalogPage {
  readonly asset?: string;
}
/** Reader-Ansicht mit vorbereiteten Seiten und sichtbarer Seitenzählung. */
export interface CatalogReaderSpread extends Omit<ProjectCatalogSpread, 'pages'> {
  readonly pages: readonly CatalogReaderPage[];
  readonly pageLabel: string;
}
/** Position und Bildausschnitt der rechteckigen Kataloglupe. */
export interface CatalogLoupeState {
  readonly isVisible: boolean;
  readonly pageNumber: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly asset: string;
  readonly backgroundSize: string;
  readonly backgroundPosition: string;
}
