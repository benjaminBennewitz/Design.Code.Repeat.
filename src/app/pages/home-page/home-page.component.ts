/**
 * @file Startseite der Studio-Website.
 * @description Orchestriert Leistungen, Managed Hosting, Referenzen, Prozess, FAQ und Kontakt als kommerziellen Überblick.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { TerminalPanelComponent } from '../../shared/terminal-panel/terminal-panel.component';

/** Studio-Landingpage mit klarer Conversion-Hierarchie. */
@Component({
  selector: 'dcr-home-page',
  standalone: true,
  imports: [RouterLink, ActionButtonComponent, ContactFormComponent, SectionHeadingComponent, TerminalPanelComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly content = computed(() => this.languageService.content());
  readonly techStackLabel = computed(() => this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack');

  /** Aktualisiert SEO bei Sprachwechseln. */
  constructor() {
    effect(() => this.seoService.setPage(this.content().home.seo, '/'));
  }
}
