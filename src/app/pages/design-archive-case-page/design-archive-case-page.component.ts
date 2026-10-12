/* src/app/pages/design-archive-case-page/design-archive-case-page.component.ts */
/**
 * @file Lokale Design-Archiv-Case-Study.
 * @description Bindet den vollständigen Katalogreader aus B²Folio an den DCR-Domainspace.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReferenceCaseStudyComponent } from '../../shared/reference-case-study/reference-case-study.component';

/** DCR-Route für den lokal ausgelieferten Design-Archiv-Reader. */
@Component({
  selector: 'dcr-design-archive-case-page',
  standalone: true,
  imports: [ReferenceCaseStudyComponent],
  templateUrl: './design-archive-case-page.component.html',
  styleUrl: './design-archive-case-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignArchiveCasePageComponent {}
