/* src/app/pages/thank-you-page/thank-you-page.component.ts */
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SystemPageLinksComponent } from '../../shared/system-page/system-page-links.component';
import { SYSTEM_PAGE_UI } from '../../shared/system-page/system-page-ui.data';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Bestätigungsseite mit farbiger Empfangsgrafik und direkten internen Navigationszielen. */
@Component({
  selector: 'dcr-thank-you-page',
  standalone: true,
  imports: [TextRevealDirective, SystemPageLinksComponent],
  templateUrl: './thank-you-page.component.html',
  styleUrl: './thank-you-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouPageComponent {
  private readonly languageService = inject(LanguageService); // Sprache und vorhandener Bestätigungstext.
  private readonly seoService = inject(SeoService); // Bestehende noindex-Ausgabe der Danke-Seite.
  readonly content = computed(
    /** Liest den bestehenden Bestätigungstext der aktiven Sprache. */
    () => this.languageService.content().thankYou,
  ); // Zentrale Bestätigungstexte und SEO-Titel.
  readonly ui = computed(
    /** Liest die lokalisierten Steuertexte der farbigen Bestätigung. */
    () => SYSTEM_PAGE_UI[this.languageService.language()].thankYou,
  ); // Lokalisierte Überschrift und grafische Statusbeschriftungen.

  /** Synchronisiert die vorhandene SEO-Ausgabe mit der aktuellen Sprache. */
  constructor() {
    effect(this.updateSeo.bind(this));
  }

  /** Erhält die bestehende noindex-Ausgabe der Bestätigungsroute. */
  private updateSeo(): void {
    this.seoService.setNoIndex(this.content().title, this.content().text, '/danke');
  }
}
