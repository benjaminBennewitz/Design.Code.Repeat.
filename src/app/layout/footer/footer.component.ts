/**
 * @file Interaktiver Studio-Footer.
 * @description Bündelt Sitemap und Rechtliches in einer großen typografischen Footer-Bühne mit kontrollierten Slides.
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../core/services/cookie-consent.service';
import { LanguageService } from '../../core/services/language.service';

/** Globaler, interaktiver Footer. */
@Component({
  selector: 'dcr-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  /** Aktuelle Sprache und Website-Inhalte. */
  private readonly languageService = inject(LanguageService);

  /** Privacy-Control-Zustand für den Cookie-Einstellungslink. */
  readonly cookieConsentService = inject(CookieConsentService);

  /** Sprachabhängiger Gesamtcontent. */
  readonly content = computed(() => this.languageService.content());

  /** Aktives Footer-Panel: Sitemap oder Rechtliches. */
  readonly activePanel = signal<number>(0);

  /** Aktuelles Jahr. */
  readonly year = new Date().getFullYear();

  /** Sprachabhängige Footer-Steuertexte. */
  readonly ui = computed(() => this.languageService.language() === 'de'
    ? {
        previous: 'Vorheriger Footer-Bereich',
        next: 'Nächster Footer-Bereich',
        panelLabel: 'Footer-Bereich',
        sitemap: 'Sitemap',
        legal: 'Rechtliches',
        cookie: 'Cookie-Einstellungen',
        notice: 'Impressum',
        privacy: 'Datenschutz',
        home: 'Start',
        process: 'Prozess',
        faq: 'FAQ',
        portfolio: 'Portfolio',
        social: 'Social',
      }
    : {
        previous: 'Previous footer section',
        next: 'Next footer section',
        panelLabel: 'Footer section',
        sitemap: 'Sitemap',
        legal: 'Legal',
        cookie: 'Cookie settings',
        notice: 'Legal notice',
        privacy: 'Privacy',
        home: 'Home',
        process: 'Process',
        faq: 'FAQ',
        portfolio: 'Portfolio',
        social: 'Social',
      });

  /** Aktiviert den vorherigen Panel-Index zyklisch. */
  previousPanel(): void {
    this.activePanel.update((current) => (current + 1) % 2);
  }

  /** Aktiviert den nächsten Panel-Index zyklisch. */
  nextPanel(): void {
    this.activePanel.update((current) => (current + 1) % 2);
  }
}
