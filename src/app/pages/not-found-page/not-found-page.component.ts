/* src/app/pages/not-found-page/not-found-page.component.ts */
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { AccessibilityPreferenceService } from '../../core/services/accessibility-preference.service';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SystemPageLinksComponent } from '../../shared/system-page/system-page-links.component';
import { StatusCounter } from '../../shared/system-page/status-counter';
import { SYSTEM_PAGE_UI } from '../../shared/system-page/system-page-ui.data';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Fehlerseite mit einmaligem Statuszähler und direkten internen Navigationszielen. */
@Component({
  selector: 'dcr-not-found-page',
  standalone: true,
  imports: [TextRevealDirective, SystemPageLinksComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  private readonly languageService = inject(LanguageService); // Sprache und vorhandener Fehlertext.
  private readonly seoService = inject(SeoService); // Bestehende noindex-Ausgabe der Fehlerseite.
  private readonly document = inject(DOCUMENT); // Dokument für Loader- und Browserzustände.
  private readonly accessibility = inject(AccessibilityPreferenceService); // Zentrale Motion- und Comfort-Einstellungen.
  private readonly destroyRef = inject(DestroyRef); // Lebenszyklus der Statusanimation.
  private motionQuery?: MediaQueryList; // Native Systempräferenz während der kurzen Zählanimation.
  private readonly motionListener = this.handleSystemMotion.bind(this); // Stabiler Listener für geänderte Systembewegung.
  private loaderObserver?: MutationObserver; // Wartet auf die tatsächliche Freigabe des Start-Loaders.
  readonly counter = new StatusCounter(this.document.defaultView); // Einmaliger dekorativer 404-Zähler.
  readonly content = computed(
    /** Liest den bestehenden Fehlertext der aktiven Sprache. */
    () => this.languageService.content().notFound,
  ); // Zentrale Fehlertexte und SEO-Titel.
  readonly ui = computed(
    /** Liest die lokalisierten Steuertexte der neuen Fehlerdarstellung. */
    () => SYSTEM_PAGE_UI[this.languageService.language()].notFound,
  ); // Lokalisierte Überschrift und grafische Statusbeschriftungen.
  readonly allowsAnimation = computed(
    /** Prüft die zentralen Motion- und Comfort-Einstellungen. */
    () => this.accessibility.allowsMotion() && !this.accessibility.usesSimpleMode(),
  ); // Freigabe der dekorativen Seitenanimationen.

  /** Verbindet SEO, Animation und das Ende des statischen Start-Loaders. */
  constructor() {
    effect(this.updateSeo.bind(this));
    effect(this.applyMotionPreference.bind(this));
    afterNextRender(this.prepareCounter.bind(this));
    this.destroyRef.onDestroy(this.stopAnimation.bind(this));
  }

  /** Erhält die bestehende noindex-Ausgabe der Fehlerroute. */
  private updateSeo(): void {
    this.seoService.setNoIndex(this.content().title, this.content().text, '/404');
  }

  /** Beendet den Zähler unmittelbar bei reduzierter Bewegung oder einfachem Comfort-Modus. */
  private applyMotionPreference(): void {
    if (!this.allowsAnimation()) {
      this.stopAnimation();
      this.counter.finish();
    }
  }

  /** Startet den Zähler erst nach dem Rendern und bei erlaubter Systembewegung. */
  private prepareCounter(): void {
    /**
     * Verfügbares Browserfenster für Systempräferenz und Loader-Beobachtung.
     */
    const windowRef = this.document.defaultView;
    if (!windowRef || !this.allowsAnimation()) return this.counter.finish();
    this.motionQuery = windowRef.matchMedia('(prefers-reduced-motion: reduce)');
    if (this.motionQuery.matches) {
      this.counter.finish();
      return;
    }
    this.motionQuery.addEventListener('change', this.motionListener);
    this.observeLoader(windowRef);
  }

  /**
   * Wartet gegebenenfalls auf die sichtbare Freigabe der Anwendung.
   * @param windowRef Verfügbares Browserfenster für die Loader-Beobachtung.
   */
  private observeLoader(windowRef: Window & typeof globalThis): void {
    if (!this.isPageHidden()) return this.counter.start();
    this.loaderObserver = new windowRef.MutationObserver(this.startVisibleCounter.bind(this));
    this.loaderObserver.observe(this.document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  /**
   * Zeigt bei einer geänderten Systempräferenz unmittelbar den statischen Endwert.
   * @param event Neue Systempräferenz für reduzierte Bewegung.
   */
  private handleSystemMotion(event: MediaQueryListEvent): void {
    if (!event.matches) return;
    this.stopAnimation();
    this.counter.finish();
  }

  /** Prüft, ob der statische Start-Loader die Anwendung noch verdeckt. */
  private isPageHidden(): boolean {
    return this.document.documentElement.classList.contains('dcr-app-hidden');
  }

  /** Beginnt die einmalige Zählanimation nach der tatsächlichen Loader-Freigabe. */
  private startVisibleCounter(): void {
    if (this.isPageHidden()) return;
    this.loaderObserver?.disconnect();
    this.loaderObserver = undefined;
    if (this.allowsAnimation()) this.counter.start();
    else this.counter.finish();
  }

  /** Gibt Frames und Loader-Beobachtung beim Entfernen der Seite frei. */
  private stopAnimation(): void {
    this.counter.stop();
    this.motionQuery?.removeEventListener('change', this.motionListener);
    this.motionQuery = undefined;
    this.loaderObserver?.disconnect();
    this.loaderObserver = undefined;
  }
}
