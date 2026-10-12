/* src/app/core/services/theme.service.ts */
/**
 * @file Theme-Verwaltung der Studio-Website.
 * @description Verwaltet Dark-/Light-Mode, Persistenz, Browserfarbe und einen kurzen Swipe-Übergang.
 */

import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { StudioTheme } from '../models/studio.models';
import { DocumentTransition } from './document-transition';
import { AccessibilityPreferenceService } from './accessibility-preference.service';

/** Verwaltet das globale Farbschema. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'dcr-studio-theme';                                                          // Persistenzschlüssel des Studio-Themes.
  private readonly document = inject(DOCUMENT);                                                              // Dokumentreferenz für Theme-Attribut und Übergangsklasse.
  private readonly accessibilityService = inject(AccessibilityPreferenceService);                            // Bewegungspräferenz für den Theme-Wechsel.
  private readonly themeSignal = signal<StudioTheme>(this.readInitialTheme());                               // Aktiver Theme-Zustand.
  private readonly transition = new DocumentTransition(this.document, 'dcr-theme-is-switching', 680);        // Begrenzter globaler Wechsel.
  readonly theme = computed<StudioTheme>(/** Liest den internen Theme-Zustand. */ () => this.themeSignal()); // Aktives Theme.
  readonly isLight = computed<boolean>(/** Prüft das helle Farbschema. */ () => this.theme() === 'light');   // Aktives helles Farbschema.

  /** Synchronisiert Theme und Browserfarbe. */
  constructor() {
    effect(this.synchronizeTheme.bind(this));
  }

  /** Synchronisiert Theme, Persistenz und Browserfarbe nach einer Zustandsänderung. */
  private synchronizeTheme(): void {
    /**
     * Aktives Theme zum Zeitpunkt der reaktiven Synchronisierung.
     */
    const theme = this.theme();
    this.document.documentElement.dataset['theme'] = theme;
    this.persistTheme(theme);
    this.updateThemeColor();
  }

  /** Wechselt zwischen Dark und Light mit einem kurzen neuen-Theme-Swipe. */
  toggleTheme(): void {
    this.startTransition();
    this.themeSignal.update(
      /**
       * Wählt das jeweils andere Farbschema.
       * @param theme Aktives Theme vor dem Wechsel.
       */
      (theme) => (theme === 'dark' ? 'light' : 'dark'),
    );
  }

  /**
   * Setzt ein Theme explizit und nutzt dieselbe Transition wie der Toggle.
   * @param theme Gewünschtes globales Farbschema.
   */
  setTheme(theme: StudioTheme): void {
    if (theme === this.theme()) {
      return;
    }

    this.startTransition();
    this.themeSignal.set(theme);
  }

  /** Liest Persistenz oder Systempräferenz. */
  private readInitialTheme(): StudioTheme {
    try {
      /**
       * Gespeichertes Farbschema der aktuellen Browserinstanz.
       */
      const savedTheme = this.document.defaultView?.localStorage.getItem(this.storageKey);

      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch {
      // LocalStorage kann deaktiviert sein; dann gilt die Systempräferenz.
    }

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  /** Startet den Darstellungswechsel nur bei erlaubter Bewegung. */
  private startTransition(): void {
    if (!this.accessibilityService.reducesMotion()) this.transition.start();
  }

  /**
   * Persistiert das Theme defensiv.
   * @param theme Gewünschtes globales Farbschema.
   */
  private persistTheme(theme: StudioTheme): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
    } catch {
      // Die Website bleibt ohne Persistenz vollständig nutzbar.
    }
  }

  /** Aktualisiert die Browser-Chrome aus dem aktuell gerenderten Design-Token. */
  private updateThemeColor(): void {
    /**
     * Vorhandenes Meta-Element für die Browserfarbe.
     */
    const meta = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    /**
     * Aktuell gerenderter Hintergrundwert des globalen Design-Tokens.
     */
    const background = this.document.defaultView
      ?.getComputedStyle(this.document.documentElement)
      .getPropertyValue('--dcr-color-bg')
      .trim();

    if (meta && background) {
      meta.content = background;
    }
  }
}
