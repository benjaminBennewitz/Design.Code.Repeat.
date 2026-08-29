/**
 * @file Root-Komponente der Studio-Website.
 * @description Stellt globales Layout, Accessibility-, Privacy- und Scroll-Helfer bereit und synchronisiert den inaktiven Tab-Titel.
 */

import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  /** Blendet den alten Seiteninhalt während eines echten Routenwechsels aus. */
  readonly isRouteChanging = signal(false);

  /** Sprachservice für globale UI-Texte. */
  readonly languageService = inject(LanguageService);

  /** Dynamischer Tab-Titel. */
  private readonly tabTitleService = inject(TabTitleService);

  /** Angular Router für einen kontrollierten, nicht animierten Scroll-Reset. */
  private readonly router = inject(Router);

  /** Dokumentzugriff für die temporäre Scroll-Klasse. */
  private readonly document = inject(DOCUMENT);

  /** Räumt Timer und Router-Subscription beim Zerstören der Root-Komponente auf. */
  private readonly destroyRef = inject(DestroyRef);

  /** Letzte vollständig abgeschlossene Route ohne Fragment. */
  private currentRoutePath = this.routePath(this.router.url);

  constructor() {
    effect(() => this.tabTitleService.setHiddenTitle(this.languageService.content().meta.hiddenTitle));

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handleRouterEvent(event));

    afterNextRender(() => {
      const windowRef = this.document.defaultView;
      windowRef?.dispatchEvent(new windowRef.Event('dcr:app-ready'));
    });
  }

  /** Verhindert sichtbares Hochscrollen und vorzeitig ausgelöste Reveals bei Routenwechseln. */
  private handleRouterEvent(event: unknown): void {
    const windowRef = this.document.defaultView;

    if (event instanceof NavigationStart) {
      const nextRoutePath = this.routePath(event.url);

      if (nextRoutePath !== this.currentRoutePath) {
        this.isRouteChanging.set(true);
        this.document.documentElement.classList.add('dcr-route-is-changing');
        windowRef?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }

      return;
    }

    if (event instanceof NavigationEnd) {
      this.currentRoutePath = this.routePath(event.urlAfterRedirects);

      if (!this.isRouteChanging()) {
        return;
      }

      if (!windowRef) {
        this.finishRouteChange();
        return;
      }

      windowRef.requestAnimationFrame(() => {
        windowRef.requestAnimationFrame(() => this.finishRouteChange());
      });
      return;
    }

    if (event instanceof NavigationCancel || event instanceof NavigationError) {
      this.finishRouteChange();
    }
  }

  /** Entfernt die temporäre Route-Transition erst nach Scroll-Restoration und Render. */
  private finishRouteChange(): void {
    this.document.documentElement.classList.remove('dcr-route-is-changing');
    this.isRouteChanging.set(false);
  }

  /** Vergleicht Navigationen fragmentunabhängig, damit reine In-Page-Sprünge unverändert bleiben. */
  private routePath(url: string): string {
    return url.split('#', 1)[0]?.split('?', 1)[0] ?? url;
  }
}
