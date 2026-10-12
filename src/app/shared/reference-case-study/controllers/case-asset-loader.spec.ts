/* src/app/shared/reference-case-study/controllers/case-asset-loader.spec.ts */
import { CaseAssetLoader } from './case-asset-loader';

/** Kontrollierbares Browserbild für Lade- und Decoder-Tests. */
class TestImage {
  static readonly instances: TestImage[] = []; // Im aktuellen Test angelegte Browserbilder.
  complete = false; // Wartet auf den gezielt ausgelösten Bildabschluss.
  decoding = ''; // Vom Loader gewählte Decoder-Einstellung.
  loading = ''; // Vom Loader gewählte Ladepriorität.
  src = ''; // Vom Loader angeforderter Bildpfad.
  onload?: () => void; // Auslöser des Bilddecoders nach dem Laden.
  onerror?: () => void; // Auslöser des defensiven Fehlerabschlusses.

  /** Erfasst das für einen Ladeauftrag angelegte Browserbild. */
  constructor() {
    TestImage.instances.push(this);
  }

  /** Bestätigt die erfolgreiche Bild-Decodierung. */
  decode(): Promise<void> {
    return Promise.resolve();
  }
}

/** Registriert Tests für den gemeinsamen Bildloader. */
function registerAssetTests(): void {
  beforeEach(prepareImageMock);
  afterEach(restoreImageMock);
  it('verwendet denselben Ladeauftrag und Decoder für wiederholte Bildpfade', expectCachedDecode);
  it('beendet Bildfehler ohne Ereignisdaten oder abgelehntes Promise', expectImageFailure);
  it('blockiert die Navigation nicht bei einem Decoderfehler', expectDecodeFailure);
}

/** Aktiviert kontrollierbare Browserbilder für den aktuellen Test. */
function prepareImageMock(): void {
  TestImage.instances.length = 0;
  vi.stubGlobal('Image', TestImage);
}

/** Entfernt Browser-Doubles und Decoder-Spies. */
function restoreImageMock(): void {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
}

/** Prüft die Wiederverwendung laufender und abgeschlossener Bildaufträge. */
async function expectCachedDecode(): Promise<void> {
  /**
   * Asset-Loader der aktuellen Komponenteninstanz.
   */
  const loader = new CaseAssetLoader();
  /**
   * Erster Ladeauftrag für den wiederholt angefragten Bildpfad.
   */
  const task = loader.preload('catalog-page.webp');
  expect(loader.preload('catalog-page.webp')).toBe(task);
  expect(TestImage.instances).toHaveLength(1);
  vi.spyOn(TestImage.instances[0], 'decode');
  TestImage.instances[0].onload?.();
  await task;
  expect(TestImage.instances[0].decode).toHaveBeenCalledOnce();
  expect(loader.preload('catalog-page.webp')).toBe(task);
}

/** Prüft den defensiven Abschluss eines fehlgeschlagenen Bildauftrags. */
async function expectImageFailure(): Promise<void> {
  /**
   * Bildauftrag, dessen Browser-Ladefehler gezielt ausgelöst wird.
   */
  const task = new CaseAssetLoader().preload('catalog-page.webp');
  TestImage.instances[0].onerror?.();
  await expect(task).resolves.toBeUndefined();
}

/** Prüft den defensiven Abschluss nach einem Decoderfehler. */
async function expectDecodeFailure(): Promise<void> {
  /**
   * Bildauftrag mit gezielt fehlschlagendem Browserdecoder.
   */
  const task = new CaseAssetLoader().preload('catalog-page.webp');
  vi.spyOn(TestImage.instances[0], 'decode').mockRejectedValue(new Error('Decoderfehler'));
  TestImage.instances[0].onload?.();
  await expect(task).resolves.toBeUndefined();
}

describe('CaseAssetLoader', registerAssetTests);
