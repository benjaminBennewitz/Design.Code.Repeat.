/**
 * @file Lazy geladene Style-Basis der lokalen Referenz-Case-Studies.
 * @description Lädt die übernommenen B²Folio-Tokens und Utilities erst zusammen mit den Detailseiten,
 * damit die DCR-Startseite keinen zusätzlichen globalen CSS-Ballast erhält.
 */

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** Stellt die global benötigten B²Folio-Utility- und Token-Styles für lokale Case-Studies bereit. */
@Component({
  selector: 'dcr-reference-case-styles',
  standalone: true,
  template: '',
  styleUrls: [
    '../../../styles/reference-case-tokens.scss',
    '../../../styles/reference-case-utilities.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceCaseStylesComponent {}
