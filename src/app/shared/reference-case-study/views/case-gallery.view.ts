/* src/app/shared/reference-case-study/views/case-gallery.view.ts */
import { Component, input, ViewEncapsulation } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { CaseStudyUiContent } from './case-study-view.models';
import type { GalleryLightbox } from '../controllers/gallery-lightbox';
import { TextRevealDirective } from '../../text-reveal.directive';
import { RevealOnScrollDirective } from '../../reference-reveal-on-scroll.directive';
import { ProtectedAssetDirective } from './protected-asset.directive';

/** Rendert Katalogarbeiten oder Projekt-Screenshots mit gemeinsamer Lightbox. */
@Component({
  selector: 'section[dcrCaseGallery]',
  standalone: true,
  imports: [TextRevealDirective, RevealOnScrollDirective, ProtectedAssetDirective],
  templateUrl: './case-gallery.view.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseGalleryView {
  readonly project = input.required<PortfolioProject>();    // Aktuell dargestellte Case Study.
  readonly content = input.required<CaseStudyUiContent>();  // Übersetzte Bedientexte der Case Study.
  readonly lightbox = input.required<GalleryLightbox>();    // Gemeinsamer Galerie- und Dialogzustand.
  readonly mode = input.required<'catalog' | 'evidence'>(); // Masonry- oder Screenshot-Darstellung.
}
