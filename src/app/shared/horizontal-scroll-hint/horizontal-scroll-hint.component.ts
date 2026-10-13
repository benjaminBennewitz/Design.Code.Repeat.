/* src/app/shared/horizontal-scroll-hint/horizontal-scroll-hint.component.ts */

import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/** Dezenter Hinweis für horizontal per Touch bedienbare Showcase-Tracks. */
@Component({
  selector: 'dcr-horizontal-scroll-hint',
  standalone: true,
  templateUrl: './horizontal-scroll-hint.component.html',
  styleUrl: './horizontal-scroll-hint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalScrollHintComponent implements AfterViewInit {
  private observedTarget?: HTMLElement; // Ursprünglich beobachteter Track für eine sichere Abmeldung.
  private timer?: ReturnType<typeof globalThis.setTimeout>; // Verzögerter Start des Gestenhinweises.
  private readonly scrollListener = this.handleScroll.bind(this); // Stabile Referenz für die Nutzungsbeobachtung.

  readonly target = input.required<HTMLElement>(); // Horizontal scrollbares Zielelement.

  private readonly languageService = inject(LanguageService); // Aktuelle Sprache für sichtbaren Text und zugängliche Beschriftung.

  private readonly destroyRef = inject(DestroyRef); // Lifecycle-Handle für Timer und DOM-Listener.

  readonly isVisible = signal(false); // Wird nach kurzer Orientierungspause aktiviert.

  readonly isDismissed = signal(false); // Verhindert erneutes Einblenden, sobald der Track benutzt wurde.

  readonly label = computed(
    /**
    * Kurzer sichtbarer Gestenhinweis.
    */
    () => this.languageService.language() === 'de' ? 'Nach links wischen' : 'Swipe left'); // Kurzer sichtbarer Gestenhinweis.

  readonly actionLabel = computed(
    /**
    * Beschreibt die optionale Klickfunktion des Hinweises.
    */
    () => this.languageService.language() === 'de'
      ? 'Nächste Karte anzeigen. Alternativ nach links wischen.'
      : 'Show the next card. Alternatively swipe left.'); // Beschreibt die optionale Klickfunktion des Hinweises.

  /** Startet Hinweis-Timer und Nutzungsbeobachtung erst nach gebundenem Ziel-Element. */
  ngAfterViewInit(): void {
    this.timer = globalThis.setTimeout(this.showHint.bind(this), 3_000);
    this.observedTarget = this.target();
    this.observedTarget.addEventListener('scroll', this.scrollListener, { passive: true });
    this.destroyRef.onDestroy(this.stopObservation.bind(this));
  }

  /** Blendet den Hinweis ein, solange der Track noch nicht bedient wurde. */
  private showHint(): void {
    if (!this.isDismissed()) this.isVisible.set(true);
  }

  /** Entfernt den Hinweis nach der ersten relevanten horizontalen Bewegung. */
  private handleScroll(): void {
    if ((this.observedTarget?.scrollLeft ?? 0) > 12) this.dismiss();
  }

  /** Gibt den Timer und den Scroll-Listener der Komponenteninstanz frei. */
  private stopObservation(): void {
    globalThis.clearTimeout(this.timer);
    this.observedTarget?.removeEventListener('scroll', this.scrollListener);
    this.observedTarget = undefined;
  }

  /** Scrollt als optionale Klickhilfe zur nächsten sichtbaren Kartenposition. */
  showNext(): void {
    /**
    * Konfigurierter horizontaler Track.
    */
    const target = this.target();
    /**
    * Freigabe weicher Scrollbewegung im zentralen Motion-Zustand.
    */
    const motionEnabled = document.documentElement.dataset['motion'] === 'full';

    target.scrollBy({
      left: Math.max(260, target.clientWidth * 0.82),
      behavior: motionEnabled ? 'smooth' : 'auto',
    });
    this.dismiss();
  }

  /** Entfernt den Hinweis dauerhaft für die aktuelle Komponenteninstanz. */
  private dismiss(): void {
    this.isDismissed.set(true);
    this.isVisible.set(false);
  }
}
