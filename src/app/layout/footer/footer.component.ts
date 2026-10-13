/* src/app/layout/footer/footer.component.ts */
/**
 * @file Interaktiver Studio-Footer.
 * @description Bündelt Sitemap und Rechtliches in einer großen typografischen Footer-Bühne mit kontrollierten Slides.
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FOOTER_UI } from './footer-ui.data';
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
  private readonly languageService = inject(LanguageService);                                                          // Aktuelle Sprache und Website-Inhalte.
  private readonly router = inject(Router);                                                                            // Router für direkte Links zu den vorhandenen Leistungsdetailseiten.
  readonly cookieConsentService = inject(CookieConsentService);                                                        // Privacy-Control-Zustand für den Cookie-Einstellungslink.
  readonly content = computed(/** Sprachabhängiger Gesamtcontent. */ () => this.languageService.content());            // Sprachabhängiger Gesamtcontent.
  readonly activePanel = signal<number>(0);                                                                            // Aktives Footer-Panel: Sitemap oder Rechtliches.
  readonly year = new Date().getFullYear();                                                                            // Aktuelles Jahr.
  readonly ui = computed(/** Sprachabhängige Footer-Steuertexte. */ () => FOOTER_UI[this.languageService.language()]); // Sprachabhängige Footer-Steuertexte.

  /**
   * Navigiert auch bei identischer URL erneut; modifizierte Klicks bleiben native Links.
   * @param event Auslösendes Klick- oder Router-Ereignis.
   * @param slug Gewählter Leistungsbereich.
   */
  openService(event: MouseEvent, slug: string): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    void this.router.navigate(['/leistungen', slug], {
      onSameUrlNavigation: 'reload',
    });
  }

  /** Aktiviert zyklisch das jeweils andere der beiden Footer-Panels. */
  private advancePanel(): void {
    this.activePanel.update(
      /**
       * Wählt den anderen Index der beiden Footer-Panels.
       * @param current Aktueller Panel-Index.
       */
      (current) => (current + 1) % 2,
    );
  }

  /** Aktiviert den vorherigen Panel-Index zyklisch. */
  previousPanel(): void {
    this.advancePanel();
  }

  /** Aktiviert den nächsten Panel-Index zyklisch. */
  nextPanel(): void {
    this.advancePanel();
  }
}
