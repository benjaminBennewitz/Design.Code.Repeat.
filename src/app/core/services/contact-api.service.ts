/* src/app/core/services/contact-api.service.ts */
/**
 * @file API-Schicht des Kontaktformulars.
 * @description Kapselt CSRF-Handshake, whitelisted Payloads und Fehlerklassifizierung für die zentrale same-origin Infrastructure API.
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Expliziter Request-Body der Infrastructure API. Zusätzliche Formularfelder dürfen nicht übertragen werden. */
export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly website: string;
}

/** Antwort des CSRF-Endpunkts. */
interface CsrfResponse {
  readonly csrfToken: string;
  readonly requestId?: string;
}

/** Erfolgsantwort des Kontakt-Endpunkts. */
interface ContactResponse {
  readonly status: string;
  readonly requestId?: string;
}

/** Fehlerklassen, die die UI ohne technische Backend-Details unterscheiden kann. */
export type ContactApiErrorCode =
  'validation' | 'csrf' | 'payload-too-large' | 'rate-limit' | 'unavailable' | 'server' | 'network' | 'in-progress';

/** Typisierter Fehler der Kontakt-API. */
export class ContactApiError extends Error {
  /**
   * Erstellt einen typisierten Kontaktfehler für die Formularoberfläche.
   * @param code Stabile Fehlerklasse für die Formularoberfläche.
   * @param status Optionaler HTTP-Fehlerstatus.
   */
  constructor(
    readonly code: ContactApiErrorCode,
    readonly status?: number,
  ) {
    super(`Contact API request failed: ${code}`);
    this.name = 'ContactApiError';
  }
}

/** Sendet Kontaktanfragen an die zentrale same-origin Infrastructure API. */
@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);                              // HTTP-Client für den bisherigen API-Transport.
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, ''); // API-Basisadresse ohne abschließenden Slash.
  private readonly endpoint = `${this.apiBaseUrl}/contact/`;               // Kontakt-Endpunkt der bestehenden API.
  private readonly csrfEndpoint = `${this.apiBaseUrl}/csrf/`;              // CSRF-Endpunkt der bestehenden API.
  private csrfToken: string | null = null;                                 // Im Speicher gehaltener CSRF-Token; niemals in Web Storage persistieren.
  private requestInProgress = false;                                       // Verhindert parallele Netzwerk-Submits auch außerhalb der Komponentenlogik.

  /**
   * Sendet eine Kontaktanfrage mit explizitem CSRF-Header.
   * Bei genau einem 403 wird der Token verworfen, neu geladen und der POST einmal wiederholt.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   */
  async send(request: ContactRequest): Promise<void> {
    if (this.requestInProgress) {
      throw new ContactApiError('in-progress');
    }

    this.requestInProgress = true;

    try {
      await this.sendWithCsrfRetry(request);
    } finally {
      this.requestInProgress = false;
    }
  }

  /**
   * Führt einen Kontakt-POST mit höchstens einem CSRF-Retry aus.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   */
  private async sendWithCsrfRetry(request: ContactRequest): Promise<void> {
    /**
     * Vorhandener oder neu geladener Token für den ersten POST.
     */
    const csrfToken = await this.getCsrfToken();
    if (!(await this.tryInitialPost(request, csrfToken))) await this.retryContact(request);
  }

  /**
   * Meldet ausschließlich einen ersten CSRF-Fehler als wiederholbaren POST.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   * @param csrfToken Token des ersten POSTs.
   */
  private async tryInitialPost(request: ContactRequest, csrfToken: string): Promise<boolean> {
    try {
      await this.postContact(request, csrfToken);
      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) return false;
      throw this.mapError(error);
    }
  }

  /**
   * Wiederholt den POST einmal mit einem neu geladenen Token.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   */
  private async retryContact(request: ContactRequest): Promise<void> {
    this.csrfToken = null;
    /**
     * Nach dem ersten CSRF-Fehler neu geladener Token.
     */
    const refreshedToken = await this.getCsrfToken();
    try {
      await this.postContact(request, refreshedToken);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /** Liefert den vorhandenen Token oder lädt und speichert einen neuen gültigen Token. */
  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    try {
      this.csrfToken = await this.loadCsrfToken();
      return this.csrfToken;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /** Lädt ausschließlich den Token des bisherigen JSON-CSRF-Endpunkts. */
  private async loadCsrfToken(): Promise<string> {
    /**
     * JSON-Antwort des cookiegebundenen CSRF-Handshakes.
     */
    const response = await firstValueFrom(this.http.get<CsrfResponse>(this.csrfEndpoint, { withCredentials: true }));
    return this.validatedToken(response);
  }

  /**
   * Akzeptiert nur einen nicht leeren Token aus der CSRF-Antwort.
   * @param response Antwort des bisherigen CSRF-Endpunkts.
   */
  private validatedToken(response: CsrfResponse): string {
    /**
     * Von äußerem Leerraum bereinigter Token der Serverantwort.
     */
    const token = response.csrfToken?.trim();
    if (!token) throw new ContactApiError('csrf');
    return token;
  }

  /**
   * Sendet exakt den dokumentierten Payload mit CSRF-Header und Cookies.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   * @param csrfToken Für diesen POST gültiger CSRF-Token.
   */
  private async postContact(request: ContactRequest, csrfToken: string): Promise<void> {
    await firstValueFrom(
      this.http.post<ContactResponse>(this.endpoint, request, {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
      }),
    );
  }

  /**
   * Übersetzt HTTP- und Netzwerkfehler in die bisherigen stabilen UI-Fehlerklassen.
   * @param error Technischer Fehler eines Handshakes oder Kontakt-POSTs.
   */
  private mapError(error: unknown): ContactApiError {
    if (error instanceof ContactApiError) return error;
    if (!(error instanceof HttpErrorResponse) || error.status === 0) return new ContactApiError('network');
    return new ContactApiError(httpErrorCode(error.status), error.status);
  }
}

/**
 * Liefert die bisherige Fehlerklasse eines HTTP-Status.
 * @param status HTTP-Fehlerstatus des Kontakt-Endpunkts.
 */
function httpErrorCode(status: number): ContactApiErrorCode {
  switch (status) {
    case 400:
      return 'validation';
    case 403:
      return 'csrf';
    case 413:
      return 'payload-too-large';
    case 429:
      return 'rate-limit';
    case 503:
      return 'unavailable';
    default:
      return 'server';
  }
}
