/**
 * @file Interaktive Einzelseiten-Analyse des DCR-Studios.
 * @description Eigene lazy Route mit serverseitig begrenzter PageSpeed-Analyse.
 */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ContactDraftService } from '../../core/services/contact-draft.service';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import {
  AuditCategory,
  AuditConfiguration,
  AuditDemoScenario,
  AuditResponse,
  AuditStrategy,
  WebsiteAuditApiError,
  WebsiteAuditApiService,
} from '../../core/services/website-audit-api.service';
import { AUDIT_CONTENT } from './website-audit-content';

/** Öffentliche Audit-Seite, die keine Resultate oder Eingaben im Browser persistiert. */
@Component({
  selector: 'dcr-website-audit-page',
  standalone: true,
  imports: [],
  templateUrl: './website-audit-page.component.html',
  styleUrl: './website-audit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteAuditPageComponent {
  private readonly api = inject(WebsiteAuditApiService);
  private readonly language = inject(LanguageService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly contactDraft = inject(ContactDraftService);
  readonly demoMode = environment.auditDemoMode;
  readonly demoScenario = signal<AuditDemoScenario>('average');
  readonly ui = computed(() => AUDIT_CONTENT[this.language.language()]);
  readonly url = signal(environment.auditDemoMode ? 'https://example.com/' : '');
  readonly strategy = signal<AuditStrategy>('mobile');
  readonly config = signal<AuditConfiguration | null>(null);
  readonly configurationError = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly response = signal<AuditResponse | null>(null);
  readonly reportTimestamp = signal<Date | null>(null);
  readonly reportDate = computed(() => this.reportTimestamp()?.toLocaleString(this.language.language() === 'de' ? 'de-DE' : 'en-GB') ?? '');
  readonly selectedCategory = signal<AuditCategory>('performance');
  readonly categories: readonly AuditCategory[] = ['performance', 'accessibility', 'best-practices', 'seo'];
  readonly limits = computed(() => {
    const config = this.config();
    return config ? this.ui().limits(config.clientDailyLimit, config.clientBurstLimit, config.clientBurstMinutes, config.globalDailyLimit, config.cacheHours) : '';
  });

  constructor() {
    effect(() => this.seo.setPage(this.ui().seo, '/website-check'));
    void this.loadConfiguration();
  }

  /** Ermittelt die Limits dynamisch, damit UI und Backend synchron bleiben. */
  private async loadConfiguration(): Promise<void> {
    try {
      this.config.set(await this.api.getConfiguration());
    } catch {
      this.configurationError.set(true);
    }
  }

  /** Setzt nur lokal den gewünschten Mock-Zustand. */
  updateDemoScenario(event: Event): void {
    this.demoScenario.set((event.target as HTMLSelectElement).value as AuditDemoScenario);
  }

  /** Schreibt den sichtbaren Eingabewert ohne Änderung anderer Formularzustände. */
  updateUrl(event: Event): void {
    this.url.set((event.target as HTMLInputElement).value);
  }

  /** Aktualisiert die Strategie nur bei expliziter Auswahl. */
  selectStrategy(value: AuditStrategy): void {
    if (!this.busy()) this.strategy.set(value);
  }

  /** Startet die Messung nach einer einfachen clientseitigen Vorprüfung. */
  async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy() || !this.config()?.enabled) return;
    this.error.set('');
    let normalized = this.url().trim();
    try {
      const parsed = new URL(normalized);
      if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
        throw new Error('invalid URL');
      }
      normalized = parsed.href;
    } catch {
      this.error.set(this.ui().invalidUrl);
      return;
    }
    this.url.set(normalized);
    this.response.set(null);
    this.busy.set(true);
    try {
      const response = await this.api.analyze(normalized, this.strategy(), this.language.language(), this.demoScenario());
      this.response.set(response);
      this.selectedCategory.set('performance');
      this.reportTimestamp.set(new Date());
      requestAnimationFrame(() => {
        document.getElementById('audit-results-title')?.focus({ preventScroll: true });
        document.getElementById('audit-results')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    } catch (error) {
      const code = error instanceof WebsiteAuditApiError ? error.code : 'unavailable';
      this.error.set(this.ui().errors[code] ?? this.ui().errors['unavailable']);
    } finally {
      this.busy.set(false);
    }
  }

  /** Ordnet Lighthouse-Wertungen den barrierefrei beschrifteten Zuständen zu. */
  scoreTone(value: number | null): string {
    if (value === null) return 'unknown';
    if (value >= 90) return 'good';
    if (value >= 50) return 'average';
    return 'poor';
  }

  /** Wechselt zwischen den vier Detailgruppen ohne erneuten Google-Aufruf. */
  selectCategory(category: AuditCategory): void {
    this.selectedCategory.set(category);
  }

  /** Gibt die Anzahl ausgewerteter Prüfungen über alle Bereiche zurück. */
  readonly checkTotals = computed(() => {
    const checks = this.response()?.result.checks;
    return this.categories.reduce((totals, category) => {
      const current = checks?.[category];
      totals.passed += current?.passed ?? 0;
      totals.attention += current?.attention ?? 0;
      totals.manual += current?.manual ?? 0;
      return totals;
    }, { passed: 0, attention: 0, manual: 0 });
  });

  /** Gibt reale Labormetriken in einer nachvollziehbaren Einheit aus. */
  formatMetric(value: number | null, unit: 'ms' | 's' | ''): string {
    if (value === null) return '—';
    if (unit === 's') return `${(value / 1000).toFixed(2)} s`;
    if (unit === 'ms') return `${Math.round(value)} ms`;
    return value.toFixed(3);
  }

  /** Öffnet den Druckdialog; Besucher können darüber den Bericht als PDF speichern. */
  printReport(): void {
    if (this.response()) window.print();
  }

  /** Erstellt einen freiwillig versendbaren Formularentwurf ohne URL-Query-Parameter. */
  requestOptimization(): void {
    const audit = this.response();
    if (!audit) return;
    const result = audit.result;
    const ui = this.ui();
    const scoreLines = this.categories.map(category =>
      `${ui.categories[category]}: ${result.scores[category] ?? '—'}/100`,
    );
    const hints = result.opportunities.slice(0, 3).map(item => `- ${item.title}`);
    const opening = this.language.language() === 'de'
      ? 'Ich wünsche eine Beratung zur Optimierung meiner Website anhand dieser Analyse:'
      : 'I would like to discuss improvements to my website based on this audit:';
    const notes = this.language.language() === 'de'
      ? 'Bitte prüfe die Ergebnisse und melde dich für eine unverbindliche Einschätzung.'
      : 'Please review these findings and contact me for a non-binding assessment.';
    const demo = this.demoMode ? `\n${ui.demoInquiryNotice}\n` : '';
    this.contactDraft.prepare({
      topic: 'website',
      message: [opening, result.finalUrl, ui.strategyLabel + ': ' + (result.strategy === 'mobile' ? ui.mobile : ui.desktop),
        ...scoreLines, ...hints, demo, notes].filter(Boolean).join('\n').slice(0, 4000),
    });
    void this.router.navigate(['/kontakt']);
  }

  /** Ermöglicht einen neuen Durchlauf ohne Seitenreload. */
  reset(): void {
    this.response.set(null);
    this.reportTimestamp.set(null);
    this.error.set('');
  }
}
