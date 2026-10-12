/* src/app/core/services/language.service.ts */
/**
 * @file Sprachverwaltung der Studio-Website.
 * @description Synchronisiert DE/EN per Signal mit LocalStorage, HTML-lang und einem kurzen Interface-Übergang.
 */

import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { STUDIO_TRANSLATIONS } from '../data/studio-content';
import { StudioContent, StudioLanguage } from '../models/studio.models';
import { DocumentTransition } from './document-transition';
import { AccessibilityPreferenceService } from './accessibility-preference.service';

/** Verwaltet die aktive UI-Sprache. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'dcr-studio-language';                                                                // Persistenzschlüssel mit eigenem Namespace der Studio-Anwendung.
  private readonly document = inject(DOCUMENT);                                                                       // Dokumentreferenz für `lang` und Übergangsklasse.
  private readonly accessibilityService = inject(AccessibilityPreferenceService);                                     // Motion-Präferenz für barrierefreie Sprachwechsel.
  private readonly languageSignal = signal<StudioLanguage>(this.readInitialLanguage());                               // Interner Sprachzustand.
  private readonly transition = new DocumentTransition(this.document, 'dcr-language-is-switching', 420);              // Begrenzter globaler Wechsel.
  readonly language = computed<StudioLanguage>(/** Liest den internen Sprachzustand. */ () => this.languageSignal()); // Aktive Sprache.
  readonly content = computed<StudioContent>(
    /** Wählt Inhalte zur aktiven Sprache. */ () => STUDIO_TRANSLATIONS[this.language()],
  ); // Vollständiger Content der aktiven Sprache.

  /** Synchronisiert Sprache mit Dokument und Persistenz. */
  constructor() {
    effect(this.synchronizeLanguage.bind(this));
  }

  /** Synchronisiert die aktive Sprache mit Dokument und Persistenz. */
  private synchronizeLanguage(): void {
    /**
     * Aktive Sprache zum Zeitpunkt der reaktiven Synchronisierung.
     */
    const language = this.language();
    this.document.documentElement.lang = language;
    this.persistLanguage(language);
  }

  /** Wechselt zwischen Deutsch und Englisch mit einem kurzen Content-Slide. */
  toggleLanguage(): void {
    this.startTransition();
    this.languageSignal.update(
      /**
       * Wählt die jeweils andere unterstützte Sprache.
       * @param language Aktuelle Sprache vor dem Wechsel.
       */
      (language) => (language === 'de' ? 'en' : 'de'),
    );
  }

  /**
   * Setzt die Sprache explizit.
   * @param language Gewünschte Sprache der Oberfläche.
   */
  setLanguage(language: StudioLanguage): void {
    if (language === this.language()) {
      return;
    }

    this.startTransition();
    this.languageSignal.set(language);
  }

  /** Ermittelt die initiale Sprache aus der Persistenz; ohne Auswahl gilt Deutsch. */
  private readInitialLanguage(): StudioLanguage {
    try {
      /**
       * Gespeicherte Sprachauswahl der aktuellen Browserinstanz.
       */
      const savedLanguage = this.document.defaultView?.localStorage.getItem(this.storageKey);

      if (savedLanguage === 'de' || savedLanguage === 'en') {
        return savedLanguage;
      }
    } catch {
      // Ohne Persistenz bleibt Deutsch der definierte Fallback.
    }

    return 'de';
  }

  /** Startet den Darstellungswechsel nur bei erlaubter Bewegung. */
  private startTransition(): void {
    if (!this.accessibilityService.reducesMotion()) this.transition.start();
  }

  /**
   * Persistiert die Sprache defensiv.
   * @param language Gewünschte Sprache der Oberfläche.
   */
  private persistLanguage(language: StudioLanguage): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, language);
    } catch {
      // Sprache bleibt für die aktuelle Session aktiv.
    }
  }
}
