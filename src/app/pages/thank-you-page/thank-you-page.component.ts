/** @file Bestätigungsseite nach erfolgreichem Kontakt-Submit. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';

@Component({ selector: 'dcr-thank-you-page', standalone: true, imports: [RouterLink], templateUrl: './thank-you-page.component.html', styleUrl: './thank-you-page.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ThankYouPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly content = computed(() => this.languageService.content().thankYou);
  constructor() { effect(() => this.seoService.setNoIndex(this.content().title, this.content().text, '/danke')); }
}
