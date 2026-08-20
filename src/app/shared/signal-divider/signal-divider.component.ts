/**
 * @file Dekorativer Signal- und Section-Trenner der Studio-Website.
 * @description Kapselt die fragmentierte DCR-Grafiksprache in einer sparsamen, rein dekorativen Komponente.
 */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Verfügbare visuelle Varianten des Signal-Trenners. */
export type SignalDividerVariant = 'paper' | 'accent';

/** Position und Darstellung eines animierten Markenzeichens. */
interface SignalGlyph {
  readonly char: string;
  readonly index: number;
  readonly pixelTop: string;
  readonly pixelLeft: string;
}

/** Position eines kleinen Datenblocks im grafischen Raster. */
interface SignalBlock {
  readonly index: number;
  readonly left: number;
  readonly top: number;
}

/** Geometrie eines horizontalen Datenfragments. */
interface SignalFragment {
  readonly index: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly opacity: number;
}

/**
 * Rein dekorativer Section-Trenner mit animierten Glyphen, Raster und Datenfragmenten.
 *
 * Die Komponente trägt bewusst `aria-hidden`, da sämtliche enthaltenen Zeichen nur visuelle
 * Atmosphäre erzeugen und keine zusätzliche Information gegenüber dem umgebenden Inhalt liefern.
 */
@Component({
  selector: 'dcr-signal-divider',
  standalone: true,
  templateUrl: './signal-divider.component.html',
  styleUrl: './signal-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalDividerComponent {
  /** Farbvariante des Trenners. */
  readonly variant = input<SignalDividerVariant>('paper');

  /** Kurzer technischer Marker zur Einordnung der jeweiligen Section-Grenze. */
  readonly marker = input<string>('DCR::SIGNAL');

  /** Marken-Glyphen; absichtlich unabhängig von der UI-Sprache. */
  readonly glyphs: readonly SignalGlyph[] = [...'DESIGN·CODE·REPEAT'].map((char, index) => ({
    char,
    index,
    pixelTop: `${8 + ((index % 4) * 17)}%`,
    pixelLeft: `${12 + ((index % 3) * 22)}%`,
  }));

  /** Deterministisch verteilte Datenblöcke; kein Laufzeit-Random, damit das Layout reproduzierbar bleibt. */
  readonly blocks: readonly SignalBlock[] = Array.from({ length: 12 }, (_, index) => ({
    index,
    left: 4 + ((index * 8) % 88),
    top: 18 + ((index % 4) * 18),
  }));

  /** Deterministisch verteilte Fragmentbalken für den unteren grafischen Bruch. */
  readonly fragments: readonly SignalFragment[] = Array.from({ length: 18 }, (_, index) => ({
    index,
    left: -6 + ((index * 11) % 74),
    top: (index % 6) * 14,
    width: 12 + ((index % 5) * 5),
    opacity: 0.18 + ((index % 4) * 0.18),
  }));
}
