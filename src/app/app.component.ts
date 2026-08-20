/**
 * @file Root-Komponente der Studio-Website.
 * @description Stellt globales Layout, Accessibility-, Privacy- und Scroll-Helfer bereit und synchronisiert den inaktiven Tab-Titel.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { TabTitleService } from './core/services/tab-title.service';
import { AccessibilityPanelComponent } from './layout/accessibility-panel/accessibility-panel.component';
import { CookieBannerComponent } from './layout/cookie-banner/cookie-banner.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ScrollToTopComponent } from './layout/scroll-to-top/scroll-to-top.component';

/** Root-Layout. */
@Component({
  selector: 'dcr-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    AccessibilityPanelComponent,
    CookieBannerComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  /** Steuert die bewusst verlängerte Startsequenz der Website. */
  readonly isLoading = signal(true);

  /** Sprachservice für globale UI-Texte. */
  readonly languageService = inject(LanguageService);

  /** Dynamischer Tab-Titel. */
  private readonly tabTitleService = inject(TabTitleService);

  /** Räumt den Loader-Timer beim Zerstören der Root-Komponente auf. */
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => this.tabTitleService.setHiddenTitle(this.languageService.content().meta.hiddenTitle));

    const loaderTimer = globalThis.setTimeout(() => this.isLoading.set(false), 3_000);
    this.destroyRef.onDestroy(() => globalThis.clearTimeout(loaderTimer));
  }
}
