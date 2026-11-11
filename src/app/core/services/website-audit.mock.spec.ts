import { AUDIT_MOCK_CONFIG, mockAuditResponse } from './website-audit.mock';

describe('Website-Audit-Mock', () => {
  it('ermöglicht lokale Auswertungen ohne Backend', () => {
    expect(AUDIT_MOCK_CONFIG.enabled).toBe(true);
    const report = mockAuditResponse('https://example.com/test', 'mobile', 'de', 'average');
    expect(report.result.finalUrl).toBe('https://example.com/test');
    expect(report.result.scores.performance).toBe(62);
    expect(report.result.opportunities.length).toBeGreaterThan(0);
    expect(report.result.metrics.fcpMs).toBeGreaterThan(0);
    expect(report.result.checks?.performance.attention).toBeGreaterThan(0);
  });

  it('liefert unterscheidbare gute und schlechte Szenarien', () => {
    const good = mockAuditResponse('https://example.com/', 'desktop', 'de', 'good');
    const poor = mockAuditResponse('https://example.com/', 'desktop', 'en', 'poor');
    expect(good.result.opportunities).toHaveLength(0);
    expect(good.result.checks?.seo.passed).toBeGreaterThan(0);
    expect(good.result.checks?.seo.items.some(item => item.status === 'passed')).toBe(true);
    expect(poor.result.scores.performance).toBeLessThan(good.result.scores.performance ?? 0);
    expect(poor.result.opportunities[0].title).toBe('Serve images efficiently');
  });
});
