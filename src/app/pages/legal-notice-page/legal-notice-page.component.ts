/** @file Impressumsseite mit zentral gepflegten Pflichtangaben. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

@Component({ selector: 'dcr-legal-notice-page', standalone: true, imports: [TextRevealDirective], templateUrl: './legal-notice-page.component.html', styleUrl: './legal-notice-page.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LegalNoticePageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly content = computed(() => this.languageService.content().legal);
  constructor() { effect(() => this.seoService.setPage(this.content().noticeSeo, '/impressum')); }
}
