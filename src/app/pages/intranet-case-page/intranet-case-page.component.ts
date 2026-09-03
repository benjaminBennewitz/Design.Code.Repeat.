/**
 * @file Lokale Intranet-Case-Study.
 * @description Bindet die aus B²Folio gespiegelte Detailansicht fest an die DCR-Route.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReferenceCaseStudyComponent } from '../../shared/reference-case-study/reference-case-study.component';

/** DCR-Route für die vollständige Intranet-Case-Study. */
@Component({
  selector: 'dcr-intranet-case-page',
  standalone: true,
  imports: [ReferenceCaseStudyComponent],
  templateUrl: './intranet-case-page.component.html',
  styleUrl: './intranet-case-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntranetCasePageComponent {}
