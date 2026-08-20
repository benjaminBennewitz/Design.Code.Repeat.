/**
 * @file API-Schicht des Kontaktformulars.
 * @description Sendet ausschließlich whitelisted Felder an einen same-origin Endpunkt. Serverseitige Validierung bleibt die Sicherheitsgrenze.
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContactTopic } from '../models/studio.models';

/** Expliziter Request-Body; zusätzliche Formularfelder werden nicht an das Backend weitergereicht. */
export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly topic: ContactTopic;
  readonly message: string;
}

/** Sendet Kontaktanfragen an das eigene Backend. */
@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contact/';
  private readonly csrfEndpoint = '/api/csrf/';

  /**
   * Sendet die Anfrage mit Angulars same-origin XSRF-Schutz.
   * Das Backend muss CSRF, Rate Limit, Längen, Typen und erlaubte Topic-Werte erneut prüfen.
   */
  async send(request: ContactRequest): Promise<void> {
    await this.ensureCsrfCookie();
    await firstValueFrom(this.http.post<void>(this.endpoint, request, { withCredentials: true }));
  }

  /** Initialisiert den CSRF-Cookie bei statisch ausgelieferten Angular-Seiten. */
  private async ensureCsrfCookie(): Promise<void> {
    await firstValueFrom(this.http.get<{ readonly detail: string }>(this.csrfEndpoint, { withCredentials: true }));
  }
}
