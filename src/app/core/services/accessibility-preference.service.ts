/**
 * @file Globale Accessibility- und Comfort-Präferenzen der Studio-Website.
 * @description Persistiert Bewegungs-, Komplexitäts-, Kontrast- und Farbseh-Modi und synchronisiert sie über HTML-Data-Attribute.
 */

import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

/** Verfügbare Bewegungsstufen. */
export type MotionMode = 'full' | 'reduced' | 'off';

/** Verfügbare Komplexitätsstufen der Oberfläche. */
export type ComfortMode = 'expressive' | 'simple';

/** Verfügbare Kontraststufen. */
export type ContrastMode = 'normal' | 'high';

/** Unterstützte Farbseh-Anpassungen. */
export type ColorVisionMode = 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia';

/** Persistierte Accessibility-Einstellungen. */
export interface AccessibilityPreferences {
  readonly motion: MotionMode;
  readonly comfort: ComfortMode;
  readonly contrast: ContrastMode;
  readonly colorVision: ColorVisionMode;
}

/** Verwaltet globale Accessibility- und Comfort-Einstellungen der Studio-Website. */
@Injectable({ providedIn: 'root' })
export class AccessibilityPreferenceService {
  /** Versionsierter LocalStorage-Key, damit spätere Schemaänderungen sauber migrierbar bleiben. */
  private readonly storageKey = 'dcr-studio-accessibility-v1';

  /** Browser-Dokument für Data-Attribute und sichere Window-Auflösung. */
  private readonly document = inject(DOCUMENT);

  /** Interner Zustand der Accessibility-Einstellungen. */
  private readonly preferencesSignal = signal<AccessibilityPreferences>(this.readInitialPreferences());

  /** Aktuelle Accessibility-Einstellungen. */
  readonly preferences = computed<AccessibilityPreferences>(() => this.preferencesSignal());

  /** Aktueller Bewegungsmodus. */
  readonly motionMode = computed<MotionMode>(() => this.preferences().motion);

  /** Aktueller Comfort-Modus. */
  readonly comfortMode = computed<ComfortMode>(() => this.preferences().comfort);

  /** Aktueller Kontrastmodus. */
  readonly contrastMode = computed<ContrastMode>(() => this.preferences().contrast);

  /** Aktueller Farbseh-Modus. */
  readonly colorVisionMode = computed<ColorVisionMode>(() => this.preferences().colorVision);

  /** True, wenn JavaScript-Animationen uneingeschränkt laufen dürfen. */
  readonly allowsMotion = computed<boolean>(() => this.motionMode() === 'full');

  /** True, wenn Animationen reduziert oder deaktiviert werden sollen. */
  readonly reducesMotion = computed<boolean>(() => this.motionMode() !== 'full');

  /** True, wenn die Oberfläche bewusst visuell ruhiger dargestellt werden soll. */
  readonly usesSimpleMode = computed<boolean>(() => this.comfortMode() === 'simple');

  /** Synchronisiert Präferenzen mit CSS und LocalStorage. */
  constructor() {
    effect(() => {
      const preferences = this.preferences();
      const root = this.document.documentElement;

      root.dataset['motion'] = preferences.motion;
      root.dataset['comfort'] = preferences.comfort;
      root.dataset['contrast'] = preferences.contrast;
      root.dataset['colorVision'] = preferences.colorVision;

      this.writePreferences(preferences);
    });
  }

  /** Setzt den Bewegungsmodus. */
  setMotionMode(motion: MotionMode): void {
    this.patchPreferences({ motion });
  }

  /** Setzt den Comfort-Modus. */
  setComfortMode(comfort: ComfortMode): void {
    this.patchPreferences({ comfort });
  }

  /** Setzt den Kontrastmodus. */
  setContrastMode(contrast: ContrastMode): void {
    this.patchPreferences({ contrast });
  }

  /** Setzt den Farbseh-Modus. */
  setColorVisionMode(colorVision: ColorVisionMode): void {
    this.patchPreferences({ colorVision });
  }

  /** Aktiviert eine ruhige, kontraststarke Darstellung mit vollständig deaktivierter Motion. */
  enableCalmMode(): void {
    this.preferencesSignal.set({
      motion: 'off',
      comfort: 'simple',
      contrast: 'high',
      colorVision: this.colorVisionMode(),
    });
  }

  /** Setzt alle manuellen Overrides auf die Studio-Standarddarstellung zurück. */
  resetPreferences(): void {
    this.preferencesSignal.set({
      motion: this.systemPrefersReducedMotion() ? 'reduced' : 'full',
      comfort: 'expressive',
      contrast: 'normal',
      colorVision: 'default',
    });
  }

  /** Aktualisiert einzelne Werte ohne die übrigen Präferenzen zu verlieren. */
  private patchPreferences(patch: Partial<AccessibilityPreferences>): void {
    this.preferencesSignal.update((preferences) => ({ ...preferences, ...patch }));
  }

  /** Ermittelt initiale Werte aus Persistenz und Systemeinstellung. */
  private readInitialPreferences(): AccessibilityPreferences {
    const fallback: AccessibilityPreferences = {
      motion: this.systemPrefersReducedMotion() ? 'reduced' : 'full',
      comfort: 'expressive',
      contrast: 'normal',
      colorVision: 'default',
    };

    try {
      const savedValue = this.document.defaultView?.localStorage.getItem(this.storageKey);
      const parsedValue = savedValue ? JSON.parse(savedValue) as Partial<AccessibilityPreferences> : null;

      return {
        motion: this.validMotionMode(parsedValue?.motion) ? parsedValue.motion : fallback.motion,
        comfort: this.validComfortMode(parsedValue?.comfort) ? parsedValue.comfort : fallback.comfort,
        contrast: this.validContrastMode(parsedValue?.contrast) ? parsedValue.contrast : fallback.contrast,
        colorVision: this.validColorVisionMode(parsedValue?.colorVision) ? parsedValue.colorVision : fallback.colorVision,
      };
    } catch {
      return fallback;
    }
  }

  /** Persistiert Einstellungen nur, wenn Browser-Storage verfügbar ist. */
  private writePreferences(preferences: AccessibilityPreferences): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } catch {
      // Storage kann durch Browser-/Privacy-Einstellungen gesperrt sein; die Session-Funktion bleibt erhalten.
    }
  }

  /** Prüft die Betriebssystempräferenz für reduzierte Bewegung. */
  private systemPrefersReducedMotion(): boolean {
    return this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  /** Validiert persistierte Bewegungsstufen. */
  private validMotionMode(value: unknown): value is MotionMode {
    return value === 'full' || value === 'reduced' || value === 'off';
  }

  /** Validiert persistierte Comfort-Stufen. */
  private validComfortMode(value: unknown): value is ComfortMode {
    return value === 'expressive' || value === 'simple';
  }

  /** Validiert persistierte Kontraststufen. */
  private validContrastMode(value: unknown): value is ContrastMode {
    return value === 'normal' || value === 'high';
  }

  /** Validiert persistierte Farbseh-Modi. */
  private validColorVisionMode(value: unknown): value is ColorVisionMode {
    return value === 'default'
      || value === 'deuteranopia'
      || value === 'protanopia'
      || value === 'tritanopia'
      || value === 'achromatopsia';
  }
}
