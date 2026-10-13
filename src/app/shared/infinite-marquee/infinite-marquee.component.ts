/* src/app/shared/infinite-marquee/infinite-marquee.component.ts */
/**
* @file Wiederverwendbares Infinite-Marquee.
* @description Rendert eine kontinuierliche, rein CSS-basierte Tech-/Keyword-Leiste und respektiert globale Motion-Einstellungen.
*/

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Verfügbare Flächenfarben des Marquees. */
type MarqueeTone = 'surface' | 'primary' | 'pink';

/** Kontinuierlich laufende Liste für Techstack und kurze Schlagworte. */
@Component({
  selector: 'dcr-infinite-marquee',
  standalone: true,
  templateUrl: './infinite-marquee.component.html',
  styleUrl: './infinite-marquee.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteMarqueeComponent {
  readonly items = input.required<readonly string[]>(); // Sichtbare Einträge.

  readonly ariaLabel = input<string>('Technology stack'); // Zugängliche Beschriftung des Listeninhalts.

  readonly reverse = input<boolean>(false); // Laufrichtung.

  readonly tone = input<MarqueeTone>('surface'); // Flächenvariante für neutrale oder harte farbige Trenner.
}
