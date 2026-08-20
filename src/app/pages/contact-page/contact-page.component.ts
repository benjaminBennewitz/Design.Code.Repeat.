/**
 * @file Eigenständige Kontaktseite.
 * @description Bietet eine klare Projektanfrage außerhalb der Startseite und wiederverwendet das sichere Formular unverändert.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { TerminalPanelComponent } from '../../shared/terminal-panel/terminal-panel.component';

/** Kontaktseite. */
@Component({
  selector: 'dcr-contact-page',
  standalone: true,
  imports: [ContactFormComponent, SectionHeadingComponent, TerminalPanelComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly content = computed(() => this.languageService.content());

  constructor() {
    effect(() => this.seoService.setPage(this.content().contactPage.seo, '/kontakt'));
  }
}
