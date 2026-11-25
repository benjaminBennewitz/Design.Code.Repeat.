/** @file Lokale Vorschau des Gast-Checkouts mit reaktiver Formularvalidierung. */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SHOP_COPY } from './shop-copy.data';
import { SHOP_PRODUCTS, formatShopPrice, shopImage } from './shop-products.data';

type BillingField = 'given' | 'family' | 'email' | 'street' | 'postal' | 'city';

/** Simuliert die Eingabe und leitet ausschließlich die Produktauswahl weiter. */
@Component({
  selector: 'dcr-shop-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './shop-checkout.component.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCheckoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly builder = inject(FormBuilder).nonNullable;
  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SHOP_COPY[this.language()]);
  readonly product = computed(() => SHOP_PRODUCTS.find(item => item.slug === this.params().get('slug')));
  readonly submitted = signal(false);
  readonly image = shopImage;
  readonly price = formatShopPrice;
  readonly fields: ReadonlyArray<{ key: BillingField; autocomplete: string; type: 'text' | 'email' }> = [
    { key: 'given', autocomplete: 'given-name', type: 'text' },
    { key: 'family', autocomplete: 'family-name', type: 'text' },
    { key: 'email', autocomplete: 'email', type: 'email' },
    { key: 'street', autocomplete: 'street-address', type: 'text' },
    { key: 'postal', autocomplete: 'postal-code', type: 'text' },
    { key: 'city', autocomplete: 'address-level2', type: 'text' },
  ];
  readonly form = this.builder.group({
    customer: this.builder.control<'private' | 'business'>('private'),
    company: '',
    given: ['', Validators.required],
    family: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: ['', Validators.required],
    postal: ['', Validators.required],
    city: ['', Validators.required],
  });
  readonly customer = toSignal(this.form.controls.customer.valueChanges, { initialValue: 'private' });

  constructor() {
    effect(() => this.seo.setPage({
      title: `${this.ui().checkout} | DCR//TOOLS`,
      description: this.ui().demo,
      keywords: [],
    }, '/shop', 'website', 'noindex, nofollow'));
  }

  /** Füllt fiktive Rechnungsdaten für einen schnellen Testlauf ein. */
  fillExample(): void {
    this.form.patchValue({
      company: 'Musterstudio', given: 'Mia', family: 'Muster', email: 'mia@example.org',
      street: 'Musterstraße 12', postal: '12345', city: 'Musterstadt',
    });
  }

  /** Zeigt die jeweilige Feldmeldung erst nach einem Absendeversuch. */
  fieldError(key: BillingField | 'company'): string {
    if (!this.submitted()) return '';
    const control = this.form.controls[key];
    if (!control.value.trim()) return this.ui().required;
    if (control.hasError('email')) return this.ui().invalidEmail;
    return '';
  }

  /**
   * Prüft die Beispieldaten und öffnet anschließend den fiktiven Bestellstatus.
   * @param formElement Eingabeformular für die Fokussierung des ersten Fehlers.
   */
  submit(formElement: HTMLFormElement): void {
    const product = this.product();
    if (!product?.cents) return;

    this.submitted.set(true);
    const invalidField = this.fields.find(field => this.fieldError(field.key))?.key;
    const invalidCompany = this.customer() === 'business' && this.fieldError('company');
    if (invalidCompany || invalidField) {
      const control = formElement.elements.namedItem(invalidCompany ? 'company' : invalidField ?? '');
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    void this.router.navigate(['/shop/order', product.slug]);
  }
}
