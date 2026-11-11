/**
 * @file Übersetzungen des Website-Audits, getrennt vom globalen Studio-Content.
 */
import { StudioLanguage } from '../../core/models/studio.models';
import { AuditCategory } from '../../core/services/website-audit-api.service';

interface AuditContent {
  readonly seo: { title: string; description: string; keywords: readonly string[] };
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly traceTitle: string;
  readonly traceIdle: string;
  readonly traceActive: string;
  readonly traceBrowser: string;
  readonly traceReport: string;
  readonly traceScope: string;
  readonly formTitle: string;
  readonly urlLabel: string;
  readonly urlPlaceholder: string;
  readonly strategyLabel: string;
  readonly mobile: string;
  readonly desktop: string;
  readonly submit: string;
  readonly running: string;
  readonly checking: string;
  readonly singlePage: string;
  readonly limits: (daily: number, burst: number, minutes: number, global: number, hours: number) => string;
  readonly provider: string;
  readonly privacy: string;
  readonly disabled: string;
  readonly preparing: string;
  readonly demoLabel: string;
  readonly demoIntro: string;
  readonly demoChecking: string;
  readonly reportDateLabel: string;
  readonly demoScenarioLabel: string;
  readonly demoScenarios: readonly { readonly id: string; readonly label: string }[];
  readonly demoResultLabel: string;
  readonly demoInquiryNotice: string;
  readonly reportSave: string;
  readonly reportSaveHint: string;
  readonly reportRequest: string;
  readonly reportTitle: string;
  readonly cacheLabel: string;
  readonly freshLabel: string;
  readonly scoreLabel: string;
  readonly categories: Readonly<Record<AuditCategory, string>>;
  readonly metricsTitle: string;
  readonly metricsIntro: string;
  readonly fcp: string;
  readonly speedIndex: string;
  readonly metricHelp: Readonly<Record<'fcp' | 'speedIndex' | 'lcp' | 'cls' | 'tbt', string>>;
  readonly detailTitle: string;
  readonly detailIntro: string;
  readonly resultSummary: (passed: number, attention: number, manual: number) => string;
  readonly checkStates: Readonly<Record<'passed' | 'attention' | 'manual' | 'informative', string>>;
  readonly checksExcerpt: string;
  readonly noCheckDetails: string;
  readonly scanDevice: string;
  readonly scanVersion: string;
  readonly lcp: string;
  readonly cls: string;
  readonly tbt: string;
  readonly hintsTitle: string;
  readonly savings: (ms: number) => string;
  readonly noHints: string;
  readonly interpretation: string;
  readonly nextTitle: string;
  readonly nextText: string;
  readonly contact: string;
  readonly again: string;
  readonly invalidUrl: string;
  readonly errors: Readonly<Record<string, string>>;
}

export const AUDIT_CONTENT: Record<StudioLanguage, AuditContent> = {
  de: {
    seo: {
      title: 'Kostenloser Website-Check | Design. Code. Repeat.',
      description: 'Website kostenlos auf Performance, Barrierefreiheit, technische Qualität und SEO prüfen. Einzelne URLs mit Google Lighthouse analysieren.',
      keywords: ['Website-Check', 'Lighthouse Audit', 'Performance prüfen', 'Website optimieren'],
    },
    eyebrow: 'tool.01 / lighthouse',
    title: 'DEINE WEBSITE. UNTER DEM MIKROSKOP.',
    lead: 'Vier Messbereiche. Konkrete Hinweise. Ohne Registrierung. Prüfe, was technisch besser funktionieren könnte.',
    traceTitle: 'REQUEST / SYSTEMDIAGRAMM',
    traceIdle: 'BEREIT',
    traceActive: 'PRÜFUNG LÄUFT',
    traceBrowser: 'BROWSER',
    traceReport: 'BERICHT',
    traceScope: 'EINE URL / VIER MESSBEREICHE',
    formTitle: 'Neue Prüfung',
    urlLabel: 'Öffentliche Seitenadresse (URL)',
    urlPlaceholder: 'https://deine-domain.de/unterseite',
    strategyLabel: 'Testgerät',
    mobile: 'Mobil',
    desktop: 'Desktop',
    submit: 'Website prüfen',
    running: 'Analyse läuft …',
    checking: 'Google Lighthouse untersucht die angegebene URL. Das kann etwas dauern.',
    singlePage: 'Wichtig: Geprüft wird ausschließlich die eingegebene URL. Startseite, Leistungen, Kontakt und andere Unterseiten müssen jeweils separat analysiert werden. Es findet kein vollständiger Website-Crawl statt.',
    limits: (daily, burst, minutes, global, hours) => `Bis zu ${daily} neue Messungen pro IP-Adresse und Tag, maximal ${burst} innerhalb von ${minutes} Minuten. Zusätzlich stehen insgesamt bis zu ${global} neue Messungen pro Tag zur Verfügung. Identische URL-/Geräte-/Sprach-Kombinationen werden ${hours} Stunden zwischengespeichert und verbrauchen dann keine neue Messung.`,
    provider: 'Die Messung erfolgt über Google PageSpeed Insights (Lighthouse).',
    privacy: 'Mit dem Start wird die eingegebene öffentliche URL zur Analyse an Google übertragen. Bitte keine geheimen, privaten oder zugangsgeschützten URLs eintragen.',
    disabled: 'Der Website-Check ist aktuell nicht freigeschaltet. Bitte später erneut versuchen.',
    preparing: 'Prüfe Verfügbarkeit …',
    demoLabel: 'DEMO / LOKALE VORSCHAU',
    demoIntro: 'Nur Beispieldaten. Es wird keine Anfrage an Google oder Django gesendet.',
    demoChecking: 'Lokale Beispieldaten werden vorbereitet …',
    reportDateLabel: 'Erstellt am',
    demoScenarioLabel: 'Design-Szenario',
    demoScenarios: [
      { id: 'good', label: 'Sehr gute Website' },
      { id: 'average', label: 'Durchschnittliche Website' },
      { id: 'poor', label: 'Problematische Website' },
      { id: 'rate_limited', label: 'Limit erreicht' },
      { id: 'unavailable', label: 'API nicht erreichbar' },
    ],
    demoResultLabel: 'DEMO-ERGEBNIS · KEINE ECHTE MESSUNG',
    demoInquiryNotice: 'Hinweis: Dies ist ein Demonstrationsbericht ohne echte Messdaten.',
    reportSave: 'Bericht als PDF speichern',
    reportSaveHint: 'Öffnet den Druckdialog. Dort „Als PDF speichern“ auswählen.',
    reportRequest: 'Mit Ergebnis anfragen',
    reportTitle: 'Analyseergebnis',
    cacheLabel: 'Zwischengespeichertes Ergebnis',
    freshLabel: 'Neue Messung',
    scoreLabel: 'Lighthouse-Bewertungen',
    categories: { performance: 'Performance', accessibility: 'Barrierefreiheit', 'best-practices': 'Best Practices', seo: 'SEO' },
    metricsTitle: 'Messwerte im Detail',
    metricsIntro: 'Technische Labormessung dieser einzelnen Seite. Die Werte zeigen unterschiedliche Phasen beim Laden und Reagieren.',
    fcp: 'FCP', speedIndex: 'Speed Index',
    metricHelp: {
      fcp: 'Wann der erste sichtbare Inhalt erscheint.',
      speedIndex: 'Wie schnell sichtbare Inhalte aufgebaut werden.',
      lcp: 'Wann das größte sichtbare Inhaltselement geladen ist.',
      cls: 'Wie stark sich Elemente beim Laden verschieben.',
      tbt: 'Wie lange der Browser durch Aufgaben blockiert wird.',
    },
    detailTitle: 'Lighthouse-Prüfprotokoll',
    detailIntro: 'Prüfungen nach Messbereich. Die Summen enthalten alle bewerteten Checks; die Liste zeigt einen ausgewählten Auszug.',
    resultSummary: (passed, attention, manual) => `${passed} bestanden · ${attention} auffällig · ${manual} manuell prüfen`,
    checkStates: { passed: 'BESTANDEN', attention: 'PRÜFEN', manual: 'MANUELL', informative: 'INFO' },
    checksExcerpt: 'Ausgewählte Lighthouse-Checks',
    noCheckDetails: 'Für dieses zwischengespeicherte Ergebnis liegen noch keine Einzelprüfungen vor. Eine erneute Messung liefert den erweiterten Bericht.',
    scanDevice: 'Testprofil', scanVersion: 'Lighthouse',
    lcp: 'LCP', cls: 'CLS', tbt: 'TBT',
    hintsTitle: 'Wichtige technische Hinweise',
    savings: ms => `Bis zu ca. ${Math.round(ms)} ms Potenzial laut Lighthouse`,
    noHints: 'Keine priorisierten Optimierungsmöglichkeiten erkannt. Die Einzelprüfungen unten dokumentieren dennoch, was Lighthouse kontrolliert hat.',
    interpretation: 'Momentaufnahme: Werte können je Durchlauf schwanken. Accessibility- und SEO-Scores ersetzen weder eine vollständige WCAG-Prüfung noch eine SEO-Fachanalyse.',
    nextTitle: 'Du möchtest gezielt verbessern?',
    nextText: 'Ich kann die Ergebnisse prüfen, Maßnahmen priorisieren und die technische Umsetzung übernehmen.',
    contact: 'Optimierung anfragen',
    again: 'Weitere URL prüfen',
    invalidUrl: 'Bitte eine vollständige öffentliche http://- oder https://-Adresse eintragen.',
    errors: {
      validation_error: 'Diese URL kann nicht geprüft werden. Bitte eine öffentliche Website ohne Zugangsdaten eingeben.',
      rate_limited: 'Dein Nutzungslimit ist erreicht. Bitte später erneut versuchen.',
      analysis_in_progress: 'Diese Seite wird bereits geprüft. Bitte in Kürze erneut versuchen.',
      upstream_quota: 'Das Google-Kontingent ist derzeit ausgeschöpft. Bitte später erneut versuchen.',
      upstream_access_denied: 'Der Analyse-Dienst ist momentan nicht korrekt autorisiert. Bitte später erneut versuchen.',
      analysis_failed: 'Die Seite konnte nicht vollständig analysiert werden. Möglicherweise blockiert sie den Test oder die Messung hat zu lange gedauert.',
      service_unavailable: 'Der Audit-Service ist momentan nicht verfügbar.',
      csrf_failed: 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte die Seite neu laden.',
      unavailable: 'Die Analyse konnte nicht gestartet werden. Bitte die Verbindung prüfen und später erneut versuchen.',
    },
  },
  en: {
    seo: {
      title: 'Free website audit | Design. Code. Repeat.',
      description: 'Check a specific page for performance, accessibility, best practices and SEO using Google Lighthouse. No signup required.',
      keywords: ['Website audit', 'Lighthouse analysis', 'PageSpeed', 'Website optimization'],
    },
    eyebrow: 'tool.01 / lighthouse',
    title: 'YOUR WEBSITE. UNDER THE MICROSCOPE.',
    lead: 'Four categories. Practical findings. No sign-up. See where your website has room to improve.',
    traceTitle: 'REQUEST / SYSTEM DIAGRAM',
    traceIdle: 'STANDBY',
    traceActive: 'SCAN RUNNING',
    traceBrowser: 'BROWSER',
    traceReport: 'REPORT',
    traceScope: 'ONE URL / FOUR CATEGORIES',
    formTitle: 'New scan',
    urlLabel: 'Public page address (URL)',
    urlPlaceholder: 'https://your-domain.com/another-page',
    strategyLabel: 'Test device',
    mobile: 'Mobile',
    desktop: 'Desktop',
    submit: 'Analyze website',
    running: 'Analyzing …',
    checking: 'Google Lighthouse is analyzing this URL. This may take a moment.',
    singlePage: 'Important: Only the exact URL entered is tested. The homepage, services, contact and other pages each require their own scan. This does not crawl the entire website.',
    limits: (daily, burst, minutes, global, hours) => `Up to ${daily} new scans per IP address per day, at most ${burst} within ${minutes} minutes. An additional global budget of up to ${global} new scans per day applies. Identical URL/device/language combinations are cached for ${hours} hours without using another scan.`,
    provider: 'Measurements are provided by Google PageSpeed Insights (Lighthouse).',
    privacy: 'Starting a scan sends the entered public URL to Google. Do not enter secret, private or access-restricted URLs.',
    disabled: 'The audit tool is currently unavailable. Please try again later.',
    preparing: 'Checking availability …',
    demoLabel: 'DEMO / LOCAL PREVIEW',
    demoIntro: 'Sample data only. No request is sent to Google or Django.',
    demoChecking: 'Preparing sample data locally …',
    reportDateLabel: 'Generated on',
    demoScenarioLabel: 'Design scenario',
    demoScenarios: [
      { id: 'good', label: 'Excellent website' },
      { id: 'average', label: 'Average website' },
      { id: 'poor', label: 'Problematic website' },
      { id: 'rate_limited', label: 'Rate limit reached' },
      { id: 'unavailable', label: 'API unavailable' },
    ],
    demoResultLabel: 'DEMO RESULT · NOT A REAL MEASUREMENT',
    demoInquiryNotice: 'Note: This is a demonstration report without real measurements.',
    reportSave: 'Save report as PDF',
    reportSaveHint: 'Opens your print dialog. Choose “Save as PDF”.',
    reportRequest: 'Request with results',
    reportTitle: 'Scan results',
    cacheLabel: 'Cached result',
    freshLabel: 'New scan',
    scoreLabel: 'Lighthouse scores',
    categories: { performance: 'Performance', accessibility: 'Accessibility', 'best-practices': 'Best Practices', seo: 'SEO' },
    metricsTitle: 'Performance metrics',
    metricsIntro: 'Lab measurements for this page. Each metric covers a different aspect of rendering and responsiveness.',
    fcp: 'FCP', speedIndex: 'Speed Index',
    metricHelp: {
      fcp: 'When the first visible content appears.',
      speedIndex: 'How quickly visible content is rendered.',
      lcp: 'When the largest visible content element loads.',
      cls: 'How much elements shift during loading.',
      tbt: 'How long the browser is blocked by tasks.',
    },
    detailTitle: 'Lighthouse audit log',
    detailIntro: 'Checks by category. Counts include all scored checks; the list shows a selected sample.',
    resultSummary: (passed, attention, manual) => `${passed} passed · ${attention} to review · ${manual} manual checks`,
    checkStates: { passed: 'PASSED', attention: 'REVIEW', manual: 'MANUAL', informative: 'INFO' },
    checksExcerpt: 'Selected Lighthouse checks',
    noCheckDetails: 'Individual checks are not available for this cached report yet. A new scan will include expanded details.',
    scanDevice: 'Test profile', scanVersion: 'Lighthouse',
    lcp: 'LCP', cls: 'CLS', tbt: 'TBT',
    hintsTitle: 'Technical findings',
    savings: ms => `Up to around ${Math.round(ms)} ms potential saving per Lighthouse`,
    noHints: 'No prioritized findings are available from this scan.',
    interpretation: 'Snapshot only: results can vary between runs. Accessibility and SEO scores do not replace a full WCAG audit or professional SEO review.',
    nextTitle: 'Want help improving your website?',
    nextText: 'I can review the findings, prioritize improvements and implement them.',
    contact: 'Request an optimization',
    again: 'Analyze another URL',
    invalidUrl: 'Please enter a complete public http:// or https:// URL.',
    errors: {
      validation_error: 'This URL cannot be scanned. Enter a public website without credentials.',
      rate_limited: 'Your scan limit has been reached. Please try again later.',
      analysis_in_progress: 'This page is already being scanned. Please try again shortly.',
      upstream_quota: 'Google’s quota has been reached. Please try again later.',
      upstream_access_denied: 'The analysis service is currently not correctly authorized. Please try again later.',
      analysis_failed: 'The page could not be fully analyzed. It may block automated tests or the scan timed out.',
      service_unavailable: 'The audit service is temporarily unavailable.',
      csrf_failed: 'Security verification failed. Please reload the page.',
      unavailable: 'Unable to start the scan. Check your connection and try again later.',
    },
  },
};
