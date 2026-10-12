/* src/app/shared/reference-case-study/views/case-hero.view.ts */
import { Component, input, ViewEncapsulation, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { CaseStudyUiContent } from './case-study-view.models';
import type { CaseStudySelection } from '../controllers/case-study-selection';
import type { CatalogFlow } from '../controllers/catalog-flow';
import { RouterLink } from '@angular/router';
import { TextRevealDirective } from '../../text-reveal.directive';
import { SystemDialogComponent } from '../../reference-system-dialog/reference-system-dialog.component';

/** Rendert Hero-Inhalte und Vorschau auf dem vorhandenen Header-Element. */
@Component({
  selector: 'header[dcrCaseHero]',
  standalone: true,
  imports: [RouterLink, TextRevealDirective, SystemDialogComponent],
  templateUrl: './case-hero.view.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseHeroView implements OnDestroy {
  readonly project = input.required<PortfolioProject>();     // Aktuell dargestellte Case Study.
  readonly content = input.required<CaseStudyUiContent>();   // Übersetzte Bedientexte der Case Study.
  readonly canonicalPath = input.required<string>();         // Kanonischer Pfad für den Hero-Link.
  readonly selection = input.required<CaseStudySelection>(); // Gemeinsame Architektur-, App- und Fensterzustände.
  readonly flow = input.required<CatalogFlow>();             // Lifecycle der generativen Hero-Animation.

  /**
   * Verbindet das Canvas mit der bestehenden Hero-Animation.
   * @param canvasRef Aktuelle Canvas-Referenz der Hero-Darstellung.
   */
  @ViewChild('catalogFlowCanvas') set canvasRef(canvasRef: ElementRef<HTMLCanvasElement> | undefined) {
    this.flow().connect(canvasRef?.nativeElement);
  }
  /** Entfernt die Canvas-Verbindung beim Verlassen der Hero-Darstellung. */
  ngOnDestroy(): void {
    this.flow().connect(undefined);
  }
}
