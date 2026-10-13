/* src/app/pages/home-page/home-page.component.ts */
import { HERO_CLAIM_LINES } from './hero-claim-lines.data';
/**
 * @file Startseite der Studio-Website.
 * @description Orchestriert Leistungen, Managed Hosting, Referenzen, Prozess, FAQ und Kontakt als kommerziellen Überblick.
 */

import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component';
import { HorizontalWheelScrollDirective } from '../../shared/horizontal-wheel-scroll.directive';
import { HorizontalScrollHintComponent } from '../../shared/horizontal-scroll-hint/horizontal-scroll-hint.component';
import { InfiniteMarqueeComponent } from '../../shared/infinite-marquee/infinite-marquee.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Studio-Landingpage mit klarer Conversion-Hierarchie. */
@Component({
  selector: 'dcr-home-page',
  standalone: true,
  imports: [
    TextRevealDirective,
    RouterLink,
    ActionButtonComponent,
    ContactFormComponent,
    HorizontalWheelScrollDirective,
    HorizontalScrollHintComponent,
    InfiniteMarqueeComponent,
    SectionHeadingComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly languageService = inject(LanguageService);                                // Aktive Sprache und zentrale Inhalte.
  private readonly seoService = inject(SeoService);                                          // SEO-Metadaten der aktuellen Route.
  readonly anchorTarget = toSignal(inject(ActivatedRoute).fragment, { initialValue: null }); // Materialisiert bei Sprunglinks auch die vorausgehenden Abschnitte für stabile Geometrie.
  readonly faqPageLabel = computed(
    /** Liest die Beschriftung der vollständigen zentralen Fragenübersicht. */
    () => this.languageService.language() === 'de' ? 'Alle Fragen durchsuchen' : 'Search all questions',
  ); // Direkter Einstieg in die neue zentrale FAQ-Route.
  readonly content = computed(
    /** Inhalte in der aktiven Sprache. */
    () => this.languageService.content(),
  ); // Inhalte in der aktiven Sprache.
  readonly techStackLabel = computed(
    /** Lokalisierte Beschriftung der Technologie-Tags. */
    () => (this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack'),
  ); // Lokalisierte Beschriftung der Technologie-Tags.
  readonly marqueeLabel = computed(
    /** Lokalisierte Beschriftung des Leistungs-Marquees. */
    () => (this.languageService.language() === 'de' ? 'Leistungen' : 'Services'),
  ); // Lokalisierte Beschriftung des Leistungs-Marquees.
  readonly servicesMarqueeItems = computed(
    /** Kurztitel der Leistungen für das Marquee. */
    () =>
      this.content().services.map(
        /**
         * Kurztitel der Leistungen für das Marquee.
         * @param service Leistung aus dem zentralen Content.
         */
        (service) => service.shortTitle,
      ),
  ); // Kurztitel der Leistungen für das Marquee.
  readonly processHeadingTitle = computed(
    /** Definiert einen sprachlich korrekten Ersatzumbruch für schmale Prozessüberschriften. */
    () => this.content().home.process.title.replace('Überraschungen', 'Über\u00adraschungen'),
  ); // Definiert einen sprachlich korrekten Ersatzumbruch für schmale Prozessüberschriften.
  readonly heroClaimLines = computed(
    /** Lokalisierte Zeilen des Hero-Claims. */
    () => HERO_CLAIM_LINES[this.languageService.language()],
  ); // Lokalisierte Zeilen des Hero-Claims.
  readonly heroClaimLabel = computed(
    /** Zugängliche Gesamtbeschriftung des Hero-Claims. */
    () =>
      this.languageService.language() === 'de'
        ? 'Digitale Produkte, die Arbeit erledigen.'
        : 'Digital products that get work done.',
  ); // Zugängliche Gesamtbeschriftung des Hero-Claims.
  readonly heroSymbolAnimations = this.createHeroSymbolAnimations(); // Zufällig verteilte, pro Slot unterschiedliche Bewegungsmuster der Hero-Symbole.
  readonly openFaqIndex = signal<number>(0);                         // Index des aktuell geöffneten FAQ-Eintrags. -1 bedeutet: alle geschlossen.

  /** Aktualisiert SEO bei Sprachwechseln. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().home.seo, '/'),
    );
  }

  /**
   * Schaltet einen FAQ-Eintrag um und hält das Accordion exklusiv.
   * @param index Position des ausgewählten Eintrags.
   */
  toggleFaq(index: number): void {
    this.openFaqIndex.update(
      /**
       * Öffnet den gewählten FAQ-Eintrag oder schließt den bereits geöffneten Eintrag.
       * @param currentIndex Bisher geöffneter FAQ-Eintrag.
       */
      (currentIndex) => (currentIndex === index ? -1 : index),
    );
  }

  /** Verteilt drei unterschiedliche Bewegungsmuster pro Hero-Slot. */
  private createHeroSymbolAnimations(): readonly (readonly HeroSymbolAnimation[])[] {
    return Array.from({ length: 3 }, this.shuffledSymbolAnimations.bind(this));
  }

  /** Mischt die verfügbaren Bewegungsmuster mit dem vorhandenen Fisher-Yates-Verfahren. */
  private shuffledSymbolAnimations(): readonly HeroSymbolAnimation[] {
    /**
     * Veränderbare Kopie der vier verfügbaren Bewegungsmuster.
     */
    const shuffled: HeroSymbolAnimation[] = ['flip-shrink', 'rotate-cw', 'rotate-ccw', 'flip-up'];
    /**
     * Rückwärts durchlaufene Position des aktuellen Mischschritts.
     */
    for (let index = shuffled.length - 1; index > 0; index -= 1) this.swapSymbolAnimation(shuffled, index);
    return shuffled.slice(0, 3);
  }

  /**
   * Vertauscht ein Bewegungsmuster mit einer zufälligen vorherigen Position.
   * @param animations Veränderbare Bewegungsmuster des aktuellen Hero-Slots.
   * @param index Aktuelle Position des Fisher-Yates-Schritts.
   */
  private swapSymbolAnimation(animations: HeroSymbolAnimation[], index: number): void {
    /**
     * Zufällig gewählte Position einschließlich des aktuellen Index.
     */
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [animations[index], animations[targetIndex]] = [animations[targetIndex], animations[index]];
  }
}

/** Unterstützte Bewegungsmuster für ein zyklisch wechselndes Hero-Symbol. */
type HeroSymbolAnimation = 'flip-shrink' | 'rotate-cw' | 'rotate-ccw' | 'flip-up';
