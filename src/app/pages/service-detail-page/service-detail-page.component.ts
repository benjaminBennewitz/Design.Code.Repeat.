/* src/app/pages/service-detail-page/service-detail-page.component.ts */
/**
 * @file Wiederverwendbare Leistungsdetailseite.
 * @description Rendert jede Service-URL aus dem zentralen Content-Modell und vermeidet sechs nahezu identische Komponenten.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { SeoPageContent, StudioService } from '../../core/models/studio.models';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ManagedServiceComponent } from './managed/managed-service.component';
import { managedServiceContent } from './managed/content/managed-service-content';

/** Dynamische Detailseite für Web, Software, Design, Care, Hosting und E-Mail. */
@Component({
  selector: 'dcr-service-detail-page',
  standalone: true,
  imports: [ManagedServiceComponent],
  templateUrl: './service-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailPageComponent {
  private readonly languageService = inject(LanguageService); // Aktive Sprache und zentrale Inhalte.
  private readonly seoService = inject(SeoService);           // SEO-Metadaten der aktuellen Route.
  private readonly route = inject(ActivatedRoute);            // Routenparameter der aktuellen Seite.
  private readonly router = inject(Router);                   // Navigation zu Leistungen und Referenzen.
  private readonly slug = toSignal(
    this.route.paramMap.pipe(
      map(
        /**
         * Aktueller Slug bleibt auch bei Navigation zwischen Service-Details reaktiv.
         * @param params Aktuelle Parameter der Detailroute.
         */
        (params: ParamMap) => params.get('slug') ?? '',
      ),
    ),
    { initialValue: '' },
  ); // Aktueller Slug bleibt auch bei Navigation zwischen Service-Details reaktiv.
  readonly service = computed(
    /** Gefundener Service der aktiven Sprache. */
    () =>
      this.languageService.content().services.find(
        /**
         * Gefundener Service der aktiven Sprache.
         * @param item Eintrag aus dem zentralen Content.
         */
        (item: StudioService) => item.slug === this.slug(),
      ),
  ); // Gefundener Service der aktiven Sprache.
  readonly managedContent = computed(
    /** Wählt zusätzliche Kundeninformationen der aktiven Leistung und Sprache. */
    () => managedServiceContent(this.languageService.language(), this.slug()),
  ); // Einheitliche Darstellung mit eigenen Informationen für jede Leistung.
  /** Verbindet ausgewählte Leistung, Redirect und lokalisierte SEO-Ausgabe. */
  constructor() {
    effect(this.updateServicePage.bind(this));
  }

  /** Leitet unbekannte Slugs um und aktualisiert die SEO-Ausgabe einer gültigen Leistung. */
  private updateServicePage(): void {
    /**
     * Zur aktuellen Route gefundene Leistung der aktiven Sprache.
     */
    const service = this.service();
    if (!service && this.slug()) {
      void this.router.navigateByUrl('/leistungen');
      return;
    }
    if (service) this.setServiceSeo(service);
  }

  /**
   * Überträgt die vorhandenen leistungsabhängigen SEO-Daten.
   * @param service Zur aktuellen Route gefundene Leistung.
   */
  private setServiceSeo(service: StudioService): void {
    /**
     * Titel, Beschreibung und Keywords der ausgewählten Leistung.
     */
    const seo: SeoPageContent = {
      title: `${service.title} | Design. Code. Repeat.`,
      description: service.summary,
      keywords: [service.title, ...service.features.slice(0, 4)],
    };
    this.seoService.setPage(seo, `/leistungen/${service.slug}`);
  }

}
