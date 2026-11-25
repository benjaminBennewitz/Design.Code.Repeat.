/** @file Zentrales Supportformular mit lokaler E-Mail-Vorbereitung. */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SHOP_PRODUCTS } from './shop-products.data';
import { SHOP_PACKAGES } from './shop-packages.data';
import { SUPPORT_COPY, SUPPORT_TYPES, SupportType } from './shop-support.data';

/** Erstellt einen E-Mail-Entwurf, bis die Shop-API verfügbar ist. */
@Component({
  selector: 'dcr-shop-support',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './shop-support.component.html',
  styleUrls: ['./shop.scss', './shop-support.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopSupportComponent {
  private readonly builder = inject(FormBuilder).nonNullable;
  private readonly seo = inject(SeoService);
  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap, { requireSync: true });
  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SUPPORT_COPY[this.language()]);
  readonly products = SHOP_PRODUCTS;
  readonly types = SUPPORT_TYPES;
  readonly submitted = signal(false);
  readonly draft = signal('');
  readonly form = this.builder.group({
    type: this.builder.control<SupportType>('help'),
    product: '',
    name: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    version: ['', Validators.maxLength(40)],
    software: ['', Validators.maxLength(100)],
    os: '',
    order: ['', Validators.maxLength(100)],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
    steps: ['', Validators.maxLength(1000)],
    error: ['', Validators.maxLength(500)],
  });
  readonly type = toSignal(this.form.controls.type.valueChanges, { initialValue: 'help' as SupportType });
  readonly technical = computed(() => this.type() === 'bug' || this.type() === 'help');
  readonly transaction = computed(() => this.type() === 'order' || this.type() === 'download');

  /** Übernimmt ausschließlich bekannte Produkte und Anfragearten aus der URL. */
  constructor() {
    effect(() => {
      const params = this.params();
      const product = this.products.find(item => item.slug === params.get('product'));
      const type = this.types.find(item => item === params.get('type')) ?? 'help';
      const version = params.get('version') ?? '';
      this.form.patchValue({ type, product: product?.slug ?? '', version: product && /^[a-zA-Z0-9._-]{1,40}$/.test(version) ? version : SHOP_PACKAGES[product?.slug ?? '']?.version ?? '' });
      this.draft.set('');
    });
    effect(() => this.seo.setPage({ title: `${this.ui().title} | DCR//TOOLS`, description: this.ui().intro, keywords: [] }, '/shop/support'));
  }

  /** Ergänzt die bekannte Paketversion bei einem manuellen Produktwechsel. */
  updateProduct(slug: string): void {
    this.form.controls.version.setValue(SHOP_PACKAGES[slug]?.version ?? '');
    this.draft.set('');
  }

  /** Liefert eine lokalisierte Meldung für ungültige Pflichtfelder. */
  fieldError(field: 'name' | 'email' | 'message'): string {
    const control = this.form.controls[field];
    if (!this.submitted() && !control.touched) return '';
    if (!control.value.trim()) return this.ui().required;
    if (control.hasError('email')) return this.ui().invalidEmail;
    return control.invalid ? this.ui().invalid : '';
  }

  /** Validiert die Eingaben und erzeugt einen lokalen, noch ungesendeten E-Mail-Entwurf. */
  prepare(formElement: HTMLFormElement): void {
    this.submitted.set(true);
    this.draft.set('');
    const invalid = (['name', 'email', 'message'] as const).find(field => this.fieldError(field));
    if (invalid || this.form.invalid) {
      const control = invalid ? formElement.elements.namedItem(invalid) : formElement.querySelector('.ng-invalid');
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    const value = this.form.getRawValue();
    const ui = this.ui();
    const product = this.products.find(item => item.slug === value.product);
    const lines = [
      `${ui.type}: ${ui.types[value.type]}`,
      `${ui.product}: ${product?.name[this.language()] ?? ui.noProduct}`,
      `${ui.name}: ${value.name.trim()}`,
      `${ui.email}: ${value.email.trim()}`,
    ];
    if (this.technical()) {
      lines.push(`${ui.version}: ${value.version.trim() || ui.unknown}`, `${ui.software}: ${value.software.trim() || ui.unknown}`, `${ui.os}: ${value.os || ui.unknown}`);
    }
    if (this.transaction() && value.order.trim()) lines.push(`${ui.order}: ${value.order.trim()}`);
    lines.push('', value.message.trim());
    if (value.type === 'bug') {
      if (value.steps.trim()) lines.push('', `${ui.steps}:`, value.steps.trim());
      if (value.error.trim()) lines.push('', `${ui.error}:`, value.error.trim());
    }
    const subject = `${ui.subject} – ${ui.types[value.type]}${product ? ` / ${product.name[this.language()]}` : ''}`;
    this.draft.set(`mailto:kontakt@design-code-repeat.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`);
  }
}
