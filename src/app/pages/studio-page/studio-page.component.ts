/* src/app/pages/studio-page/studio-page.component.ts */
/**
 * @file Studio-/Über-mich-Seite.
 * @description Erklärt die persönliche Arbeitsstruktur hinter Design. Code. Repeat. mit eigenständigem Hero und wiederverwendbarem Tech-Marquee.
 */

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { InfiniteMarqueeComponent } from '../../shared/infinite-marquee/infinite-marquee.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { SystemGridComponent } from '../../shared/system-grid/system-grid.component';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Studio-Seite. */
@Component({
  selector: 'dcr-studio-page',
  standalone: true,
  imports: [
    TextRevealDirective,
    ScrollRevealDirective,
    RouterLink,
    ActionButtonComponent,
    InfiniteMarqueeComponent,
    SectionHeadingComponent,
    SystemGridComponent,
  ],
  templateUrl: './studio-page.component.html',
  styleUrl: './studio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
  private readonly languageService = inject(LanguageService); // Aktuelle Sprache.
  private readonly seoService = inject(SeoService);           // SEO-Metadaten der Route.
  readonly content = computed(
    /** Sprachabhängiger Content. */
    () => this.languageService.content(),
  ); // Sprachabhängiger Content.
  readonly principlesSystemAside = computed(
    /** Erstes Prinzip als Kontextblock der großen Systemfläche. */
    () => {
      /**
       * Erstes Studio-Prinzip für die große Systemfläche.
       */
      const principle = this.content().studioPage.principles[0];

      return {
        eyebrow: '01 // PRINCIPLE',
        title: principle.title,
        text: principle.text,
      };
    },
  ); // Erstes Prinzip als Kontextblock der großen Systemfläche.
  readonly principlesSystemPanels = computed(
    /** Übrige drei Prinzipien für die wiederkehrenden Sekundärflächen. */
    () =>
      this.content()
        .studioPage.principles.slice(1, 4)
        .map(
          /**
           * Übrige drei Prinzipien für die wiederkehrenden Sekundärflächen.
           * @param principle Prinzip aus den zentralen Studio-Inhalten.
           * @param index Position des ausgewählten Eintrags.
           */
          (principle, index) => ({
            eyebrow: `0${index + 2} // PRINCIPLE`,
            title: principle.title,
            text: principle.text,
          }),
        ),
  ); // Übrige drei Prinzipien für die wiederkehrenden Sekundärflächen.
  readonly stackLabel = computed(
    /** Zugängliche Beschriftung des Tech-Marquees. */
    () => (this.languageService.language() === 'de' ? 'Technologie-Stack' : 'Technology stack'),
  ); // Zugängliche Beschriftung des Tech-Marquees.
  readonly practiceItems = computed(
    /** Ergänzende Begriffe für die zweite Marquee-Spur. */
    () =>
      this.languageService.language() === 'de'
        ? ['Architektur', 'UX', 'Accessibility', 'Performance', 'Security', 'SEO', 'Deployment', 'Monitoring']
        : ['Architecture', 'UX', 'Accessibility', 'Performance', 'Security', 'SEO', 'Deployment', 'Monitoring'],
  ); // Ergänzende Begriffe für die zweite Marquee-Spur.

  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().studioPage.seo, '/studio'),
    );
  }
}
