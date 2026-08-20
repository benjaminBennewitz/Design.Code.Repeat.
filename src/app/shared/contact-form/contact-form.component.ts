/**
 * @file Sicheres und barrierefreies Kontaktformular.
 * @description Nutzt Reactive Forms für UX-Validierung, whitelisted Payloads, Honeypot und Timing-Heuristik.
 * Die serverseitige Validierung, CSRF-Prüfung und Rate-Limitierung bleiben verbindlich.
 */

import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactTopic } from '../../core/models/studio.models';
import { ContactApiService, ContactRequest } from '../../core/services/contact-api.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { LanguageService } from '../../core/services/language.service';

/** Mindestdauer zwischen Rendering und Submit als einfache Bot-Heuristik. */
const MINIMUM_FILL_TIME_MS = 1200;

/** Erlaubte Kontaktgründe; identisch zum Backend-Enum zu halten. */
const ALLOWED_TOPICS = new Set<ContactTopic>(['website', 'software', 'design', 'maintenance', 'hosting', 'other']);

/** Prüft, ob ein String nach Trimmen eine Mindestlänge besitzt. */
function trimmedLength(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = typeof control.value === 'string' ? control.value : '';
    const length = value.trim().length;
    return length >= min && length <= max ? null : { trimmedLength: { min, max, actual: length } };
  };
}

/** Prüft, ob ein Select-Wert explizit freigegeben wurde. */
function allowedTopic(control: AbstractControl): ValidationErrors | null {
  return ALLOWED_TOPICS.has(control.value as ContactTopic) ? null : { topic: true };
}

/** Kontaktformular mit klarer Trennung zwischen UI-Validierung und Backend-Sicherheitsgrenze. */
@Component({
  selector: 'dcr-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, ActionButtonComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  /** Eindeutiger Präfix für DOM-IDs bei mehreren Formularinstanzen auf derselben Route. */
  readonly idPrefix = input('contact');

  /** Abgeleitete, kollisionsfreie IDs für Labels, Felder und Fehlermeldungen. */
  readonly ids = computed(() => {
    const prefix = this.idPrefix().replace(/[^a-zA-Z0-9_-]/g, '-');

    return {
      website: `${prefix}-website-field`,
      name: `${prefix}-name`,
      nameError: `${prefix}-name-error`,
      email: `${prefix}-email`,
      emailError: `${prefix}-email-error`,
      company: `${prefix}-company`,
      companyError: `${prefix}-company-error`,
      topic: `${prefix}-topic`,
      topicError: `${prefix}-topic-error`,
      message: `${prefix}-message`,
      messageError: `${prefix}-message-error`,
      messageCounter: `${prefix}-message-counter`,
      privacy: `${prefix}-privacy`,
      privacyError: `${prefix}-privacy-error`,
    };
  });
  private readonly api = inject(ContactApiService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly createdAt = performance.now();

  /** Formular-Root für barrierefreie Fokussteuerung. */
  private readonly formElement = viewChild<ElementRef<HTMLFormElement>>('formElement');

  /** Sprachabhängige Labels und Fehlertexte. */
  readonly content = computed(() => this.languageService.content().contactForm);

  /** Unsichtbares Honeypot-Feld; wird bewusst nicht in den Request übernommen. */
  readonly website = signal('');

  /** Requeststatus. */
  readonly isSubmitting = signal(false);

  /** Formularweite Fehlermeldung. */
  readonly status = signal('');

  /** Typisiertes Reactive Form mit expliziten Maximalgrößen. */
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80), trimmedLength(2, 80)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)],
    }),
    topic: new FormControl<ContactTopic | ''>('', {
      nonNullable: true,
      validators: [Validators.required, allowedTopic],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(4000), trimmedLength(20, 4000)],
    }),
    privacy: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  /** Aktualisiert ausschließlich den Honeypot aus einem nativen Event. */
  updateHoneypot(event: Event): void {
    const input = event.target;
    this.website.set(input instanceof HTMLInputElement ? input.value : '');
  }

  /** Liefert eine lokalisierte Feldfehlermeldung erst nach Interaktion oder Submit. */
  errorFor(field: keyof typeof this.form.controls): string {
    const control = this.form.controls[field];

    if (!(control.touched || this.form.touched) || !control.errors) {
      return '';
    }

    if (field === 'email') {
      return this.content().errors.email;
    }

    if (field === 'name') {
      return control.hasError('required') ? this.content().errors.required : this.content().errors.nameLength;
    }

    if (field === 'company') {
      return this.content().errors.companyLength;
    }

    if (field === 'topic') {
      return this.content().errors.required;
    }

    if (field === 'message') {
      if (control.hasError('required')) {
        return this.content().errors.required;
      }
      if (control.hasError('maxlength')) {
        return this.content().errors.messageMaxLength;
      }
      return this.content().errors.messageLength;
    }

    return this.content().errors.privacy;
  }

  /** Sendet nur valide, normalisierte und whitelisted Daten. */
  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.status.set('');

    if (this.website().trim()) {
      // Bots erhalten keine verwertbare Rückmeldung darüber, dass das Honeypot-Feld erkannt wurde.
      await this.router.navigate(['/danke']);
      return;
    }

    if (performance.now() - this.createdAt < MINIMUM_FILL_TIME_MS) {
      this.status.set(this.content().errors.tooFast);
      return;
    }

    if (this.form.invalid) {
      this.focusFirstInvalidControl();
      return;
    }

    const payload = this.createPayload();

    if (!payload) {
      this.status.set(this.content().errors.server);
      return;
    }

    this.isSubmitting.set(true);

    try {
      await this.api.send(payload);
      this.form.reset({ name: '', email: '', company: '', topic: '', message: '', privacy: false });
      await this.router.navigate(['/danke']);
    } catch {
      this.status.set(this.content().errors.server);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /** Erzeugt den Request-Body ohne Honeypot, Checkbox oder zusätzliche DOM-Werte. */
  private createPayload(): ContactRequest | null {
    const raw = this.form.getRawValue();

    if (!ALLOWED_TOPICS.has(raw.topic as ContactTopic)) {
      return null;
    }

    return {
      name: raw.name.trim(),
      email: raw.email.trim().toLowerCase(),
      company: raw.company.trim(),
      topic: raw.topic as ContactTopic,
      message: raw.message.trim(),
    };
  }

  /** Fokussiert das erste fehlerhafte Feld, ohne die Tastaturreihenfolge zu verändern. */
  private focusFirstInvalidControl(): void {
    requestAnimationFrame(() => {
      const form = this.formElement()?.nativeElement;
      const invalidControl = form?.querySelector<HTMLElement>('[aria-invalid="true"]');
      invalidControl?.focus();
    });
  }
}
