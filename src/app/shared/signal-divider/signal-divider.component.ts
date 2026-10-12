/* src/app/shared/signal-divider/signal-divider.component.ts */
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
export type SignalDividerVariant = 'paper' | 'accent' | 'ink';

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
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement; // Host-Element zum Setzen des einmaligen Reveal-Zustands.
  private readonly destroyRef = inject(DestroyRef);                                         // Lifecycle-Handle zum Trennen des IntersectionObservers.
  private observer?: IntersectionObserver;                                                  // Beobachter für die einmalige Scroll-Reveal-Animation.
  readonly variant = input<SignalDividerVariant>('paper');                                  // Farbvariante des Trenners.
  readonly marker = input<string>('DCR::SIGNAL');                                           // Kurzer technischer Marker zur Einordnung der jeweiligen Section-Grenze.
  readonly glyphs: readonly SignalGlyph[] = [...'DESIGN·CODE·REPEAT'].map(
    /**
     * Marken-Glyphen; absichtlich unabhängig von der UI-Sprache.
     * @param char Markenzeichen an der aktuellen Position.
     * @param index Position innerhalb des deterministischen Rasters.
     */
    (char, index) => ({
      char,
      index,
      pixelTop: `${8 + (index % 4) * 17}%`,
      pixelLeft: `${12 + (index % 3) * 22}%`,
    }),
  ); // Marken-Glyphen; absichtlich unabhängig von der UI-Sprache.
  readonly blocks: readonly SignalBlock[] = Array.from(
    { length: 12 },
    /**
     * Deterministisch verteilte Datenblöcke; kein Laufzeit-Random.
     * @param _ Nicht benötigter Platzhalter der Array-Erzeugung.
     * @param index Position innerhalb des deterministischen Rasters.
     */
    (_, index) => ({
      index,
      left: 4 + ((index * 8) % 88),
      top: 18 + (index % 4) * 18,
    }),
  ); // Deterministisch verteilte Datenblöcke; kein Laufzeit-Random.
  readonly fragments: readonly SignalFragment[] = Array.from(
    { length: 18 },
    /**
     * Deterministisch verteilte Fragmentbalken für den unteren grafischen Bruch.
     * @param _ Nicht benötigter Platzhalter der Array-Erzeugung.
     * @param index Position innerhalb des deterministischen Rasters.
     */
    (_, index) => ({
      index,
      left: -6 + ((index * 11) % 74),
      top: (index % 6) * 14,
      width: 12 + (index % 5) * 5,
      opacity: 0.18 + (index % 4) * 0.18,
    }),
  ); // Deterministisch verteilte Fragmentbalken für den unteren grafischen Bruch.

  /** Aktiviert die einmalige Einfahrt bei erlaubter Bewegung und Observer-Unterstützung. */
  ngAfterViewInit(): void {
    /**
     * Browserfenster des tatsächlich gerenderten Hosts.
     */
    const windowRef = this.hostElement.ownerDocument.defaultView;
    if (!windowRef || !this.allowsReveal(windowRef) || !('IntersectionObserver' in windowRef)) {
      this.hostElement.classList.add('is-in-view');
      return;
    }
    this.hostElement.classList.add('is-motion-ready');
    this.observer = new windowRef.IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.22,
      rootMargin: '0px 0px -8% 0px',
    });
    this.observer.observe(this.hostElement);
    this.destroyRef.onDestroy(this.disconnectObserver.bind(this));
  }

  /**
   * Prüft die bestehenden Dokument- und Systempräferenzen für den dekorativen Reveal.
   * @param windowRef Browserfenster des gerenderten Hosts.
   */
  private allowsReveal(windowRef: Window): boolean {
    return (
      this.hostElement.ownerDocument.documentElement.dataset['motion'] !== 'reduced' &&
      this.hostElement.ownerDocument.documentElement.dataset['motion'] !== 'off' &&
      !windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /**
   * Startet die Einfahrt einmalig beim Erreichen der bestehenden Reveal-Schwelle.
   * @param entries Aktuelle Sichtbarkeitsmeldungen des Hosts.
   * @param observer Beobachter der einmaligen Einfahrt.
   */
  private handleIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    if (!entries[0]?.isIntersecting) return;
    this.hostElement.classList.add('is-in-view');
    observer.disconnect();
  }

  /** Trennt den Observer beim Entfernen des dekorativen Trenners. */
  private disconnectObserver(): void {
    this.observer?.disconnect();
  }
}
