/**
 * @file Studio-/Über-mich-Seite.
 * @description Erklärt die persönliche Arbeitsstruktur hinter Design. Code. Repeat. mit eigenständigem Hero und wiederverwendbarem Tech-Marquee.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { AmbientFieldComponent } from '../../shared/ambient-field/ambient-field.component';
import { InfiniteMarqueeComponent } from '../../shared/infinite-marquee/infinite-marquee.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { TerminalPanelComponent } from '../../shared/terminal-panel/terminal-panel.component';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';

/** Studio-Seite. */
@Component({
  selector: 'dcr-studio-page',
  standalone: true,
  imports: [ActionButtonComponent, AmbientFieldComponent, InfiniteMarqueeComponent, SectionHeadingComponent, TerminalPanelComponent],
  templateUrl: './studio-page.component.html',
  styleUrl: './studio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
  /** Aktuelle Sprache. */
  private readonly languageService = inject(LanguageService);

  /** SEO-Metadaten der Route. */
  private readonly seoService = inject(SeoService);

  /** Sprachabhängiger Content. */
  readonly content = computed(() => this.languageService.content());

  /** Zugängliche Beschriftung des Tech-Marquees. */
  readonly stackLabel = computed(() => this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack');

  /** Ergänzende Begriffe für die zweite Marquee-Spur. */
  readonly practiceItems = computed(() => this.languageService.language() === 'de'
    ? ['Architektur', 'UX', 'Accessibility', 'Performance', 'Security', 'SEO', 'Deployment', 'Monitoring']
    : ['Architecture', 'UX', 'Accessibility', 'Performance', 'Security', 'SEO', 'Deployment', 'Monitoring']);

  constructor() {
    effect(() => this.seoService.setPage(this.content().studioPage.seo, '/studio'));
  }
}
