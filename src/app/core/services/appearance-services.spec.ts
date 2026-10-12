/* src/app/core/services/appearance-services.spec.ts */
import { TestBed } from '@angular/core/testing';
import { AccessibilityPreferenceService } from './accessibility-preference.service';
import { LanguageService } from './language.service';
import { ThemeService } from './theme.service';

let reducedMotion = false; // Simulierte Systempräferenz für reduzierte Bewegung.
let prefersLight = false;  // Simulierte Systempräferenz für das helle Farbschema.

const calmPreferences = { motion: 'off', comfort: 'simple', contrast: 'high', colorVision: 'deuteranopia' };      // Erwarteter ruhiger Modus.
const defaultPreferences = { motion: 'full', comfort: 'expressive', contrast: 'normal', colorVision: 'default' }; // Erwarteter Studio-Standard.

/** Registriert unabhängige Tests für persistierte und reaktive Darstellungszustände. */
function registerAppearanceTests(): void {
  beforeEach(prepareAppearanceTest);
  afterEach(cleanUpAppearanceTest);
  it('ersetzt ungültige Präferenzfelder und erhält gültige Werte', expectPreferenceValidation);
  it('fällt bei defektem JSON auf System- und Studio-Standards zurück', expectMalformedPreferences);
  it('setzt Einzelwerte, ruhigen Modus und Reset ohne Verlust der Farbseh-Auswahl', expectPreferenceUpdates);
  it('bleibt ohne lesbaren oder beschreibbaren Speicher bedienbar', expectBlockedStorage);
  it('synchronisiert Sprache, Inhalte und Persistenz', expectLanguageSynchronization);
  it('ersetzt bei schnellen Sprachwechseln den vorherigen Abschluss-Timer', expectLanguageTransitionRestart);
  it('liest die System-Theme-Präferenz und aktualisiert Dokument und Browserfarbe', expectThemeSynchronization);
  it('hält Sprach- und Theme-Übergänge zeitlich unabhängig', expectIndependentTransitions);
  it('animiert Sprache und Theme bei deaktivierter Bewegung nicht', expectMotionPreference);
}

/** Bereitet einen frischen Browser- und Angular-Zustand für jede Prüfung vor. */
function prepareAppearanceTest(): void {
  reducedMotion = false;
  prefersLight = false;
  clearAppearanceDocument();
  localStorage.clear();
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', matchSystemPreference);
  TestBed.configureTestingModule({});
}

/** Entfernt Timer, TestBed, Browser-Doubles und temporäre Dokumentzustände. */
function cleanUpAppearanceTest(): void {
  TestBed.resetTestingModule();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  clearAppearanceDocument();
}

/** Entfernt ausschließlich die für diese Prüfungen verwendeten Root-Attribute. */
function clearAppearanceDocument(): void {
  document.documentElement.lang = 'de';
  document.documentElement.classList.remove('dcr-language-is-switching', 'dcr-theme-is-switching');
  delete document.documentElement.dataset['motion'];
  delete document.documentElement.dataset['comfort'];
  delete document.documentElement.dataset['contrast'];
  delete document.documentElement.dataset['colorVision'];
  delete document.documentElement.dataset['theme'];
  document.documentElement.style.removeProperty('--dcr-color-bg');
  document.querySelector('meta[name="theme-color"]')?.remove();
}

/**
 * Liefert die Systempräferenz der aktuell angefragten Media Query.
 * @param query Abgefragte Browserpräferenz.
 */
function matchSystemPreference(query: string): MediaQueryList {
  return { matches: query.includes('reduced-motion') ? reducedMotion : prefersLight } as MediaQueryList;
}

/** Prüft den feldweisen Fallback ohne Verlust gültiger gespeicherter Werte. */
function expectPreferenceValidation(): void {
  reducedMotion = true;
  localStorage.setItem(
    'dcr-studio-accessibility-v1',
    JSON.stringify({ motion: 'invalid', comfort: 'simple', contrast: 3, colorVision: 'tritanopia' }),
  );
  /**
   * Präferenzservice mit teilweise ungültigen gespeicherten Werten.
   */
  const service = TestBed.inject(AccessibilityPreferenceService);
  expect(service.preferences()).toEqual({
    motion: 'reduced',
    comfort: 'simple',
    contrast: 'normal',
    colorVision: 'tritanopia',
  });
  TestBed.tick();
  expect(document.documentElement.dataset['colorVision']).toBe('tritanopia');
  expect(JSON.parse(localStorage.getItem('dcr-studio-accessibility-v1')!)).toEqual(service.preferences());
}

/** Prüft den kontrollierten Rückfall bei nicht parsebarem Präferenz-JSON. */
function expectMalformedPreferences(): void {
  reducedMotion = true;
  localStorage.setItem('dcr-studio-accessibility-v1', '{invalid');
  expect(TestBed.inject(AccessibilityPreferenceService).preferences()).toEqual({
    motion: 'reduced',
    comfort: 'expressive',
    contrast: 'normal',
    colorVision: 'default',
  });
}

/** Prüft unabhängige Änderungen sowie die bisherigen Calm- und Reset-Regeln. */
function expectPreferenceUpdates(): void {
  /**
   * Präferenzservice für aufeinanderfolgende individuelle Einstellungen.
   */
  const service = TestBed.inject(AccessibilityPreferenceService);
  configureIndividualPreferences(service);
  service.enableCalmMode();
  expect(service.preferences()).toEqual(calmPreferences);
  service.resetPreferences();
  expect(service.preferences()).toEqual(defaultPreferences);
  TestBed.tick();
  expect(document.documentElement.dataset['motion']).toBe('full');
}

/**
 * Setzt individuelle Präferenzen vor dem Wechsel in den ruhigen Modus.
 * @param service Präferenzservice der aktuellen Prüfung.
 */
function configureIndividualPreferences(service: AccessibilityPreferenceService): void {
  service.setColorVisionMode('deuteranopia');
  service.setContrastMode('high');
  service.setComfortMode('simple');
  service.setMotionMode('reduced');
}

/** Simuliert den vom Browser verweigerten Zugriff auf lokale Persistenz. */
function denyStorage(): never {
  throw new Error('Storage blocked');
}

/** Prüft die Session-Funktion auch bei vollständig gesperrtem Browser-Speicher. */
function expectBlockedStorage(): void {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denyStorage);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(denyStorage);
  TestBed.inject(LanguageService).setLanguage('en');
  TestBed.inject(ThemeService).setTheme('light');
  TestBed.inject(AccessibilityPreferenceService).setMotionMode('off');
  expect(flushAppearanceEffects).not.toThrow();
  expect(document.documentElement.lang).toBe('en');
  expect(document.documentElement.dataset['theme']).toBe('light');
  expect(document.documentElement.dataset['motion']).toBe('off');
}

/** Führt die ausstehenden Dokument- und Persistenzeffekte aus. */
function flushAppearanceEffects(): void {
  TestBed.tick();
}

/** Prüft gespeicherte Sprache, übersetzte Inhalte und den anschließenden Toggle. */
function expectLanguageSynchronization(): void {
  localStorage.setItem('dcr-studio-language', 'en');
  /**
   * Sprachservice mit einer gespeicherten englischen Auswahl.
   */
  const service = TestBed.inject(LanguageService);
  expect(service.language()).toBe('en');
  service.toggleLanguage();
  TestBed.tick();
  expect(service.language()).toBe('de');
  expect(document.documentElement.lang).toBe('de');
  expect(localStorage.getItem('dcr-studio-language')).toBe('de');
  expect(service.content().home.seo.title).toBeTruthy();
}

/** Prüft, dass der alte Timer einen neu gestarteten Sprachwechsel nicht beendet. */
function expectLanguageTransitionRestart(): void {
  /**
   * Sprachservice mit zwei rasch aufeinanderfolgenden Wechseln.
   */
  const service = TestBed.inject(LanguageService);
  service.toggleLanguage();
  vi.advanceTimersByTime(300);
  service.toggleLanguage();
  vi.advanceTimersByTime(120);
  expect(document.documentElement.classList.contains('dcr-language-is-switching')).toBe(true);
  vi.advanceTimersByTime(300);
  expect(document.documentElement.classList.contains('dcr-language-is-switching')).toBe(false);
}

/** Prüft System-Fallback, Theme-Persistenz und den bestehenden Browser-Farbtoken. */
function expectThemeSynchronization(): void {
  prefersLight = true;
  document.head.insertAdjacentHTML('beforeend', '<meta name="theme-color" content="old">');
  document.documentElement.style.setProperty('--dcr-color-bg', '#fafafa');
  /**
   * Themeservice mit hellem Systemstandard und vorhandenem Browser-Meta-Element.
   */
  const service = TestBed.inject(ThemeService);
  expect(service.isLight()).toBe(true);
  TestBed.tick();
  expect(document.documentElement.dataset['theme']).toBe('light');
  expect(document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content).toBe('#fafafa');
  service.toggleTheme();
  TestBed.tick();
  expect(localStorage.getItem('dcr-studio-theme')).toBe('dark');
}

/** Prüft, dass der kurze Sprachwechsel den längeren Theme-Wechsel nicht beendet. */
function expectIndependentTransitions(): void {
  TestBed.inject(LanguageService).toggleLanguage();
  TestBed.inject(ThemeService).toggleTheme();
  vi.advanceTimersByTime(420);
  expect(document.documentElement.classList.contains('dcr-language-is-switching')).toBe(false);
  expect(document.documentElement.classList.contains('dcr-theme-is-switching')).toBe(true);
  vi.advanceTimersByTime(260);
  expect(document.documentElement.classList.contains('dcr-theme-is-switching')).toBe(false);
}

/** Prüft unveränderte Zustandswechsel bei ausgeschalteter CSS-Animation. */
function expectMotionPreference(): void {
  TestBed.inject(AccessibilityPreferenceService).setMotionMode('off');
  TestBed.inject(LanguageService).toggleLanguage();
  TestBed.inject(ThemeService).toggleTheme();
  expect(document.documentElement.classList.contains('dcr-language-is-switching')).toBe(false);
  expect(document.documentElement.classList.contains('dcr-theme-is-switching')).toBe(false);
  expect(TestBed.inject(LanguageService).language()).toBe('en');
  expect(TestBed.inject(ThemeService).theme()).toBe('light');
}

describe('Darstellungsservices', registerAppearanceTests);
