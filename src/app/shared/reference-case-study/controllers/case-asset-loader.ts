/* src/app/shared/reference-case-study/controllers/case-asset-loader.ts */
/** Lädt und decodiert wiederkehrende Reader- und Lightbox-Assets einmal pro Komponenteninstanz. */
export class CaseAssetLoader {
  private readonly tasks = new Map<string, Promise<void>>(); // Laufende und abgeschlossene Asset-Aufträge.

  /**
   * Liefert einen wiederverwendbaren Ladeauftrag ohne sichtbare Fehlerzustände.
   * @param asset Optionaler Asset-Pfad aus den Projektdaten.
   */
  preload(asset: string | undefined): Promise<void> {
    if (!asset || typeof window === 'undefined') return Promise.resolve();
    if (!this.tasks.has(asset)) this.tasks.set(asset, this.load(asset).catch(ignoreAssetError));
    return this.tasks.get(asset)!;
  }

  /**
   * Wählt das Ladeverfahren anhand des Asset-Typs.
   * @param asset Zu ladender Asset-Pfad.
   */
  private load(asset: string): Promise<void> {
    return /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(asset) ? loadImage(asset) : loadFile(asset);
  }
}

/**
 * Lädt ein Bild bis zum Abschluss der Decoder-Phase.
 * @param asset Bildpfad aus den Projektdaten.
 */
function loadImage(asset: string): Promise<void> {
  return new Promise(createImageTask.bind(null, asset));
}

/**
 * Verbindet ein Bild mit dem Abschluss des Ladeauftrags.
 * @param asset Bildpfad aus den Projektdaten.
 * @param resolve Abschlussfunktion des Ladeauftrags.
 */
function createImageTask(asset: string, resolve: () => void): void {
  /**
   * Separates Browserbild für das Laden und Decodieren.
   */
  const image = new Image();
  image.decoding = 'async';
  image.loading = 'eager';
  image.onload = decodeImage.bind(null, image, resolve);
  image.onerror = finishImageLoad.bind(null, resolve);
  image.src = asset;
  if (image.complete) decodeImage(image, resolve);
}

/**
 * Beendet einen fehlgeschlagenen Bildauftrag ohne Ereignisdaten im Promise.
 * @param resolve Abschlussfunktion des Ladeauftrags.
 */
function finishImageLoad(resolve: () => void): void {
  resolve();
}

/**
 * Wartet auf den Bilddecoder, ohne die Navigation bei Fehlern zu blockieren.
 * @param image Bereits geladenes Browserbild.
 * @param resolve Abschlussfunktion des Ladeauftrags.
 */
function decodeImage(image: HTMLImageElement, resolve: () => void): void {
  /**
   * Gemeinsamer Abschluss ohne Bilddaten oder Decoderfehler im Promise-Ergebnis.
   */
  const finish = finishImageLoad.bind(null, resolve);
  if (image.decode) void image.decode().then(finish, finish);
  else finish();
}

/**
 * Lädt Nicht-Bild-Assets in den Browsercache.
 * @param asset Zu ladender Dateipfad.
 */
async function loadFile(asset: string): Promise<void> {
  await fetch(asset, { cache: 'force-cache' });
}

/** Beendet fehlgeschlagene Preloads, damit die bestehende Navigation bedienbar bleibt. */
function ignoreAssetError(): void {}

/**
 * Wartet eine Animationsdauer, ohne den Browser zu blockieren.
 * @param duration Animationsdauer in Millisekunden.
 */
export function waitForDuration(duration: number): Promise<void> {
  return new Promise(scheduleDelay.bind(null, duration));
}

/**
 * Plant den Abschluss einer zeitgesteuerten Animationsphase.
 * @param duration Animationsdauer in Millisekunden.
 * @param resolve Abschlussfunktion der Wartephase.
 */
function scheduleDelay(duration: number, resolve: () => void): void {
  setTimeout(resolve, duration);
}
