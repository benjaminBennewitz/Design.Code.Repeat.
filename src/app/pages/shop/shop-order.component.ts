/** @file Interaktive Vorschau für Überweisung, Freigabe und Downloadstatus. */

import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SHOP_COPY } from './shop-copy.data';
import { SHOP_PRODUCTS, ShopProduct, formatShopPrice, shopImage } from './shop-products.data';

type DemoStatus = 'pending' | 'paid' | 'available' | 'expired' | 'cancelled';

/** Zeigt ausschließlich fiktive Bestellungen für kostenpflichtige Beispielprodukte. */
@Component({
  selector: 'dcr-shop-order',
  imports: [RouterLink],
  templateUrl: './shop-order.component.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopOrderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SHOP_COPY[this.language()]);
  readonly product = computed(() => SHOP_PRODUCTS.find(item => item.slug === this.params().get('slug') && item.cents > 0));
  readonly statuses: readonly DemoStatus[] = ['pending', 'paid', 'available', 'expired', 'cancelled'];
  readonly status = linkedSignal<ShopProduct | undefined, DemoStatus>({
    source: this.product,
    computation: () => 'pending',
  });
  readonly progress = computed(() => this.status() === 'available' || this.status() === 'expired' ? 'download' : 'payment');
  readonly consent = linkedSignal(() => {
    this.status();
    return false;
  });
  readonly acknowledged = linkedSignal(() => {
    this.status();
    return false;
  });
  readonly waiting = linkedSignal(() => {
    this.status();
    return false;
  });
  readonly copyStatus = signal<'copied' | 'copyError' | null>(null);
  readonly reference = 'DCR-DEMO-00001';
  readonly image = shopImage;
  readonly price = formatShopPrice;

  constructor() {
    effect(() => this.seo.setPage({
      title: `${this.ui().order} | DCR//TOOLS`,
      description: this.ui().demo,
      keywords: [],
    }, '/shop', 'website', 'noindex, nofollow'));
  }

  /** Wählt einen fiktiven Zustand unabhängig von einer realen Zahlung. */
  changeStatus(value: string): void {
    const status = this.statuses.find(option => option === value);
    if (!status) return;
    this.copyStatus.set(null);
    this.status.set(status);
  }

  /** Simuliert die vorzeitige Bereitstellung bei beiden gesetzten Bestätigungen. */
  activate(): void {
    if (this.status() === 'paid' && this.consent() && this.acknowledged()) {
      this.changeStatus('available');
    }
  }

  /** Kopiert nur die fiktive Bestellreferenz und meldet das Ergebnis. */
  async copyReference(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.reference);
      this.copyStatus.set('copied');
    } catch {
      this.copyStatus.set('copyError');
    }
  }
}
