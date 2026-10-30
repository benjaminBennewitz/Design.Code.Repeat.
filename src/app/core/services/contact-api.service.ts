/* src/app/core/services/contact-api.service.ts */
/**
 * @file API-Schicht des Kontaktformulars.
 * @description Kapselt CSRF-Handshake, whitelisted Payloads und Fehlerklassifizierung für die zentrale same-origin Infrastructure API.
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
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
  'validation' | 'csrf' | 'payload-too-large' | 'rate-limit' | 'unavailable' | 'server' | 'network' | 'in-progress' | 'timeout';

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
    readonly retryAfterSeconds?: number,
  ) {
    super(`Contact API request failed: ${code}`);
    this.name = 'ContactApiError';
  }
}

/** Zeitrahmen für den gesamten CSRF-/Versandablauf. */
export const CONTACT_REQUEST_TIMEOUT_MS = 20_000;

/** Erstellt die Feld-Whitelist und prüft die endgültigen API-Grenzen inklusive Metadaten. */
export function prepareContactRequest(request: ContactRequest): ContactRequest {
  const payload: ContactRequest = {
    name: request.name,
    email: request.email,
    message: request.message,
    website: request.website,
  };
  if (Object.values(payload).some(value => typeof value !== 'string')) {
    throw new ContactApiError('validation');
  }
  if (Array.from(payload.name).length > 120 || Array.from(payload.email).length > 254
    || Array.from(payload.message).length > 5000
    || new TextEncoder().encode(JSON.stringify(payload)).byteLength > 16 * 1024) {
    throw new ContactApiError('payload-too-large');
  }
  return payload;
}

/** Sendet Kontaktanfragen an die zentrale same-origin Infrastructure API. */
@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);                              // HTTP-Client für den bisherigen API-Transport.
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, ''); // API-Basisadresse ohne abschließenden Slash.
  private readonly endpoint = `${this.apiBaseUrl}/contact/`;               // Kontakt-Endpunkt der bestehenden API.
  private readonly csrfEndpoint = `${this.apiBaseUrl}/csrf/`;              // CSRF-Endpunkt der bestehenden API.
  private csrfToken: string | null = null;                                 // Im Speicher gehaltener CSRF-Token; niemals in Web Storage persistieren.
  /** Ende der vom Server vorgegebenen Wartezeit. */
  private retryAfterUntil = 0;
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

    if (Date.now() < this.retryAfterUntil) {
      throw new ContactApiError('rate-limit', 429,
        Math.ceil((this.retryAfterUntil - Date.now()) / 1000));
    }
    const payload = prepareContactRequest(request);
    const deadline = Date.now() + CONTACT_REQUEST_TIMEOUT_MS;
    this.requestInProgress = true;

    try {
      await this.sendWithCsrfRetry(payload, deadline);
    } finally {
      this.requestInProgress = false;
    }
  }

  /**
   * Führt einen Kontakt-POST mit höchstens einem CSRF-Retry aus.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   * @param deadline Gemeinsames Ende des Zeitbudgets in Millisekunden.
   */
  private async sendWithCsrfRetry(request: ContactRequest, deadline: number): Promise<void> {
    /**
     * Vorhandener oder neu geladener Token für den ersten POST.
     */
    const csrfToken = await this.getCsrfToken(deadline);
    if (!(await this.tryInitialPost(request, csrfToken, deadline))) await this.retryContact(request, deadline);
  }

  /**
   * Meldet ausschließlich einen ersten CSRF-Fehler als wiederholbaren POST.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   * @param csrfToken Token des ersten POSTs.
   * @param deadline Gemeinsames Ende des Zeitbudgets in Millisekunden.
   */
  private async tryInitialPost(request: ContactRequest, csrfToken: string, deadline: number): Promise<boolean> {
    try {
      await this.postContact(request, csrfToken, deadline);
      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) return false;
      throw this.mapError(error);
    }
  }

  /**
   * Wiederholt den POST einmal mit einem neu geladenen Token.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   * @param deadline Gemeinsames Ende des Zeitbudgets in Millisekunden.
   */
  private async retryContact(request: ContactRequest, deadline: number): Promise<void> {
    this.csrfToken = null;
    /**
     * Nach dem ersten CSRF-Fehler neu geladener Token.
     */
    const refreshedToken = await this.getCsrfToken(deadline);
    try {
      await this.postContact(request, refreshedToken, deadline);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Liefert den vorhandenen Token oder lädt und speichert einen neuen gültigen Token.
   * @param deadline Gemeinsames Ende des Zeitbudgets in Millisekunden.
   */
  private async getCsrfToken(deadline: number): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    try {
      this.csrfToken = await this.loadCsrfToken(deadline);
      return this.csrfToken;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Lädt ausschließlich den Token des bisherigen JSON-CSRF-Endpunkts.
   * @param deadline Gemeinsames Ende des Zeitbudgets in Millisekunden.
   */
  private async loadCsrfToken(deadline: number): Promise<string> {
    /**
     * JSON-Antwort des cookiegebundenen CSRF-Handshakes.
     */
    const response = await firstValueFrom(this.http.get<CsrfResponse>(this.csrfEndpoint, { withCredentials: true })
      .pipe(timeout({ first: remainingTime(deadline) })));
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
    const token = response && typeof response.csrfToken === 'string' ? response.csrfToken.trim() : '';
    if (!token) throw new ContactApiError('csrf');
    return token;
  }

  /**
   * Sendet exakt den dokumentierten Payload mit CSRF-Header und Cookies.
   * @param request Erlaubter Request-Body des Kontaktformulars.
   * @param csrfToken Für diesen POST gültiger CSRF-Token.
   * @param deadline Gemeinsames Ende des Zeitbudgets in Millisekunden.
   */
  private async postContact(request: ContactRequest, csrfToken: string, deadline: number): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<ContactResponse>(this.endpoint, request, {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
        observe: 'response',
      }).pipe(timeout({ first: remainingTime(deadline) })),
    );
    if (response.status !== 202 || response.body?.status !== 'accepted') {
      throw new ContactApiError('server', response.status);
    }
  }

  /**
   * Übersetzt HTTP- und Netzwerkfehler in die bisherigen stabilen UI-Fehlerklassen.
   * @param error Technischer Fehler eines Handshakes oder Kontakt-POSTs.
   */
  private mapError(error: unknown): ContactApiError {
    if (error instanceof ContactApiError) return error;
    if (error instanceof TimeoutError) return new ContactApiError('timeout');
    if (!(error instanceof HttpErrorResponse) || error.status === 0) return new ContactApiError('network');
    if (error.status === 429) {
      const header = error.headers.get('Retry-After')?.trim() ?? '';
      const seconds = /^\d+$/.test(header) ? Number(header) : (Date.parse(header) - Date.now()) / 1000;
      const retryAfter = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : undefined;
      if (retryAfter) this.retryAfterUntil = Date.now() + retryAfter * 1000;
      return new ContactApiError('rate-limit', error.status, retryAfter);
    }
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

/** Liefert das gemeinsame Restbudget; RxJS bricht abgelaufene HTTP-Anfragen samt Transport ab. */
function remainingTime(deadline: number): number {
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new ContactApiError('timeout');
  return remaining;
}
