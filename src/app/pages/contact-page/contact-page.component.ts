/* src/app/pages/contact-page/contact-page.component.ts */
/**
 * @file Eigenständige Kontaktseite.
 * @description Bietet eine klare Projektanfrage außerhalb der Startseite und wiederverwendet das sichere Formular unverändert.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Kontaktseite. */
@Component({
  selector: 'dcr-contact-page',
  standalone: true,
  imports: [TextRevealDirective, ContactFormComponent, SectionHeadingComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  private readonly languageService = inject(LanguageService); // Aktive Sprache und zentrale Inhalte.
  private readonly seoService = inject(SeoService);           // SEO-Metadaten der aktuellen Route.
  readonly content = computed(
    /** Inhalte in der aktiven Sprache. */
    () => this.languageService.content(),
  ); // Inhalte in der aktiven Sprache.

  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().contactPage.seo, '/kontakt'),
    );
  }
}
