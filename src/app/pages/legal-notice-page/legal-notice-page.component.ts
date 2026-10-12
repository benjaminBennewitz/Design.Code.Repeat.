/* src/app/pages/legal-notice-page/legal-notice-page.component.ts */
/** @file Impressumsseite mit zentral gepflegten Pflichtangaben. */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

@Component({
  selector: 'dcr-legal-notice-page',
  standalone: true,
  imports: [TextRevealDirective],
  templateUrl: './legal-notice-page.component.html',
  styleUrl: './legal-notice-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNoticePageComponent {
  private readonly languageService = inject(LanguageService); // Aktive Sprache und zentrale Inhalte.
  private readonly seoService = inject(SeoService);           // SEO-Metadaten der aktuellen Route.
  readonly content = computed(
    /** Inhalte in der aktiven Sprache. */
    () => this.languageService.content().legal,
  ); // Inhalte in der aktiven Sprache.
  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().noticeSeo, '/impressum'),
    );
  }
}
