/* src/app/pages/privacy-page/privacy-page.component.ts */
/** @file Datenschutzhinweise der Studio-Website. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { CookieConsentService } from '../../core/services/cookie-consent.service';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

@Component({
  selector: 'dcr-privacy-page',
  standalone: true,
  imports: [TextRevealDirective],
  templateUrl: './privacy-page.component.html',
  styleUrl: './privacy-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPageComponent {
  private readonly languageService = inject(LanguageService);   // Aktive Sprache und zentrale Inhalte.
  private readonly seoService = inject(SeoService);             // SEO-Metadaten der aktuellen Route.
  readonly cookieConsentService = inject(CookieConsentService); // Steuerung der lokalen Privacy-Einstellungen.
  readonly content = computed(
    /** Inhalte in der aktiven Sprache. */
    () => this.languageService.content().legal,
  ); // Inhalte in der aktiven Sprache.
  readonly cookieSettingsLabel = computed(
    /** Lokalisierte Beschriftung des Privacy-Triggers. */
    () => (this.languageService.language() === 'de' ? 'Cookie-Einstellungen öffnen' : 'Open cookie settings'),
  ); // Lokalisierte Beschriftung des Privacy-Triggers.
  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().privacySeo, '/datenschutz'),
    );
  }
}
