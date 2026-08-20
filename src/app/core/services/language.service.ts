/**
 * @file Sprachverwaltung der Studio-Website.
 * @description Synchronisiert DE/EN per Signal mit LocalStorage, HTML-lang und einem kurzen Interface-Übergang.
 */

import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { STUDIO_TRANSLATIONS } from '../data/studio-content';
import { StudioContent, StudioLanguage } from '../models/studio.models';
import { AccessibilityPreferenceService } from './accessibility-preference.service';

/** Verwaltet die aktive UI-Sprache. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** Persistenzschlüssel mit eigenem Namespace der Studio-Anwendung. */
  private readonly storageKey = 'dcr-studio-language';

  /** Dokumentreferenz für `lang` und Übergangsklasse. */
  private readonly document = inject(DOCUMENT);

  /** Motion-Präferenz für barrierefreie Sprachwechsel. */
  private readonly accessibilityService = inject(AccessibilityPreferenceService);

  /** Interner Sprachzustand. */
  private readonly languageSignal = signal<StudioLanguage>(this.readInitialLanguage());

  /** Timer zum Entfernen der Übergangsklasse. */
  private transitionTimer?: number;

  /** Aktive Sprache. */
  readonly language = computed<StudioLanguage>(() => this.languageSignal());

  /** Vollständiger Content der aktiven Sprache. */
  readonly content = computed<StudioContent>(() => STUDIO_TRANSLATIONS[this.language()]);

  /** Synchronisiert Sprache mit Dokument und Persistenz. */
  constructor() {
    effect(() => {
      const language = this.language();
      this.document.documentElement.lang = language;
      this.persistLanguage(language);
    });
  }

  /** Wechselt zwischen Deutsch und Englisch mit einem kurzen Content-Slide. */
  toggleLanguage(): void {
    this.startTransition();
    this.languageSignal.update((language: StudioLanguage) => language === 'de' ? 'en' : 'de');
  }

  /** Setzt die Sprache explizit. */
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
      const savedLanguage = this.document.defaultView?.localStorage.getItem(this.storageKey);

      if (savedLanguage === 'de' || savedLanguage === 'en') {
        return savedLanguage;
      }
    } catch {
      // Ohne Persistenz bleibt Deutsch der definierte Fallback.
    }

    return 'de';
  }

  /** Startet den globalen Textwechsel nur bei erlaubter Motion. */
  private startTransition(): void {
    const windowRef = this.document.defaultView;
    const root = this.document.documentElement;

    if (!windowRef || this.accessibilityService.reducesMotion()) {
      return;
    }

    root.classList.remove('dcr-language-is-switching');
    void root.offsetWidth;
    root.classList.add('dcr-language-is-switching');

    if (this.transitionTimer) {
      windowRef.clearTimeout(this.transitionTimer);
    }

    this.transitionTimer = windowRef.setTimeout(() => {
      root.classList.remove('dcr-language-is-switching');
      this.transitionTimer = undefined;
    }, 420);
  }

  /** Persistiert die Sprache defensiv. */
  private persistLanguage(language: StudioLanguage): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, language);
    } catch {
      // Sprache bleibt für die aktuelle Session aktiv.
    }
  }
}
