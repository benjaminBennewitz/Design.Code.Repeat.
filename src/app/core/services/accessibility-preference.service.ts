/* src/app/core/services/accessibility-preference.service.ts */
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
  private readonly storageKey = 'dcr-studio-accessibility-v1';                                          // Versionsierter Persistenzschlüssel der Präferenzen.
  private readonly document = inject(DOCUMENT);                                                         // Browser-Dokument für Data-Attribute und sichere Window-Auflösung.
  private readonly preferencesSignal = signal<AccessibilityPreferences>(this.readInitialPreferences()); // Interner Zustand der Accessibility-Einstellungen.
  readonly preferences = computed<AccessibilityPreferences>(
    /** Liest den internen Präferenzzustand. */ () => this.preferencesSignal(),
  ); // Aktuelle Accessibility-Einstellungen.
  readonly motionMode = computed<MotionMode>(/** Aktueller Bewegungsmodus. */ () => this.preferences().motion);      // Aktueller Bewegungsmodus.
  readonly comfortMode = computed<ComfortMode>(/** Aktueller Comfort-Modus. */ () => this.preferences().comfort);    // Aktueller Comfort-Modus.
  readonly contrastMode = computed<ContrastMode>(/** Aktueller Kontrastmodus. */ () => this.preferences().contrast); // Aktueller Kontrastmodus.
  readonly colorVisionMode = computed<ColorVisionMode>(
    /** Aktueller Farbseh-Modus. */ () => this.preferences().colorVision,
  ); // Aktueller Farbseh-Modus.
  readonly allowsMotion = computed<boolean>(/** Prüft uneingeschränkte Bewegung. */ () => this.motionMode() === 'full'); // Uneingeschränkt erlaubte Bewegung.
  readonly reducesMotion = computed<boolean>(
    /** Prüft reduzierte oder deaktivierte Bewegung. */ () => this.motionMode() !== 'full',
  ); // Reduzierte oder deaktivierte Bewegung.
  readonly usesSimpleMode = computed<boolean>(
    /** Prüft die vereinfachte Darstellung. */ () => this.comfortMode() === 'simple',
  ); // Vereinfachte Darstellung der Oberfläche.

  /** Synchronisiert Präferenzen mit CSS und LocalStorage. */
  constructor() {
    effect(this.synchronizePreferences.bind(this));
  }

  /** Synchronisiert die aktiven Präferenzen mit HTML-Attributen und Persistenz. */
  private synchronizePreferences(): void {
    /**
     * Aktuelle Präferenzen für die gemeinsame Dokumentaktualisierung.
     */
    const preferences = this.preferences();
    this.updateDocumentPreferences(preferences);
    this.writePreferences(preferences);
  }

  /**
   * Überträgt die Präferenzen in die bestehenden globalen CSS-Attribute.
   * @param preferences Aktueller Satz der Accessibility-Einstellungen.
   */
  private updateDocumentPreferences(preferences: AccessibilityPreferences): void {
    this.document.documentElement.dataset['motion'] = preferences.motion;
    this.document.documentElement.dataset['comfort'] = preferences.comfort;
    this.document.documentElement.dataset['contrast'] = preferences.contrast;
    this.document.documentElement.dataset['colorVision'] = preferences.colorVision;
  }

  /**
   * Setzt den Bewegungsmodus.
   * @param motion Gewünschter Bewegungsmodus.
   */
  setMotionMode(motion: MotionMode): void {
    this.patchPreferences({ motion });
  }

  /**
   * Setzt den Comfort-Modus.
   * @param comfort Gewünschter Comfort-Modus.
   */
  setComfortMode(comfort: ComfortMode): void {
    this.patchPreferences({ comfort });
  }

  /**
   * Setzt den Kontrastmodus.
   * @param contrast Gewünschter Kontrastmodus.
   */
  setContrastMode(contrast: ContrastMode): void {
    this.patchPreferences({ contrast });
  }

  /**
   * Setzt den Farbseh-Modus.
   * @param colorVision Gewünschte Farbseh-Anpassung.
   */
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

  /** Setzt manuelle Overrides auf die bisherigen Studio- und Systemstandards zurück. */
  resetPreferences(): void {
    this.preferencesSignal.set(this.defaultPreferences());
  }

  /**
   * Aktualisiert einzelne Werte ohne die übrigen Präferenzen zu verlieren.
   * @param patch Einzeln zu aktualisierende Accessibility-Einstellungen.
   */
  private patchPreferences(patch: Partial<AccessibilityPreferences>): void {
    this.preferencesSignal.update(
      /**
       * Ersetzt ausschließlich die angegebenen Präferenzfelder.
       * @param preferences Bisheriger Satz der Accessibility-Einstellungen.
       */
      (preferences) => ({ ...preferences, ...patch }),
    );
  }

  /** Liest gespeicherte Einstellungen und ersetzt ungültige Werte durch die bisherigen Standards. */
  private readInitialPreferences(): AccessibilityPreferences {
    /**
     * Standardwerte für fehlende, ungültige oder nicht lesbare Einstellungen.
     */
    const fallback = this.defaultPreferences();
    try {
      /**
       * Unveränderter JSON-Wert aus dem lokalen Präferenzspeicher.
       */
      const savedValue = this.document.defaultView?.localStorage.getItem(this.storageKey);
      return this.normalizePreferences(savedValue ? JSON.parse(savedValue) : null, fallback);
    } catch {
      return fallback;
    }
  }

  /** Liefert die bisherigen Standardwerte unter Berücksichtigung der Systembewegung. */
  private defaultPreferences(): AccessibilityPreferences {
    return {
      motion: this.systemPrefersReducedMotion() ? 'reduced' : 'full',
      comfort: 'expressive',
      contrast: 'normal',
      colorVision: 'default',
    };
  }

  /**
   * Übernimmt ausschließlich gültige Präferenzwerte aus dem gespeicherten Objekt.
   * @param savedValue Noch ungeprüfte Werte aus dem lokalen Speicher.
   * @param fallback Standardwerte für fehlende oder ungültige Felder.
   */
  private normalizePreferences(
    savedValue: Partial<AccessibilityPreferences> | null,
    fallback: AccessibilityPreferences,
  ): AccessibilityPreferences {
    return {
      motion: this.validMotionMode(savedValue?.motion) ? savedValue.motion : fallback.motion,
      comfort: this.validComfortMode(savedValue?.comfort) ? savedValue.comfort : fallback.comfort,
      contrast: this.validContrastMode(savedValue?.contrast) ? savedValue.contrast : fallback.contrast,
      colorVision: this.validColorVisionMode(savedValue?.colorVision) ? savedValue.colorVision : fallback.colorVision,
    };
  }

  /**
   * Persistiert Einstellungen nur, wenn Browser-Storage verfügbar ist.
   * @param preferences Aktueller Satz der Accessibility-Einstellungen.
   */
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

  /**
   * Validiert persistierte Bewegungsstufen.
   * @param value Noch ungeprüfter Wert aus dem lokalen Speicher.
   */
  private validMotionMode(value: unknown): value is MotionMode {
    return value === 'full' || value === 'reduced' || value === 'off';
  }

  /**
   * Validiert persistierte Comfort-Stufen.
   * @param value Noch ungeprüfter Wert aus dem lokalen Speicher.
   */
  private validComfortMode(value: unknown): value is ComfortMode {
    return value === 'expressive' || value === 'simple';
  }

  /**
   * Validiert persistierte Kontraststufen.
   * @param value Noch ungeprüfter Wert aus dem lokalen Speicher.
   */
  private validContrastMode(value: unknown): value is ContrastMode {
    return value === 'normal' || value === 'high';
  }

  /**
   * Validiert persistierte Farbseh-Modi.
   * @param value Noch ungeprüfter Wert aus dem lokalen Speicher.
   */
  private validColorVisionMode(value: unknown): value is ColorVisionMode {
    return (
      value === 'default' ||
      value === 'deuteranopia' ||
      value === 'protanopia' ||
      value === 'tritanopia' ||
      value === 'achromatopsia'
    );
  }
}
