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
import { HorizontalWheelScrollDirective } from '../../shared/horizontal-wheel-scroll.directive';
import { HorizontalScrollHintComponent } from '../../shared/horizontal-scroll-hint/horizontal-scroll-hint.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { SignalDividerComponent } from '../../shared/signal-divider/signal-divider.component';
import { SystemGridComponent } from '../../shared/system-grid/system-grid.component';

/** Referenzseite mit getrennten Case Studies und Kundenprojekten. */
@Component({
  selector: 'dcr-references-page',
  standalone: true,
  imports: [HorizontalWheelScrollDirective, HorizontalScrollHintComponent, SectionHeadingComponent, SignalDividerComponent, SystemGridComponent],
  templateUrl: './references-page.component.html',
  styleUrl: './references-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesPageComponent implements AfterViewInit {
  /** Aktuelle Sprache. */
  private readonly languageService = inject(LanguageService);

  /** SEO-Metadaten der Route. */
  private readonly seoService = inject(SeoService);

  /** Hostelement für die einmaligen View-Reveal-Animationen der Case Studies. */
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Lifecycle-Handle zum sicheren Trennen des IntersectionObservers. */
  private readonly destroyRef = inject(DestroyRef);

  /** Beobachter für die perspektivische Case-Study-Reveal-Animation. */
  private revealObserver?: IntersectionObserver;

  /** Sprachabhängiger Content. */
  readonly content = computed(() => this.languageService.content());

  /** ARIA-Label der Technologie-Tags. */
  readonly techStackLabel = computed(() => this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack');

  /** Kontextblock der Referenz-Hero-Systemfläche. */
  readonly heroSystemAside = computed(() => ({
    eyebrow: 'CASE STUDIES',
    title: String(this.content().references.length).padStart(2, '0'),
    text: this.content().referencesPage.portfolioHint,
  }));

  /** Direkte Sprungziele zu den ersten drei technischen Case Studies. */
  readonly heroSystemPanels = computed(() => this.content().references.slice(0, 3).map((reference, index) => ({
    eyebrow: `0${index + 1} // ${reference.type}`,
    title: reference.name,
    text: reference.summary,
    meta: reference.year,
    details: reference.stack.slice(0, 3),
    href: `#case-${reference.slug}`,
    actionLabel: this.languageService.language() === 'de'
      ? `Zu ${reference.name} springen`
      : `Jump to ${reference.name}`,
  })));

  /** Tastaturhinweis des horizontalen Kundenprojekt-Tracks. */
  readonly horizontalHint = computed(() => this.languageService.language() === 'de'
    ? 'Horizontal scrollbare Kundenprojekte. Mausrad oder Pfeiltasten verwenden.'
    : 'Horizontally scrollable client projects. Use the mouse wheel or arrow keys.');

  constructor() {
    effect(() => this.seoService.setPage(this.content().referencesPage.seo, '/referenzen'));
    this.destroyRef.onDestroy(() => this.revealObserver?.disconnect());
  }

  /** Initialisiert die perspektivische Reveal-Animation nach dem ersten Rendern. */
  ngAfterViewInit(): void {
    const cards = Array.from(this.hostElement.querySelectorAll<HTMLElement>('[data-case-study-card]'));
    const windowRef = this.hostElement.ownerDocument.defaultView;
    const motionMode = this.hostElement.ownerDocument.documentElement.dataset['motion'];
    const reducedMotion = motionMode === 'reduced'
      || motionMode === 'off'
      || windowRef?.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!cards.length || !windowRef || reducedMotion || !('IntersectionObserver' in windowRef)) {
      cards.forEach((card) => card.classList.add('is-revealed'));
      return;
    }

    this.hostElement.classList.add('is-reveal-ready');
    this.revealObserver = new windowRef.IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    });

    cards.forEach((card) => this.revealObserver?.observe(card));
  }
}
