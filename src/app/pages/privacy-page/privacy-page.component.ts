/** @file Datenschutzhinweise der Studio-Website. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({ selector: 'dcr-privacy-page', standalone: true, templateUrl: './privacy-page.component.html', styleUrl: './privacy-page.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class PrivacyPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly cookieConsentService = inject(CookieConsentService);
  readonly content = computed(() => this.languageService.content().legal);
  readonly cookieSettingsLabel = computed(() => this.languageService.language() === 'de' ? 'Cookie-Einstellungen öffnen' : 'Open cookie settings');
  constructor() { effect(() => this.seoService.setPage(this.content().privacySeo, '/datenschutz')); }
}
