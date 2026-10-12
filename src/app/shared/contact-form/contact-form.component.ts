/* src/app/shared/contact-form/contact-form.component.ts */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ContactApiService, ContactRequest } from '../../core/services/contact-api.service';
import { LanguageService } from '../../core/services/language.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { apiErrorMessage, fieldErrorMessage } from './contact-form.errors';
import { ContactFormField, createContactForm } from './contact-form.factory';
import { createContactFieldIds } from './contact-form.ids';
import { createContactPayload } from './contact-form.payload';

const MINIMUM_FILL_TIME_MS = 1200; // Bestehende Mindestdauer vor dem ersten Submit.

/** Verbindet das typisierte Kontaktformular mit lokalisierter Rückmeldung und API-Versand. */
@Component({
  selector: 'dcr-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ActionButtonComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  readonly idPrefix = input('contact'); // Eindeutiger DOM-Präfix der Formularinstanz.
  readonly compact = input(false);      // Kompakte Darstellung in begrenzten Flächen.
  readonly ids = computed(
    /** Leitet die vorhandenen Feld-IDs aus dem aktuellen Instanzpräfix ab. */
    () => createContactFieldIds(this.idPrefix()),
  ); // IDs für Felder, Labels und Fehlermeldungen.
  private readonly api = inject(ContactApiService);                                     // API-Transport des Kontaktformulars.
  private readonly languageService = inject(LanguageService);                           // Sprache und lokalisierte Texte.
  private readonly router = inject(Router);                                             // Navigation nach erfolgreichem Versand.
  private readonly createdAt = performance.now();                                       // Initialer Zeitpunkt der Formularinstanz.
  private readonly formElement = viewChild<ElementRef<HTMLFormElement>>('formElement'); // Formular-Root zur Fokussteuerung.
  readonly content = computed(
    /** Liest Labels und Fehlertexte in der aktiven Sprache. */
    () => this.languageService.content().contactForm,
  ); // Lokalisierter Formularinhalt.
  readonly website = signal('');         // Instanzgebundener Honeypot-Wert für die API.
  readonly isSubmitting = signal(false); // Noch laufender Submit einschließlich Navigation.
  readonly status = signal('');          // Formularweite Rückmeldung.
  readonly form = createContactForm();   // Typisierte Feldgruppe mit vorhandenen Validierungsregeln.

  /**
   * Aktualisiert ausschließlich den Honeypot aus dem nativen Eingabeereignis.
   * @param event Auslösendes Eingabeereignis.
   */
  updateHoneypot(event: Event): void {
    /**
     * Ziel des nativen Eingabeereignisses.
     */
    const input = event.target;
    this.website.set(input instanceof HTMLInputElement ? input.value : '');
  }

  /**
   * Meldet Feldfehler erst nach Interaktion oder einem Submit-Versuch.
   * @param field Name des zu prüfenden Formularfelds.
   */
  errorFor(field: ContactFormField): string {
    /**
     * Aktueller Validierungs- und Interaktionszustand des Felds.
     */
    const control = this.form.controls[field];
    if (!(control.touched || this.form.touched) || !control.errors) return '';
    return fieldErrorMessage(field, control, this.content().errors);
  }

  /** Startet ausschließlich einen vorbereiteten und noch nicht laufenden Submit. */
  async submit(): Promise<void> {
    if (this.isSubmitting() || !this.prepareSubmission()) return;
    /**
     * Validierter und normalisierter API-Body der aktuellen Formularwerte.
     */
    const payload = this.createPayload();
    if (!payload) {
      this.status.set(this.content().errors.validation);
      return;
    }
    await this.sendPayload(payload);
  }

  /** Prüft den bisherigen Submit-Zeitpunkt und die vorhandene Feldvalidierung. */
  private prepareSubmission(): boolean {
    this.form.markAllAsTouched();
    this.status.set('');
    if (this.isTooEarly()) {
      this.status.set(this.content().errors.tooFast);
      return false;
    }
    if (this.form.invalid) {
      this.focusFirstInvalidControl();
      return false;
    }
    return true;
  }

  /** Prüft die bestehende Eingabedauer für einen regulären Formular-Submit. */
  private isTooEarly(): boolean {
    return !this.website().trim() && performance.now() - this.createdAt < MINIMUM_FILL_TIME_MS;
  }

  /** Liefert ausschließlich die für den API-Body vorgesehenen Formularwerte. */
  private createPayload(): ContactRequest | null {
    return createContactPayload(this.form.getRawValue(), {
      website: this.website(),
      language: this.languageService.language(),
      topics: this.content().topics,
    });
  }

  /**
   * Hält den Submit-Zustand bis zur API-Antwort und anschließenden Navigation offen.
   * @param payload Validierter und normalisierter API-Body.
   */
  private async sendPayload(payload: ContactRequest): Promise<void> {
    this.isSubmitting.set(true);
    try {
      await this.api.send(payload);
      this.resetSubmittedForm();
      await this.router.navigate(['/danke']);
    } catch (error) {
      this.status.set(apiErrorMessage(error, this.content().errors));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /** Setzt nach bestätigtem Versand die Formularwerte und den Honeypot zurück. */
  private resetSubmittedForm(): void {
    this.form.reset({ name: '', email: '', company: '', topic: '', message: '', privacy: false });
    this.website.set('');
  }

  /** Plant den Fokus auf das erste fehlerhafte Feld nach dem Rendern seiner ARIA-Zustände. */
  private focusFirstInvalidControl(): void {
    requestAnimationFrame(this.focusInvalidControl.bind(this));
  }

  /** Fokussiert ausschließlich das erste bereits als ungültig markierte Formularfeld. */
  private focusInvalidControl(): void {
    this.formElement()?.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }
}
