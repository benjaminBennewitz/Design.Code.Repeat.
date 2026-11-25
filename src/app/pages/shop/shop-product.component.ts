/** @file Produktdetail mit Medienansicht, Kaufbox und Bundle-Verweisen. */

import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SHOP_COPY } from './shop-copy.data';
import { ShopInformationComponent } from './shop-information.component';
import { SHOP_PRODUCTS, ShopProduct, formatShopPrice, shopImage } from './shop-products.data';

type MediaView = 'cover' | 'layout' | 'video';

/** Zeigt die lokalisierte Produktvorschau und verlinkt deren nächsten Schritt. */
@Component({
  selector: 'dcr-shop-product',
  imports: [RouterLink, ShopInformationComponent],
  templateUrl: './shop-product.component.html',
  styleUrls: ['./shop.scss', './shop-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SHOP_COPY[this.language()]);
  readonly product = computed(() => SHOP_PRODUCTS.find(item => item.slug === this.params().get('slug')));
  readonly hasVideo = computed(() => this.product()?.slug === 'year-grid');
  readonly views = computed<readonly MediaView[]>(() => this.hasVideo() ? ['cover', 'layout', 'video'] : ['cover', 'layout']);
  readonly view = linkedSignal<ShopProduct | undefined, MediaView>({
    source: this.product,
    computation: () => 'layout',
  });
  readonly bundle = SHOP_PRODUCTS.find(item => item.category === 'bundle');
  readonly bundleProducts = SHOP_PRODUCTS.filter(item => item.category === 'indesign' && item.cents > 0);
  readonly savings = computed(() => this.bundleProducts.reduce((sum, product) => sum + product.cents, 0) - (this.bundle?.cents ?? 0));
  readonly image = shopImage;
  readonly price = formatShopPrice;

  constructor() {
    effect(() => {
      const product = this.product();
      this.seo.setPage({
        title: `${product?.name ?? this.ui().missing} | DCR//TOOLS`,
        description: product?.copy[this.language()].description ?? this.ui().missingText,
        keywords: product ? [product.name, 'InDesign', 'DCR Tools'] : [],
      }, product ? `/shop/product/${product.slug}` : '/shop', 'website', 'noindex, follow');
    });
  }

  /** Wechselt in der vergrößerten Ansicht zwischen den beiden Standbildern. */
  toggleImage(): void {
    this.view.update(view => view === 'cover' ? 'layout' : 'cover');
  }

  /** Bedient die Medienwechsel per Pfeiltaste, solange der Dialog geöffnet ist. */
  onGalleryKey(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    this.toggleImage();
  }
}
