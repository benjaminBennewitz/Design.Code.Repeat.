/* src/app/layout/scroll-to-top/scroll-to-top.component.ts */
/**
 * @file Globaler Scroll-to-top Button.
 * @description Blendet nach ausreichender Scrolltiefe einen zugänglichen Rücksprung zur Seitenoberkante ein.
 */

import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/** Fester Scroll-to-top Button für lange Routen. */
@Component({
  selector: 'dcr-scroll-to-top',
  standalone: true,
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopComponent {
  private readonly languageService = inject(LanguageService); // Sprachservice für ARIA-Text.
  readonly visible = signal<boolean>(false);                  // Sichtbarkeit ab ungefähr einem Viewport Scrolltiefe.
  readonly label = computed(
    /** Sprachabhängige Beschriftung. */ () =>
      this.languageService.language() === 'de' ? 'Zum Seitenanfang' : 'Back to top',
  ); // Sprachabhängige Beschriftung.

  /** Aktualisiert den Button ohne zusätzlichen Scroll-Service. */
  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > Math.max(520, window.innerHeight * 0.72));
  }

  /** Scrollt respektvoll zur aktuellen Motion-Präferenz nach oben. */
  scrollToTop(): void {
    /**
     * Reduzierte oder ausgeschaltete Bewegung im globalen Dokument.
     */
    const reducedMotion = document.documentElement.dataset['motion'] !== 'full';
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}
