/**
 * @file Wiederverwendbare Leistungsdetailseite.
 * @description Rendert jede Service-URL aus dem zentralen Content-Modell und vermeidet sechs nahezu identische Komponenten.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SeoPageContent, StudioService } from '../../core/models/studio.models';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TerminalPanelComponent } from '../../shared/terminal-panel/terminal-panel.component';

/** Dynamische Detailseite für Web, Software, Design, Care, Hosting und E-Mail. */
@Component({
  selector: 'dcr-service-detail-page',
  standalone: true,
  imports: [RouterLink, TerminalPanelComponent],
  templateUrl: './service-detail-page.component.html',
  styleUrl: './service-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailPageComponent {
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Aktueller Slug bleibt auch bei Navigation zwischen Service-Details reaktiv. */
  private readonly slug = toSignal(this.route.paramMap.pipe(map((params: ParamMap) => params.get('slug') ?? '')), { initialValue: '' });

  /** Gefundener Service der aktiven Sprache. */
  readonly service = computed(() => this.languageService.content().services.find((item: StudioService) => item.slug === this.slug()));

  /** Lokalisierter Backlink. */
  readonly backLabel = computed(() => this.languageService.language() === 'de' ? 'Alle Leistungen' : 'All services');

  /** Lokalisierte Abschnittsüberschriften der Detailansicht. */
  readonly capabilitiesLabel = computed(() => this.languageService.language() === 'de' ? 'Leistungsumfang' : 'Capabilities');
  readonly includedLabel = computed(() => this.languageService.language() === 'de' ? 'Enthalten' : 'Included');

  /** Lokalisierte CTA-Subline. */
  readonly contactHint = computed(() => this.languageService.language() === 'de'
    ? 'Scope, vorhandener Stand und Betriebsanforderungen werden vor einem verbindlichen Angebot gemeinsam geklärt.'
    : 'Scope, current state and operational requirements are clarified together before a binding proposal.');

  constructor() {
    effect(() => {
      const service = this.service();

      if (!service && this.slug()) {
        void this.router.navigateByUrl('/leistungen');
        return;
      }

      if (service) {
        const seo: SeoPageContent = {
          title: `${service.title} | Design. Code. Repeat.`,
          description: service.summary,
          keywords: [service.title, ...service.features.slice(0, 4)],
        };
        this.seoService.setPage(seo, `/leistungen/${service.slug}`);
      }
    });
  }
}
