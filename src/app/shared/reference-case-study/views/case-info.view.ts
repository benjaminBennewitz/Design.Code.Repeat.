/* src/app/shared/reference-case-study/views/case-info.view.ts */
import { Component, input, ViewEncapsulation } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import type { CaseStudyUiContent } from './case-study-view.models';
import { TextRevealDirective } from '../../text-reveal.directive';
import { RevealOnScrollDirective } from '../../reference-reveal-on-scroll.directive';

/** Rendert Projektinformationen, Zielsetzung und Aufgaben. */
@Component({
  selector: 'section[dcrCaseInfo]',
  standalone: true,
  imports: [TextRevealDirective, RevealOnScrollDirective],
  templateUrl: './case-info.view.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseInfoView {
  readonly project = input.required<PortfolioProject>();   // Aktuell dargestellte Case Study.
  readonly content = input.required<CaseStudyUiContent>(); // Übersetzte Bedientexte der Case Study.
}
