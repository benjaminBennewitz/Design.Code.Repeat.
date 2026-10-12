/* src/app/pages/not-found-page/not-found-page.component.ts */
/** @file 404-Seite. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

@Component({
  selector: 'dcr-not-found-page',
  standalone: true,
  imports: [TextRevealDirective, RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  private readonly languageService = inject(LanguageService); // Aktive Sprache und zentrale Inhalte.
  private readonly seoService = inject(SeoService);           // SEO-Metadaten der aktuellen Route.
  readonly content = computed(
    /** Inhalte in der aktiven Sprache. */
    () => this.languageService.content().notFound,
  ); // Inhalte in der aktiven Sprache.
  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setNoIndex(this.content().title, this.content().text, '/404'),
    );
  }
}
