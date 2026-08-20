/**
 * @file Wiederverwendbare Section-Überschrift.
 * @description Vereinheitlicht Eyebrow, H2 und optionalen Lead-Text ohne zusätzliche Content-Logik.
 */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Semantische Überschrift für Hauptbereiche. */
@Component({
  selector: 'dcr-section-heading',
  standalone: true,
  templateUrl: './section-heading.component.html',
  styleUrl: './section-heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  /** Textausrichtung der Section-Überschrift für bewusst variierende Layouts. */
  readonly align = input<'left' | 'center' | 'right'>('left');
  /** Terminal-artige Vorzeile. */
  readonly eyebrow = input.required<string>();
  /** Hauptüberschrift. */
  readonly title = input.required<string>();
  /** Optionaler erläuternder Text. */
  readonly text = input<string | undefined>('');
}
