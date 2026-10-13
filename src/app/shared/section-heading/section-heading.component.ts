/* src/app/shared/section-heading/section-heading.component.ts */
/**
* @file Wiederverwendbare Section-Überschrift.
* @description Vereinheitlicht Eyebrow, H2 und optionalen Lead-Text ohne zusätzliche Content-Logik.
*/

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextRevealDirective } from '../text-reveal.directive';

/** Semantische Überschrift für Hauptbereiche. */
@Component({
  selector: 'dcr-section-heading',
  standalone: true,
  imports: [TextRevealDirective],
  templateUrl: './section-heading.component.html',
  styleUrl: './section-heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  readonly align = input<'left' | 'center' | 'right'>('left'); // Textausrichtung der Section-Überschrift für bewusst variierende Layouts.
  readonly eyebrow = input.required<string>(); // Terminal-artige Vorzeile.
  readonly title = input.required<string>(); // Hauptüberschrift.
  readonly text = input<string | undefined>(''); // Optionaler erläuternder Text.
}
