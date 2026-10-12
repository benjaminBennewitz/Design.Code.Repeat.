/* src/app/pages/services-page/services-page.component.ts */
import { OPS_MODULES } from './ops-modules.data';
import { SERVICE_INDEX_LABELS } from './service-index-labels.data';
/**
 * @file Leistungsübersicht der Studio-Website.
 * @description Bündelt Preisrahmen, interaktive Leistungs-Quickinfos, Betreuung und Managed Operations auf einer Route.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { AmbientFieldComponent } from '../../shared/ambient-field/ambient-field.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { SignalDividerComponent } from '../../shared/signal-divider/signal-divider.component';
import { DitheringShaderComponent } from '../../shared/dithering-shader/dithering-shader.component';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Leistungsseite mit kompakten In-Page-Details statt unnötiger Unterseiten-Navigation. */
@Component({
  selector: 'dcr-services-page',
  standalone: true,
  imports: [
    TextRevealDirective,
    ActionButtonComponent,
    RouterLink,
    AmbientFieldComponent,
    SectionHeadingComponent,
    SignalDividerComponent,
    DitheringShaderComponent,
  ],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent {
  private readonly languageService = inject(LanguageService); // Aktuelle Sprache und Inhalte.
  private readonly seoService = inject(SeoService);           // SEO-Metadaten der Route.
  private readonly route = inject(ActivatedRoute);            // Aktuelle Route für die Leistungsauswahl per Query-Parameter und ältere Fragmentlinks.
  private readonly router = inject(Router);                   // Erkennt auch erneute Navigationen zur unveränderten Quicklink-URL.
  private readonly destroyRef = inject(DestroyRef);           // Lifecycle-Handle für die Routen-Subscription.
  readonly content = computed(
    /** Vollständiger sprachabhängiger Content. */
    () => this.languageService.content(),
  ); // Vollständiger sprachabhängiger Content.
  readonly selectedServiceIndex = signal<number>(0); // Aktuell ausgewähltes Modul im Service-Console-Index.
  readonly selectedService = computed(
    /** Aktuell ausgewählter Service. */
    () => this.content().services[this.selectedServiceIndex()] ?? this.content().services[0],
  ); // Aktuell ausgewählter Service.
  readonly indexLabels = computed(
    /** Übersetzte UI-Texte für das interaktive Quickinfo-Modul. */
    () => SERVICE_INDEX_LABELS[this.languageService.language()],
  ); // Übersetzte UI-Texte für das interaktive Quickinfo-Modul.
  readonly serviceTitles = computed(
    /** Erlaubt deutsche Umbrüche nur an der Wortgrenze vor „Entwicklung“. */
    () =>
      this.content().services.map(
        /**
         * Erlaubt deutsche Umbrüche nur an der Wortgrenze vor „Entwicklung“.
         * @param service Leistung aus dem zentralen Content.
         */
        (service) => service.title.replace('entwicklung', '\u00adentwicklung'),
      ),
  ); // Erlaubt deutsche Umbrüche nur an der Wortgrenze vor „Entwicklung“.
  readonly opsModules = computed(
    /** Inhaltliche Bausteine der Betriebsvisualisierung, ohne simulierte Live-Messwerte. */
    () => OPS_MODULES[this.languageService.language()],
  ); // Inhaltliche Bausteine der Betriebsvisualisierung, ohne simulierte Live-Messwerte.

  /** Verbindet die Seite mit ihrer lokalisierten SEO-Ausgabe. */
  constructor() {
    effect(
      /** Aktualisiert die SEO-Ausgabe beim Wechsel der Sprache. */
      () => this.seoService.setPage(this.content().servicesPage.seo, '/leistungen'),
    );

    this.selectServiceFromRoute();
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      /**
       * Übernimmt nach Navigation die angeforderte Leistungsauswahl.
       * @param event Aktuelles Router-Ereignis.
       */
      (event) => {
        if (event instanceof NavigationEnd) {
          this.selectServiceFromRoute();
        }
      },
    );
  }

  /**
   * Aktiviert ein Service-Modul ohne Route oder Seitenwechsel.
   * @param index Position des ausgewählten Eintrags.
   */
  selectService(index: number): void {
    if (index < 0 || index >= this.content().services.length) {
      return;
    }

    this.selectedServiceIndex.set(index);
  }

  /** Übernimmt eine vorhandene Leistungsauswahl ohne Veränderung des Scrollziels. */
  private selectServiceFromRoute(): void {
    /**
     * Index der über Query-Parameter oder älteres Fragment angeforderten Leistung.
     */
    const index = this.serviceIndexFor(this.requestedServiceSlug());
    if (index >= 0) this.selectService(index);
  }

  /** Liefert den Leistungs-Slug mit der bisherigen Priorität des Query-Parameters. */
  private requestedServiceSlug(): string | null {
    /**
     * Aktuelles Fragment für ältere Leistungs-Quicklinks.
     */
    const fragment = this.route.snapshot.fragment;
    return (
      this.route.snapshot.queryParamMap.get('service') ??
      (fragment?.startsWith('service-') ? fragment.slice('service-'.length) : null)
    );
  }

  /**
   * Sucht die angeforderte Leistung in den Inhalten der aktiven Sprache.
   * @param slug Über Query-Parameter oder älteres Fragment angeforderter Slug.
   */
  private serviceIndexFor(slug: string | null): number {
    return this.content().services.findIndex(
      /**
       * Vergleicht den Leistungseintrag mit dem angeforderten Slug.
       * @param service Leistung aus dem zentralen Content.
       */
      (service) => service.slug === slug,
    );
  }
}
