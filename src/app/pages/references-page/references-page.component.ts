/* src/app/pages/references-page/references-page.component.ts */
/**
 * @file Referenzübersicht der Studio-Website.
 * @description Trennt technische Case Studies klar von realisierten Kundenprojekten und kapselt deren horizontale Showcase-Interaktion.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
} from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ScrollRevealService } from '../../core/services/scroll-reveal.service';
import { RouterLink } from '@angular/router';
import { HorizontalWheelScrollDirective } from '../../shared/horizontal-wheel-scroll.directive';
import { HorizontalScrollHintComponent } from '../../shared/horizontal-scroll-hint/horizontal-scroll-hint.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Referenzseite mit getrennten Case Studies und Kundenprojekten. */
@Component({
  selector: 'dcr-references-page',
  standalone: true,
  imports: [
    TextRevealDirective,
    RouterLink,
    HorizontalWheelScrollDirective,
    HorizontalScrollHintComponent,
    SectionHeadingComponent,
  ],
  templateUrl: './references-page.component.html',
  styleUrl: './references-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesPageComponent implements AfterViewInit {
  private readonly languageService = inject(LanguageService);                               // Aktuelle Sprache.
  private readonly seoService = inject(SeoService);                                         // SEO-Metadaten der Route.
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement; // Hostelement für die einmaligen View-Reveal-Animationen der Case Studies.
  private readonly destroyRef = inject(DestroyRef);                                         // Lifecycle-Handle zum Entfernen ausstehender Reveals.
  private readonly scrollReveal = inject(ScrollRevealService);                              // Gemeinsame Scroll-Auslösung für Text, Inhalte und Case-Study-Karten.
  readonly unpublishedLinkLabel = computed(
    /** Sprachabhängiger Content. */
    () => (this.languageService.language() === 'de' ? 'Noch kein öffentlicher Link' : 'No public link yet'),
  ); // Sprachabhängiger Content.
  readonly content = computed(
    /** Inhalte in der aktiven Sprache. */
    () => this.languageService.content(),
  ); // Inhalte in der aktiven Sprache.
  readonly techStackLabel = computed(
    /** ARIA-Label der Technologie-Tags. */
    () => (this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack'),
  ); // ARIA-Label der Technologie-Tags.
  readonly horizontalHint = computed(
    /** Tastaturhinweis des horizontalen Kundenprojekt-Tracks. */
    () =>
      this.languageService.language() === 'de'
        ? 'Horizontal scrollbare Kundenprojekte. Mausrad oder Pfeiltasten verwenden.'
        : 'Horizontally scrollable client projects. Use the mouse wheel or arrow keys.',
  ); // Tastaturhinweis des horizontalen Kundenprojekt-Tracks.

  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().referencesPage.seo, '/referenzen'),
    );
  }

  /** Initialisiert die perspektivische Reveal-Animation nach dem ersten Rendern. */
  ngAfterViewInit(): void {
    /**
     * Nach dem Rendern verfügbare Case-Study-Karten.
     */
    const cards = Array.from(this.hostElement.querySelectorAll<HTMLElement>('[data-case-study-card]'));
    this.hostElement.classList.add('is-reveal-ready');
    /**
     * Gerenderte Karte mit einer instanzgebundenen Reveal-Aufräumfunktion.
     */
    for (const card of cards) {
      /**
       * Lifecycle-Aufräumfunktion des aktuellen Karten-Reveals.
       */
      const cleanup = this.scrollReveal.register(card, card.classList.add.bind(card.classList, 'is-revealed'));
      this.destroyRef.onDestroy(cleanup);
    }
  }
}
