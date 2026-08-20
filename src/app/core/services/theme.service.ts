/**
 * @file Theme-Verwaltung der Studio-Website.
 * @description Verwaltet Dark-/Light-Mode, Persistenz, Browserfarbe, Kontrast-Tokens und einen kurzen Swipe-Übergang.
 */

import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { StudioTheme } from '../models/studio.models';
import { AccessibilityPreferenceService } from './accessibility-preference.service';
import { ThemeContrastService } from './theme-contrast.service';

/** Verwaltet das globale Farbschema. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Persistenzschlüssel des Studio-Themes. */
  private readonly storageKey = 'dcr-studio-theme';

  /** Dokumentreferenz für Theme-Attribut und Übergangsklasse. */
  private readonly document = inject(DOCUMENT);

  /** Dynamische semantische Kontrastberechnung. */
  private readonly contrastService = inject(ThemeContrastService);

  /** Globale Motion-Präferenz, damit Theme-Wechsel nicht gegen A11Y-Einstellungen animiert werden. */
  private readonly accessibilityService = inject(AccessibilityPreferenceService);

  /** Aktiver Theme-Zustand. */
  private readonly themeSignal = signal<StudioTheme>(this.readInitialTheme());

  /** Timer zum sicheren Entfernen der Übergangsklasse. */
  private transitionTimer?: number;

  /** Aktives Theme. */
  readonly theme = computed<StudioTheme>(() => this.themeSignal());

  /** True im Light Mode. */
  readonly isLight = computed<boolean>(() => this.theme() === 'light');

  /** Synchronisiert Theme, Browserfarbe und Kontrast-Tokens. */
  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.dataset['theme'] = theme;
      this.persistTheme(theme);
      this.updateThemeColor();
      queueMicrotask(() => this.contrastService.refresh());
    });
  }

  /** Wechselt zwischen Dark und Light mit einem kurzen neuen-Theme-Swipe. */
  toggleTheme(): void {
    this.startTransition();
    this.themeSignal.update((theme: StudioTheme) => theme === 'dark' ? 'light' : 'dark');
  }

  /** Setzt ein Theme explizit und nutzt dieselbe Transition wie der Toggle. */
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
      const savedTheme = this.document.defaultView?.localStorage.getItem(this.storageKey);

      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch {
      // LocalStorage kann deaktiviert sein; dann gilt die Systempräferenz.
    }

    return this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  /** Startet nur bei erlaubter Motion den globalen Swipe. */
  private startTransition(): void {
    const windowRef = this.document.defaultView;
    const root = this.document.documentElement;

    if (!windowRef || this.accessibilityService.reducesMotion()) {
      return;
    }

    root.classList.remove('dcr-theme-is-switching');
    void root.offsetWidth;
    root.classList.add('dcr-theme-is-switching');

    if (this.transitionTimer) {
      windowRef.clearTimeout(this.transitionTimer);
    }

    this.transitionTimer = windowRef.setTimeout(() => {
      root.classList.remove('dcr-theme-is-switching');
      this.transitionTimer = undefined;
    }, 680);
  }

  /** Persistiert das Theme defensiv. */
  private persistTheme(theme: StudioTheme): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
    } catch {
      // Die Website bleibt ohne Persistenz vollständig nutzbar.
    }
  }

  /** Aktualisiert die Browser-Chrome aus dem aktuell gerenderten Design-Token. */
  private updateThemeColor(): void {
    const meta = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const background = this.document.defaultView
      ?.getComputedStyle(this.document.documentElement)
      .getPropertyValue('--dcr-color-bg')
      .trim();

    if (meta && background) {
      meta.content = background;
    }
  }
}
