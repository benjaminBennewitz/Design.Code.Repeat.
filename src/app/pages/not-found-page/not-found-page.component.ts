/** @file 404-Seite. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';

@Component({ selector: 'dcr-not-found-page', standalone: true, imports: [RouterLink], templateUrl: './not-found-page.component.html', styleUrl: './not-found-page.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class NotFoundPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly content = computed(() => this.languageService.content().notFound);
  constructor() { effect(() => this.seoService.setNoIndex(this.content().title, this.content().text, '/404')); }
}
