/**
 * @file Referenzübersicht der Studio-Website.
 * @description Trennt technische Case Studies klar von realisierten Kundenprojekten und kapselt deren horizontale Showcase-Interaktion.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { HorizontalWheelScrollDirective } from '../../shared/horizontal-wheel-scroll.directive';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { SignalDividerComponent } from '../../shared/signal-divider/signal-divider.component';

/** Referenzseite mit getrennten Case Studies und Kundenprojekten. */
@Component({
  selector: 'dcr-references-page',
  standalone: true,
  imports: [HorizontalWheelScrollDirective, SectionHeadingComponent, SignalDividerComponent],
  templateUrl: './references-page.component.html',
  styleUrl: './references-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesPageComponent {
  /** Aktuelle Sprache. */
  private readonly languageService = inject(LanguageService);

  /** SEO-Metadaten der Route. */
  private readonly seoService = inject(SeoService);

  /** Sprachabhängiger Content. */
  readonly content = computed(() => this.languageService.content());

  /** ARIA-Label der Technologie-Tags. */
  readonly techStackLabel = computed(() => this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack');

  /** Tastaturhinweis des horizontalen Kundenprojekt-Tracks. */
  readonly horizontalHint = computed(() => this.languageService.language() === 'de'
    ? 'Horizontal scrollbare Kundenprojekte. Mausrad oder Pfeiltasten verwenden.'
    : 'Horizontally scrollable client projects. Use the mouse wheel or arrow keys.');

  constructor() {
    effect(() => this.seoService.setPage(this.content().referencesPage.seo, '/referenzen'));
  }
}
