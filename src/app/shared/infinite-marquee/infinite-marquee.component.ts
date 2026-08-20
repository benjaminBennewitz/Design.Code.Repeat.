/**
 * @file Wiederverwendbares Infinite-Marquee.
 * @description Rendert eine kontinuierliche, rein CSS-basierte Tech-/Keyword-Leiste und respektiert globale Motion-Einstellungen.
 */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Kontinuierlich laufende Liste für Techstack und kurze Schlagworte. */
@Component({
  selector: 'dcr-infinite-marquee',
  standalone: true,
  templateUrl: './infinite-marquee.component.html',
  styleUrl: './infinite-marquee.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteMarqueeComponent {
  /** Sichtbare Einträge. */
  readonly items = input.required<readonly string[]>();

  /** Zugängliche Beschriftung des Listeninhalts. */
  readonly ariaLabel = input<string>('Technology stack');

  /** Laufrichtung. */
  readonly reverse = input<boolean>(false);
}
