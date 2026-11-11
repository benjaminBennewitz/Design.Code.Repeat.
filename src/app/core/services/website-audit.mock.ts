/**
 * @file Lokale Szenarien für die visuelle Audit-Entwicklung.
 * @description Lädt keine externen Daten und wird nur im Development-Modus verwendet.
 */
import type { StudioLanguage } from '../models/studio.models';
import type { AuditCategory, AuditCategoryChecks, AuditConfiguration, AuditDemoScenario, AuditResponse, AuditStrategy } from './website-audit-api.service';

/** Entspricht den voreingestellten, tatsächlich im Backend durchgesetzten Limits. */
export const AUDIT_MOCK_CONFIG: AuditConfiguration = {
  enabled: true,
  clientDailyLimit: 5,
  clientBurstLimit: 2,
  clientBurstMinutes: 5,
  globalDailyLimit: 100,
  cacheHours: 24,
  singleUrlOnly: true,
};

const SCORE_SETS = {
  good: [100, 100, 100, 100],
  average: [62, 84, 95, 78],
  poor: [23, 48, 56, 39],
} as const;

/** Erzeugt einen vollständigen Bericht mit derselben Struktur wie der Produktions-Endpunkt. */
export function mockAuditResponse(
  url: string, strategy: AuditStrategy, locale: StudioLanguage, scenario: AuditDemoScenario,
): AuditResponse {
  const rating = scenario === 'good' || scenario === 'poor' ? scenario : 'average';
  const [performance, accessibility, bestPractices, seo] = SCORE_SETS[rating];
  const labels = locale === 'de'
    ? ['Bilder effizient bereitstellen', 'Nicht verwendetes JavaScript reduzieren', 'Kontrast von Text und Hintergrund prüfen']
    : ['Serve images efficiently', 'Reduce unused JavaScript', 'Check contrast between text and background'];
  const successLabels = locale === 'de'
    ? ['Dokument besitzt einen Titel', 'Bilder haben Alternativtexte', 'Text ist lesbar', 'Links sind benannt', 'HTTPS wird verwendet', 'Dokumentsprache ist definiert']
    : ['Document has a title', 'Images have alternative text', 'Text is legible', 'Links have names', 'HTTPS is used', 'Document language is set'];

  const createCategoryChecks = (category: AuditCategory): AuditCategoryChecks => {
    const attention = rating === 'good' ? 0 : rating === 'poor' ? 7 : 3;
    const passed = rating === 'good' ? 17 : rating === 'poor' ? 6 : 12;
    return {
      passed, attention, manual: 2, informative: 1,
      items: [
        ...labels.slice(0, attention).map((title, index) => ({ id: `${category}-issue-${index}`, title, status: 'attention' as const })),
        ...successLabels.map((title, index) => ({ id: `${category}-passed-${index}`, title, status: 'passed' as const })),
        { id: `${category}-manual`, title: locale === 'de' ? 'Manuelle Prüfung ergänzen' : 'Perform a manual check', status: 'manual' as const },
      ],
    };
  };

  return {
    cached: false,
    result: {
      url, finalUrl: url, strategy,
      scores: { performance, accessibility, 'best-practices': bestPractices, seo },
      metrics: {
        fcpMs: rating === 'good' ? 750 : rating === 'poor' ? 4000 : 2100,
        speedIndexMs: rating === 'good' ? 1200 : rating === 'poor' ? 8100 : 3600,
        lcpMs: rating === 'good' ? 1100 : rating === 'poor' ? 6500 : 3400,
        cls: rating === 'good' ? 0.012 : rating === 'poor' ? 0.37 : 0.14,
        tbtMs: rating === 'good' ? 40 : rating === 'poor' ? 1600 : 420,
      },
      opportunities: rating === 'good' ? [] : labels.map((title, index) => ({
        id: `demo-${index}`, title, savingsMs: index === 2 ? null : (rating === 'poor' ? 850 : 270) - index * 80,
      })),
      lighthouseVersion: '13.0.0',
      checks: {
        performance: createCategoryChecks('performance'),
        accessibility: createCategoryChecks('accessibility'),
        'best-practices': createCategoryChecks('best-practices'),
        seo: createCategoryChecks('seo'),
      },
    },
  };
}
