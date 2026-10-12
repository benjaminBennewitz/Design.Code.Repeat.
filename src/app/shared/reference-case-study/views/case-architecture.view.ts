/* src/app/shared/reference-case-study/views/case-architecture.view.ts */
import { Component, input, ViewEncapsulation } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { CaseStudyUiContent } from './case-study-view.models';
import type { CaseStudySelection } from '../controllers/case-study-selection';
import { TextRevealDirective } from '../../text-reveal.directive';
import { RevealOnScrollDirective } from '../../reference-reveal-on-scroll.directive';

/** Rendert die interaktive Systemkarte und den ausgewählten Architektur-Knoten. */
@Component({
  selector: 'section[dcrCaseArchitecture]',
  standalone: true,
  imports: [TextRevealDirective, RevealOnScrollDirective],
  templateUrl: './case-architecture.view.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseArchitectureView {
  readonly project = input.required<PortfolioProject>();     // Aktuell dargestellte Case Study.
  readonly content = input.required<CaseStudyUiContent>();   // Übersetzte Bedientexte der Case Study.
  readonly selection = input.required<CaseStudySelection>(); // Gemeinsame Architektur-, App- und Fensterzustände.
}
