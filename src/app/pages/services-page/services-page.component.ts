/**
 * @file Leistungsübersicht der Studio-Website.
 * @description Bündelt Preisrahmen, interaktive Leistungs-Quickinfos, Betreuung und Managed Operations auf einer Route.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { AmbientFieldComponent } from '../../shared/ambient-field/ambient-field.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';
import { SignalDividerComponent } from '../../shared/signal-divider/signal-divider.component';
import { DitheringShaderComponent } from '../../shared/dithering-shader/dithering-shader.component';

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

  /** Aktuelle Route für die Leistungsauswahl per Query-Parameter und ältere Fragmentlinks. */
  private readonly route = inject(ActivatedRoute);

  /** Erkennt auch erneute Navigationen zur unveränderten Quicklink-URL. */
  private readonly router = inject(Router);

  /** Lifecycle-Handle für die Routen-Subscription. */
  private readonly destroyRef = inject(DestroyRef);

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
        title: 'Entwicklung & Design.',
        titleContinuation: 'Betrieb & Betreuung.',
        careContact: 'Betreuung besprechen',
        highlights: 'Highlights',
        price: 'Einstieg',
        contact: 'Projekt dazu besprechen',
        selector: 'Leistungsmodul auswählen',
      }
    : {
        eyebrow: 'service.index // 06 modules',
        title: 'Development & design.',
        titleContinuation: 'Operations & support.',
        careContact: 'Discuss ongoing support',
        highlights: 'Highlights',
        price: 'Starting at',
        contact: 'Discuss this project',
        selector: 'Choose service module',
      });

  /** Erlaubt deutsche Umbrüche nur an der Wortgrenze vor „Entwicklung“. */
  readonly serviceTitles = computed(() => this.content().services.map((service) =>
    service.title.replace('entwicklung', '\u00adentwicklung')));

  /** Inhaltliche Bausteine der Betriebsvisualisierung, ohne simulierte Live-Messwerte. */
  readonly opsModules = computed(() => this.languageService.language() === 'de'
    ? [
        { icon: 'rocket_launch', title: 'Deployment', text: 'Änderungen veröffentlichen' },
        { icon: 'lock', title: 'SSL', text: 'Verbindungen absichern' },
        { icon: 'monitor_heart', title: 'Monitoring', text: 'Probleme früh erkennen' },
        { icon: 'backup', title: 'Backups', text: 'Daten regelmäßig sichern' },
        { icon: 'restore', title: 'Wieder\u00adherstellung', text: 'Im Fehlerfall zurücksetzen' },
        { icon: 'alternate_email', title: 'E-Mail', text: 'Optional ergänzen' },
      ]
    : [
        { icon: 'rocket_launch', title: 'Deployment', text: 'Publish changes' },
        { icon: 'lock', title: 'SSL', text: 'Secure connections' },
        { icon: 'monitor_heart', title: 'Monitoring', text: 'Detect problems early' },
        { icon: 'backup', title: 'Backups', text: 'Save data regularly' },
        { icon: 'restore', title: 'Recovery', text: 'Restore when needed' },
        { icon: 'alternate_email', title: 'Email', text: 'Add optionally' },
      ]);

  constructor() {
    effect(() => this.seoService.setPage(this.content().servicesPage.seo, '/leistungen'));

    this.selectServiceFromRoute();
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.selectServiceFromRoute();
        }
      });
  }

  /** Aktiviert ein Service-Modul ohne Route oder Seitenwechsel. */
  selectService(index: number): void {
    if (index < 0 || index >= this.content().services.length) {
      return;
    }

    this.selectedServiceIndex.set(index);
  }

  /** Trennt die Leistungsauswahl vom Scrollziel und unterstützt ältere Fragmentlinks. */
  private selectServiceFromRoute(): void {
    const fragment = this.route.snapshot.fragment;
    const slug = this.route.snapshot.queryParamMap.get('service')
      ?? (fragment?.startsWith('service-') ? fragment.slice('service-'.length) : null);
    const index = this.content().services.findIndex((service) => service.slug === slug);

    if (index >= 0) {
      this.selectService(index);
    }
  }
}
