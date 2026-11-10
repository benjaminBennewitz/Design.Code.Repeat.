/**
 * @file API-Verbindung für den öffentlichen Website-Audit.
 * @description Nutzt die vorhandene same-origin Infrastructure API und ihren CSRF-Endpunkt.
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudioLanguage } from '../models/studio.models';

export type AuditStrategy = 'mobile' | 'desktop';
export type AuditDemoScenario = 'good' | 'average' | 'poor' | 'rate_limited' | 'unavailable';
export type AuditCategory = 'performance' | 'accessibility' | 'best-practices' | 'seo';

/** Öffentliche Auslastungs- und Aktivierungseinstellungen. */
export interface AuditConfiguration {
  readonly enabled: boolean;
  readonly clientDailyLimit: number;
  readonly clientBurstLimit: number;
  readonly clientBurstMinutes: number;
  readonly globalDailyLimit: number;
  readonly cacheHours: number;
  readonly singleUrlOnly: boolean;
}

/** Ein geprüfter Lighthouse-Hinweis ohne HTML aus externen Quellen. */
export interface AuditOpportunity {
  readonly id: string;
  readonly title: string;
  readonly savingsMs: number | null;
}

/** Kompaktbericht aus dem Backend. */
export interface AuditResult {
  readonly url: string;
  readonly finalUrl: string;
  readonly strategy: AuditStrategy;
  readonly scores: Readonly<Record<AuditCategory, number | null>>;
  readonly metrics: {
    readonly lcpMs: number | null;
    readonly cls: number | null;
    readonly tbtMs: number | null;
  };
  readonly opportunities: readonly AuditOpportunity[];
}

export interface AuditResponse {
  readonly result: AuditResult;
  readonly cached: boolean;
}

/** Stabiler API-Fehler für lokalisierte Meldungen. */
export class WebsiteAuditApiError extends Error {
  constructor(readonly code: string, readonly retryAfterSeconds: number | null = null) {
    super(code);
  }
}

@Injectable({ providedIn: 'root' })
export class WebsiteAuditApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl.replace(/\/$/, '')}/audit/`;
  private csrfToken: string | null = null;

  /** Lädt die tatsächlichen serverseitigen Limits, ohne einen Scan zu verbrauchen. */
  async getConfiguration(): Promise<AuditConfiguration> {
    if (environment.auditDemoMode) {
      const { AUDIT_MOCK_CONFIG } = await import('./website-audit.mock');
      return AUDIT_MOCK_CONFIG;
    }
    return firstValueFrom(this.http.get<AuditConfiguration>(`${this.baseUrl}config/`)
      .pipe(timeout({ first: 10_000 })));
  }

  /** Startet genau eine Prüfung einer URL und einer Gerätekonfiguration. */
  async analyze(
    url: string, strategy: AuditStrategy, locale: StudioLanguage, scenario: AuditDemoScenario = 'average',
  ): Promise<AuditResponse> {
    if (environment.auditDemoMode) {
      const { mockAuditResponse } = await import('./website-audit.mock');
      await new Promise<void>(resolve => setTimeout(resolve, 650));
      if (scenario === 'rate_limited' || scenario === 'unavailable') throw new WebsiteAuditApiError(scenario);
      return mockAuditResponse(url, strategy, locale, scenario);
    }
    try {
      const token = await this.getCsrfToken();
      return await this.post({ url, strategy, locale }, token);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.csrfToken = null;
        try {
          return await this.post({ url, strategy, locale }, await this.getCsrfToken());
        } catch (retryError) {
          throw this.mapError(retryError);
        }
      }
      throw this.mapError(error);
    }
  }

  /** Verwendet den bestehenden Token-Handschlag der Infrastructure API. */
  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    const response = await firstValueFrom(this.http.get<{ csrfToken: string }>(
      `${environment.apiBaseUrl.replace(/\/$/, '')}/csrf/`, { withCredentials: true },
    ).pipe(timeout({ first: 10_000 })));
    if (!response?.csrfToken) throw new WebsiteAuditApiError('csrf_failed');
    this.csrfToken = response.csrfToken;
    return this.csrfToken;
  }

  /** Überträgt nur die drei benötigten Felder. */
  private post(request: { url: string; strategy: AuditStrategy; locale: StudioLanguage }, token: string): Promise<AuditResponse> {
    return firstValueFrom(this.http.post<AuditResponse>(this.baseUrl, request, {
      headers: { 'X-CSRFToken': token },
      withCredentials: true,
    }).pipe(timeout({ first: 40_000 })));
  }

  /** Reduziert technische Details auf bekannte Fehlerzustände. */
  private mapError(error: unknown): WebsiteAuditApiError {
    if (error instanceof WebsiteAuditApiError) return error;
    if (error instanceof HttpErrorResponse) {
      const code = typeof error.error?.error?.code === 'string'
        ? error.error.error.code : 'unavailable';
      const retry = Number(error.headers.get('Retry-After'));
      return new WebsiteAuditApiError(code, Number.isFinite(retry) && retry > 0 ? retry : null);
    }
    return new WebsiteAuditApiError('unavailable');
  }
}
