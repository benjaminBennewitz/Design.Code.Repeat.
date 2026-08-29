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
  /** Horizontal scrollbares Zielelement. */
  readonly target = input.required<HTMLElement>();

  /** Aktuelle Sprache für sichtbaren Text und zugängliche Beschriftung. */
  private readonly languageService = inject(LanguageService);

  /** Lifecycle-Handle für Timer und DOM-Listener. */
  private readonly destroyRef = inject(DestroyRef);

  /** Wird nach kurzer Orientierungspause aktiviert. */
  readonly isVisible = signal(false);

  /** Verhindert erneutes Einblenden, sobald der Track benutzt wurde. */
  readonly isDismissed = signal(false);

  /** Kurzer sichtbarer Gestenhinweis. */
  readonly label = computed(() => this.languageService.language() === 'de' ? 'Nach links wischen' : 'Swipe left');

  /** Beschreibt die optionale Klickfunktion des Hinweises. */
  readonly actionLabel = computed(() => this.languageService.language() === 'de'
    ? 'Nächste Karte anzeigen. Alternativ nach links wischen.'
    : 'Show the next card. Alternatively swipe left.');

  /** Startet Hinweis-Timer und Nutzungsbeobachtung erst nach gebundenem Ziel-Element. */
  ngAfterViewInit(): void {
    const target = this.target();
    const timer = globalThis.setTimeout(() => {
      if (!this.isDismissed()) {
        this.isVisible.set(true);
      }
    }, 3_000);
    const onScroll = (): void => {
      if (target.scrollLeft > 12) {
        this.dismiss();
      }
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      globalThis.clearTimeout(timer);
      target.removeEventListener('scroll', onScroll);
    });
  }

  /** Scrollt als optionale Klickhilfe zur nächsten sichtbaren Kartenposition. */
  showNext(): void {
    const target = this.target();
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
