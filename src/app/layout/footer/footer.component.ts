/**
 * @file Interaktiver Studio-Footer.
 * @description Bündelt Sitemap und Rechtliches in einer großen typografischen Footer-Bühne mit kontrollierten Slides.
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  /** Router für wiederholbare Quicklinks zum gemeinsamen Leistungsanker. */
  private readonly router = inject(Router);

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

  /** Navigiert auch bei identischer URL erneut; modifizierte Klicks bleiben native Links. */
  openService(event: MouseEvent, slug: string): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    void this.router.navigate(['/leistungen'], {
      queryParams: { service: slug },
      fragment: 'service-index',
      onSameUrlNavigation: 'reload',
    });
  }

  /** Aktiviert den vorherigen Panel-Index zyklisch. */
  previousPanel(): void {
    this.activePanel.update((current) => (current + 1) % 2);
  }

  /** Aktiviert den nächsten Panel-Index zyklisch. */
  nextPanel(): void {
    this.activePanel.update((current) => (current + 1) % 2);
  }
}
