/**
 * @file Startseite der Studio-Website.
 * @description Orchestriert Leistungen, Managed Hosting, Referenzen, Prozess, FAQ und Kontakt als kommerziellen Überblick.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { HorizontalWheelScrollDirective } from '../../shared/horizontal-wheel-scroll.directive';
import { HorizontalScrollHintComponent } from '../../shared/horizontal-scroll-hint/horizontal-scroll-hint.component';
import { InfiniteMarqueeComponent } from '../../shared/infinite-marquee/infinite-marquee.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

/** Studio-Landingpage mit klarer Conversion-Hierarchie. */
@Component({
  selector: 'dcr-home-page',
  standalone: true,
  imports: [RouterLink, ActionButtonComponent, ContactFormComponent, HorizontalWheelScrollDirective, HorizontalScrollHintComponent, InfiniteMarqueeComponent, SectionHeadingComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  readonly content = computed(() => this.languageService.content());
  readonly techStackLabel = computed(() => this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack');
  readonly marqueeLabel = computed(() => this.languageService.language() === 'de' ? 'Leistungen und Arbeitsweise' : 'Services and process');
  readonly servicesMarqueeItems = computed(() => this.content().services.map((service) => service.shortTitle));
  readonly processMarqueeItems = computed(() => [...this.content().process].reverse().map((step) => `${step.index} ${step.title}`));
  readonly heroClaimLines = computed(() => this.languageService.language() === 'de'
    ? [
        { before: 'DIGITALE', after: 'PRODUKTE' },
        { before: 'DIE', after: 'ARBEIT' },
        { before: 'ERLED', after: 'IGEN' },
      ] as const
    : [
        { before: 'DIGITAL', after: 'PRODUCTS' },
        { before: 'THAT', after: 'GET' },
        { before: 'WORK', after: 'DONE' },
      ] as const);
  readonly heroClaimLabel = computed(() => this.languageService.language() === 'de'
    ? 'Digitale Produkte, die Arbeit erledigen.'
    : 'Digital products that get work done.');

  /** Zufällig verteilte, pro Slot unterschiedliche Bewegungsmuster der Hero-Symbole. */
  readonly heroSymbolAnimations = this.createHeroSymbolAnimations();

  /** Index des aktuell geöffneten FAQ-Eintrags. -1 bedeutet: alle geschlossen. */
  readonly openFaqIndex = signal<number>(0);

  /** Aktualisiert SEO bei Sprachwechseln. */
  constructor() {
    effect(() => this.seoService.setPage(this.content().home.seo, '/'));
  }

  /**
   * Hält das FAQ als exklusives Accordion: Beim Öffnen eines Eintrags werden
   * alle übrigen Einträge über den zentralen Signalzustand geschlossen.
   */
  onFaqToggle(index: number, event: Event): void {
    const details = event.currentTarget as HTMLDetailsElement | null;
    if (!details) return;

    if (details.open) {
      this.openFaqIndex.set(index);
      return;
    }

    if (this.openFaqIndex() === index) {
      this.openFaqIndex.set(-1);
    }
  }

  /**
   * Verteilt die verfügbaren Symbolanimationen je Hero-Slot zufällig. Innerhalb
   * eines Slots werden keine Bewegungsmuster doppelt vergeben.
   */
  private createHeroSymbolAnimations(): readonly (readonly HeroSymbolAnimation[])[] {
    const animations: readonly HeroSymbolAnimation[] = ['flip-shrink', 'rotate-cw', 'rotate-ccw', 'flip-up'];

    return Array.from({ length: 3 }, () => {
      const shuffled = [...animations];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const targetIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]];
      }

      return shuffled.slice(0, 3);
    });
  }

}

/** Unterstützte Bewegungsmuster für ein zyklisch wechselndes Hero-Symbol. */
type HeroSymbolAnimation = 'flip-shrink' | 'rotate-cw' | 'rotate-ccw' | 'flip-up';
