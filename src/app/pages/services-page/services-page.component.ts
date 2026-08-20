/**
 * @file Leistungsübersicht der Studio-Website.
 * @description Bündelt Preisrahmen, interaktive Leistungs-Quickinfos, Betreuung und Managed Operations auf einer Route.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { AmbientFieldComponent } from '../../shared/ambient-field/ambient-field.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { SignalDividerComponent } from '../../shared/signal-divider/signal-divider.component';
import { DitheringShaderComponent } from '../../shared/dithering-shader/dithering-shader.component';
import { SystemGridComponent } from '../../shared/system-grid/system-grid.component';

/** Leistungsseite mit kompakten In-Page-Details statt unnötiger Unterseiten-Navigation. */
@Component({
  selector: 'dcr-services-page',
  standalone: true,
  imports: [
    ActionButtonComponent,
    AmbientFieldComponent,
    SectionHeadingComponent,
    SignalDividerComponent,
    DitheringShaderComponent,
    SystemGridComponent,
  ],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent {
  /** Aktuelle Sprache und Inhalte. */
  private readonly languageService = inject(LanguageService);

  /** SEO-Metadaten der Route. */
  private readonly seoService = inject(SeoService);

  /** Vollständiger sprachabhängiger Content. */
  readonly content = computed(() => this.languageService.content());

  /** Aktuell ausgewähltes Modul im Service-Console-Index. */
  readonly selectedServiceIndex = signal<number>(0);

  /** Aktuell ausgewählter Service. */
  readonly selectedService = computed(() => this.content().services[this.selectedServiceIndex()] ?? this.content().services[0]);

  /** Übersetzte UI-Texte für das interaktive Quickinfo-Modul. */
  readonly indexLabels = computed(() => this.languageService.language() === 'de'
    ? {
        eyebrow: 'service.index // 06 module',
        title: 'Leistung auswählen. Quickinfo statt Unterseite.',
        highlights: 'Highlights',
        price: 'Einstieg',
        contact: 'Projekt dazu besprechen',
        selector: 'Leistungsmodul auswählen',
      }
    : {
        eyebrow: 'service.index // 06 modules',
        title: 'Choose a service. Quick info instead of another page.',
        highlights: 'Highlights',
        price: 'Starting at',
        contact: 'Discuss this project',
        selector: 'Choose service module',
      });

  /** Kontextblock der großen Maintenance-Systemfläche. */
  readonly careSystemAside = computed(() => {
    const careService = this.content().services.find((service) => service.slug === 'wartung') ?? this.content().services[3];

    return {
      eyebrow: careService.kicker,
      title: careService.title,
      text: careService.summary,
      meta: careService.price,
    };
  });

  /** Drei Care-Modelle für die wiederkehrende Systemflächen-Section. */
  readonly careSystemPanels = computed(() => this.content().carePlans.map((plan, index) => ({
    eyebrow: `CARE::0${index + 1}`,
    title: plan.name,
    text: plan.text,
    meta: plan.price,
    details: plan.features,
  })));

  /** Übersetzte Pipeline-Texte der Managed-Ops-Visualisierung. */
  readonly opsLabels = computed(() => this.languageService.language() === 'de'
    ? ['Deploy', 'SSL', 'Monitor', 'Backup', 'Restore', 'Mail']
    : ['Deploy', 'SSL', 'Monitor', 'Backup', 'Restore', 'Mail']);

  constructor() {
    effect(() => this.seoService.setPage(this.content().servicesPage.seo, '/leistungen'));
  }

  /** Aktiviert ein Service-Modul ohne Route oder Seitenwechsel. */
  selectService(index: number): void {
    if (index < 0 || index >= this.content().services.length) {
      return;
    }

    this.selectedServiceIndex.set(index);
  }
}
