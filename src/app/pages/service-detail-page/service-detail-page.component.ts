/* src/app/pages/service-detail-page/service-detail-page.component.ts */
/**
 * @file Wiederverwendbare Leistungsdetailseite.
 * @description Rendert jede Service-URL aus dem zentralen Content-Modell und vermeidet sechs nahezu identische Komponenten.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { InternalContentLink, SeoPageContent, StudioReference, StudioService } from '../../core/models/studio.models';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TerminalPanelComponent } from '../../shared/terminal-panel/terminal-panel.component';
import { TextRevealDirective } from '../../shared/text-reveal.directive';

/** Dynamische Detailseite für Web, Software, Design, Care, Hosting und E-Mail. */
@Component({
  selector: 'dcr-service-detail-page',
  standalone: true,
  imports: [TextRevealDirective, RouterLink, TerminalPanelComponent],
  templateUrl: './service-detail-page.component.html',
  styleUrl: './service-detail-page.component.scss',
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
  readonly backLabel = computed(
    /** Lokalisierter Backlink. */
    () => (this.languageService.language() === 'de' ? 'Alle Leistungen' : 'All services'),
  ); // Lokalisierter Backlink.
  readonly capabilitiesLabel = computed(
    /** Lokalisierte Abschnittsüberschriften der Detailansicht. */
    () => (this.languageService.language() === 'de' ? 'Leistungsumfang' : 'Capabilities'),
  ); // Lokalisierte Abschnittsüberschriften der Detailansicht.
  readonly includedLabel = computed(
    /** Lokalisierte Überschrift der enthaltenen Leistungen. */
    () => (this.languageService.language() === 'de' ? 'Enthalten' : 'Included'),
  ); // Lokalisierte Überschrift der enthaltenen Leistungen.
  readonly contactHint = computed(
    /** Lokalisierte CTA-Subline. */
    () =>
      this.languageService.language() === 'de'
        ? 'Scope, vorhandener Stand und Betriebsanforderungen werden vor einem verbindlichen Angebot gemeinsam geklärt.'
        : 'Scope, current state and operational requirements are clarified together before a binding proposal.',
  ); // Lokalisierte CTA-Subline.
  readonly relatedServices = computed(
    /** Ergänzende Leistungen aus dem zentralen Content. */
    () =>
      this.languageService.content().services.filter(
        /**
         * Prüft die konfigurierte Ergänzung zur aktuell ausgewählten Leistung.
         * @param item Leistung aus dem zentralen Content.
         */
        (item) => (RELATED_SERVICE_SLUGS[this.slug()] ?? []).includes(item.slug),
      ),
  ); // Ergänzende Leistungen aus dem zentralen Content.
  readonly relatedLabel = computed(
    /** Lokalisierte Überschrift der ergänzenden Leistungen. */
    () => (this.languageService.language() === 'de' ? 'Passend zu dieser Leistung' : 'Related to this service'),
  ); // Lokalisierte Überschrift der ergänzenden Leistungen.
  readonly processLabel = computed(
    /** Lokalisierte Beschriftung des Prozess-Verweises. */
    () => (this.languageService.language() === 'de' ? 'So läuft ein Projekt ab' : 'See the project process'),
  ); // Lokalisierte Beschriftung des Prozess-Verweises.
  readonly exampleLink = computed(this.referenceExample.bind(this)); // Praktisches Beispiel passend zur angebotenen Leistung.

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

  /** Liefert den vorhandenen internen Beispiel-Link für die ausgewählte Leistung. */
  private referenceExample(): InternalContentLink | null {
    /**
     * Passende technische Referenz für Software oder UI/UX.
     */
    const reference = this.exampleReference();
    if (reference?.internalRoute) return { route: reference.internalRoute, label: reference.name, fragment: undefined };
    return this.slug() === 'webentwicklung'
      ? {
          route: '/referenzen',
          label: this.languageService.content().referencesPage.deliveredHeading.title,
          fragment: 'kundenprojekte',
        }
      : null;
  }

  /** Sucht die bisherige Beispielreferenz für Softwareentwicklung oder UI/UX. */
  private exampleReference(): StudioReference | undefined {
    /**
     * Zur aktuellen Leistung konfigurierte technische Beispielreferenz.
     */
    const referenceSlug =
      this.slug() === 'softwareentwicklung' ? 'intranet' : this.slug() === 'ui-ux-design' ? 'design-archive' : null;
    return this.languageService.content().references.find(
      /**
       * Findet die zur Leistung konfigurierte technische Referenz.
       * @param item Referenz aus dem zentralen Content.
       */
      (item) => item.slug === referenceSlug,
    );
  }
}

const RELATED_SERVICE_SLUGS: Record<string, readonly string[]> = {
  webentwicklung: ['ui-ux-design', 'wartung'],
  softwareentwicklung: ['managed-hosting', 'wartung'],
  'ui-ux-design': ['webentwicklung'],
  wartung: ['managed-hosting'],
  'managed-hosting': ['wartung', 'email'],
  email: ['managed-hosting'],
}; // Vorhandene Zuordnung ergänzender Leistungen.
