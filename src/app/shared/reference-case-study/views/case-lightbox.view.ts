/* src/app/shared/reference-case-study/views/case-lightbox.view.ts */
import { Component, input, ViewEncapsulation } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { CaseStudyUiContent } from './case-study-view.models';
import type { GalleryLightbox } from '../controllers/gallery-lightbox';
import type { ProjectGalleryItem } from '../../../core/models/reference-catalog.models';
import { ProtectedAssetDirective } from './protected-asset.directive';

/** Rendert die geöffnete Galeriearbeit und deren Navigation. */
@Component({
  selector: 'div[dcrCaseLightbox]',
  standalone: true,
  imports: [ProtectedAssetDirective],
  templateUrl: './case-lightbox.view.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseLightboxView {
  readonly project = input.required<PortfolioProject>();   // Aktuell dargestellte Case Study.
  readonly content = input.required<CaseStudyUiContent>(); // Übersetzte Bedientexte der Case Study.
  readonly lightbox = input.required<GalleryLightbox>();   // Gemeinsamer Galerie- und Dialogzustand.
  readonly item = input.required<ProjectGalleryItem>();    // Aktuell geöffnete Galeriearbeit.
}
