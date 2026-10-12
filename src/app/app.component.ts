/* src/app/app.component.ts */
/**
 * @file Root-Komponente der Studio-Website.
 * @description Stellt globales Layout, Accessibility-, Privacy- und Scroll-Helfer bereit und synchronisiert den inaktiven Tab-Titel.
 */

import { DOCUMENT, ViewportScroller } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from './core/services/language.service';
import { TabTitleService } from './core/services/tab-title.service';
import { AccessibilityPanelComponent } from './layout/accessibility-panel/accessibility-panel.component';
import { CookieBannerComponent } from './layout/cookie-banner/cookie-banner.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FragmentScrollService } from './core/services/fragment-scroll.service';
import { HeaderComponent } from './layout/header/header.component';
import { ScrollToTopComponent } from './layout/scroll-to-top/scroll-to-top.component';

/** Root-Layout. */
@Component({
  selector: 'dcr-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
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
  readonly isRouteChanging = signal(false);                     // Blendet den alten Seiteninhalt während eines echten Routenwechsels aus.
  readonly languageService = inject(LanguageService);           // Sprachservice für globale UI-Texte.
  private readonly tabTitleService = inject(TabTitleService);   // Dynamischer Tab-Titel.
  private readonly router = inject(Router);                     // Angular Router für einen kontrollierten, nicht animierten Scroll-Reset.
  private readonly viewportScroller = inject(ViewportScroller); // Berücksichtigt den fixierten Header bei allen Router-Ankersprüngen.
  private readonly document = inject(DOCUMENT);                 // Dokumentzugriff für die temporäre Scroll-Klasse.
  private readonly destroyRef = inject(DestroyRef);             // Räumt Timer und Router-Subscription beim Zerstören der Root-Komponente auf.
  private currentRoutePath = this.routePath(this.router.url);   // Letzte vollständig abgeschlossene Route ohne Fragment.

  /** Verbindet die Komponente mit ihren reaktiven Dokumentzuständen. */
  constructor() {
    inject(FragmentScrollService);
    this.viewportScroller.setOffset(this.headerOffset.bind(this));

    effect(this.updateHiddenTitle.bind(this));

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.handleRouterEvent.bind(this));

    afterNextRender(this.announceAppReady.bind(this));
  }

  /**
   * Verteilt Router-Ereignisse auf Start, Abschluss und Abbruch der Seitendarstellung.
   * @param event Aktuelles Router-Ereignis.
   */
  private handleRouterEvent(event: unknown): void {
    if (event instanceof NavigationStart) this.startRouteChange(event.url);
    else if (event instanceof NavigationEnd) this.completeNavigation(event.urlAfterRedirects);
    else if (event instanceof NavigationCancel || event instanceof NavigationError) this.finishRouteChange();
  }

  /**
   * Blendet bei einem Seitenwechsel den alten Inhalt vor dem Scroll-Reset aus.
   * @param url Zieladresse der beginnenden Navigation.
   */
  private startRouteChange(url: string): void {
    if (this.routePath(url) === this.currentRoutePath) return;
    this.isRouteChanging.set(true);
    this.document.documentElement.classList.add('dcr-route-is-changing');
    this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  /**
   * Merkt die erreichte Route und wartet vor der Freigabe auf das neue Layout.
   * @param url Nach Weiterleitungen tatsächlich erreichte Adresse.
   */
  private completeNavigation(url: string): void {
    this.currentRoutePath = this.routePath(url);
    if (!this.isRouteChanging()) return;
    /**
     * Browserfenster für die bestehende zweistufige Render-Freigabe.
     */
    const windowRef = this.document.defaultView;
    if (windowRef) windowRef.requestAnimationFrame(this.waitForRouteRender.bind(this));
    else this.finishRouteChange();
  }

  /** Wartet nach Scroll-Restoration einen weiteren Frame auf das neue Layout. */
  private waitForRouteRender(): void {
    this.document.defaultView?.requestAnimationFrame(this.finishRouteChange.bind(this));
  }

  /** Liefert den Header-Abstand für die bestehende Router-Ankerausrichtung. */
  private headerOffset(): [number, number] {
    return [0, this.document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0];
  }

  /** Aktualisiert den lokalisierten Rückkehrhinweis des Browser-Tabs. */
  private updateHiddenTitle(): void {
    this.tabTitleService.setHiddenTitle(this.languageService.content().meta.hiddenTitle);
  }

  /** Meldet nach dem ersten Rendern die Bereitschaft der Anwendung an den Loader. */
  private announceAppReady(): void {
    /**
     * Browserfenster für das bestehende App-Ready-Ereignis.
     */
    const windowRef = this.document.defaultView;
    windowRef?.dispatchEvent(new windowRef.Event('dcr:app-ready'));
  }

  /** Entfernt die temporäre Route-Transition erst nach Scroll-Restoration und Render. */
  private finishRouteChange(): void {
    this.document.documentElement.classList.remove('dcr-route-is-changing');
    this.isRouteChanging.set(false);
  }

  /**
   * Vergleicht Navigationen fragmentunabhängig, damit reine In-Page-Sprünge unverändert bleiben.
   * @param url Adresse der aktuellen Navigation.
   */
  private routePath(url: string): string {
    return url.split('#', 1)[0]?.split('?', 1)[0] ?? url;
  }
}
