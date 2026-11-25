/** @file Lokale Vorschau der zweistufigen elektronischen Widerrufsfunktion. */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { SHOP_LEGAL_COPY } from './shop-legal.data';

type WithdrawalField = 'name' | 'contract' | 'email';

@Component({
  selector: 'dcr-shop-withdrawal',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './shop-withdrawal.component.html',
  styleUrls: ['./shop.scss', './shop-legal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopWithdrawalComponent {
  private readonly builder = inject(FormBuilder).nonNullable;
  private readonly seo = inject(SeoService);
  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SHOP_LEGAL_COPY[this.language()]);
  readonly submitted = signal(false);
  readonly validated = signal(false);
  readonly fields: readonly WithdrawalField[] = ['name', 'contract', 'email'];
  readonly form = this.builder.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    contract: ['', [Validators.required, Validators.maxLength(2000)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
  });

  /** Setzt die Metadaten der nicht indexierten Formularvorschau. */
  constructor() {
    effect(() => this.seo.setPage({
      title: `${this.ui().withdraw} | DCR//TOOLS`,
      description: this.ui().demo,
      keywords: [],
    }, '/shop/widerruf', 'website', 'noindex, follow'));
  }

  /** Prüft die Eingaben ohne Speicherung oder Übermittlung. */
  fieldError(field: WithdrawalField): string {
    const control = this.form.controls[field];
    if (!this.submitted() && !control.touched) return '';
    if (!control.value.trim()) return this.ui().required;
    if (control.hasError('email')) return this.ui().invalidEmail;
    return '';
  }

  /** Simuliert ausschließlich die lokale Formularprüfung. */
  confirm(formElement: HTMLFormElement): void {
    this.submitted.set(true);
    this.validated.set(false);
    const invalid = this.fields.find(field => !!this.fieldError(field) || this.form.controls[field].invalid);
    if (invalid) {
      const control = formElement.elements.namedItem(invalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    this.validated.set(true);
  }

  /** Entfernt sämtliche Beispieldaten aus dem lokalen Formular. */
  reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.validated.set(false);
  }
}
