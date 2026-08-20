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
  /** Sprachservice für ARIA-Text. */
  private readonly languageService = inject(LanguageService);

  /** Sichtbarkeit ab ungefähr einem Viewport Scrolltiefe. */
  readonly visible = signal<boolean>(false);

  /** Sprachabhängige Beschriftung. */
  readonly label = computed(() => this.languageService.language() === 'de' ? 'Zum Seitenanfang' : 'Back to top');

  /** Aktualisiert den Button ohne zusätzlichen Scroll-Service. */
  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > Math.max(520, window.innerHeight * 0.72));
  }

  /** Scrollt respektvoll zur aktuellen Motion-Präferenz nach oben. */
  scrollToTop(): void {
    const reducedMotion = document.documentElement.dataset['motion'] !== 'full';
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}
