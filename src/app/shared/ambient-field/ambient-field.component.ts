/**
 * @file Dekoratives Ambient-Feld für Hero-Sections.
 * @description Kapselt subtile Raster-, Orbit- und Signalbewegungen, damit Hero-Hintergründe wiederverwendbar und Accessibility-konform bleiben.
 */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visuelle Varianten des Ambient-Felds. */
export type AmbientFieldVariant = 'services' | 'studio';

/** Rein dekoratives Hero-Hintergrundsystem. */
@Component({
  selector: 'dcr-ambient-field',
  standalone: true,
  templateUrl: './ambient-field.component.html',
  styleUrl: './ambient-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmbientFieldComponent {
  /** Legt Dichte und Bewegungscharakter fest. */
  readonly variant = input<AmbientFieldVariant>('services');
}
