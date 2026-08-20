/**
 * @file Dekorativer Signal- und Section-Trenner der Studio-Website.
 * @description Kapselt die fragmentierte DCR-Grafiksprache als vollbreiten, scroll-getriggerten Störer.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';

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

/** Vollbreiter Section-Trenner mit einmaliger Zug-Einfahrt beim Eintritt in den Viewport. */
@Component({
  selector: 'dcr-signal-divider',
  standalone: true,
  templateUrl: './signal-divider.component.html',
  styleUrl: './signal-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalDividerComponent implements AfterViewInit {
  /** Host-Element zum Setzen des einmaligen Reveal-Zustands. */
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Lifecycle-Handle zum Trennen des IntersectionObservers. */
  private readonly destroyRef = inject(DestroyRef);

  /** Beobachter für die einmalige Scroll-Reveal-Animation. */
  private observer?: IntersectionObserver;

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

  /** Deterministisch verteilte Datenblöcke; kein Laufzeit-Random. */
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

  /** Aktiviert die Zug-Einfahrt nur bei erlaubter Bewegung und moderner Observer-Unterstützung. */
  ngAfterViewInit(): void {
    const windowRef = this.hostElement.ownerDocument.defaultView;
    const root = this.hostElement.ownerDocument.documentElement;
    const reducedMotion = root.dataset['motion'] === 'reduced'
      || root.dataset['motion'] === 'off'
      || windowRef?.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!windowRef || reducedMotion || !('IntersectionObserver' in windowRef)) {
      this.hostElement.classList.add('is-in-view');
      return;
    }

    this.hostElement.classList.add('is-motion-ready');
    this.observer = new windowRef.IntersectionObserver(([entry], observer) => {
      if (!entry?.isIntersecting) {
        return;
      }

      this.hostElement.classList.add('is-in-view');
      observer.disconnect();
    }, {
      threshold: 0.22,
      rootMargin: '0px 0px -8% 0px',
    });

    this.observer.observe(this.hostElement);
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }
}
