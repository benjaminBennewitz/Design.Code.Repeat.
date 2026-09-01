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
  | 'validation'
  | 'csrf'
  | 'payload-too-large'
  | 'rate-limit'
  | 'unavailable'
  | 'server'
  | 'network'
  | 'in-progress';

/** Typisierter Fehler der Kontakt-API. */
export class ContactApiError extends Error {
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
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly endpoint = `${this.apiBaseUrl}/contact/`;
  private readonly csrfEndpoint = `${this.apiBaseUrl}/csrf/`;

  /** Im Speicher gehaltener CSRF-Token; niemals in Web Storage persistieren. */
  private csrfToken: string | null = null;

  /** Verhindert parallele Netzwerk-Submits auch außerhalb der Komponentenlogik. */
  private requestInProgress = false;

  /**
   * Sendet eine Kontaktanfrage mit explizitem CSRF-Header.
   * Bei genau einem 403 wird der Token verworfen, neu geladen und der POST einmal wiederholt.
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

  /** Führt den POST aus und erlaubt maximal einen kontrollierten CSRF-Retry. */
  private async sendWithCsrfRetry(request: ContactRequest): Promise<void> {
    const csrfToken = await this.getCsrfToken();

    try {
      await this.postContact(request, csrfToken);
      return;
    } catch (error) {
      if (!(error instanceof HttpErrorResponse) || error.status !== 403) {
        throw this.mapError(error);
      }
    }

    this.csrfToken = null;
    const refreshedToken = await this.getCsrfToken();

    try {
      await this.postContact(request, refreshedToken);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /** Liefert einen vorhandenen Token oder lädt ihn über den JSON-CSRF-Endpunkt. */
  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<CsrfResponse>(this.csrfEndpoint, { withCredentials: true }),
      );
      const token = response.csrfToken?.trim();

      if (!token) {
        throw new ContactApiError('csrf');
      }

      this.csrfToken = token;
      return token;
    } catch (error) {
      if (error instanceof ContactApiError) {
        throw error;
      }

      throw this.mapError(error);
    }
  }

  /** Sendet exakt den dokumentierten Payload mit CSRF-Header und Cookies. */
  private async postContact(request: ContactRequest, csrfToken: string): Promise<void> {
    await firstValueFrom(
      this.http.post<ContactResponse>(this.endpoint, request, {
        headers: { 'X-CSRFToken': csrfToken },
        withCredentials: true,
      }),
    );
  }

  /** Übersetzt technische HTTP-/Netzwerkfehler in stabile UI-Fehlerklassen. */
  private mapError(error: unknown): ContactApiError {
    if (error instanceof ContactApiError) {
      return error;
    }

    if (!(error instanceof HttpErrorResponse) || error.status === 0) {
      return new ContactApiError('network');
    }

    switch (error.status) {
      case 400:
        return new ContactApiError('validation', error.status);
      case 403:
        return new ContactApiError('csrf', error.status);
      case 413:
        return new ContactApiError('payload-too-large', error.status);
      case 429:
        return new ContactApiError('rate-limit', error.status);
      case 503:
        return new ContactApiError('unavailable', error.status);
      default:
        return new ContactApiError('server', error.status);
    }
  }
}
