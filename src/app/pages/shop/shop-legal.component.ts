/** @file Öffentliche Rechtstext-Entwürfe der Shop-Vorschau. */

import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SHOP_LEGAL_COPY } from './shop-legal.data';

@Component({
  selector: 'dcr-shop-legal',
  imports: [RouterLink],
  templateUrl: './shop-legal.component.html',
  styleUrls: ['./shop.scss', './shop-legal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopLegalComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly routeData = toSignal(this.route.data, { requireSync: true });
  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SHOP_LEGAL_COPY[this.language()]);
  readonly isNotice = computed(() => this.routeData()['kind'] === 'notice');
  readonly title = computed(() => this.isNotice() ? this.ui().notice : this.ui().terms);
  readonly sections = computed(() => this.isNotice() ? this.ui().noticeSections : this.ui().termsSections);

  /** Verhindert die Indexierung der noch nicht freigegebenen Rechtstexte. */
  constructor() {
    effect(() => this.seo.setPage({
      title: `${this.title()} | DCR//TOOLS`,
      description: this.ui().draft,
      keywords: [],
    }, this.isNotice() ? '/shop/widerrufsbelehrung' : '/shop/agb', 'website', 'noindex, follow'));
  }
}
