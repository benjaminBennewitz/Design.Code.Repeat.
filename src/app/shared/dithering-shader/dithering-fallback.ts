/* src/app/shared/dithering-shader/dithering-fallback.ts */
import type { DitheringOptions, RgbaColor } from './dithering.models';
import { getNormalizedEnergy, getWaveEnergy } from './dithering-patterns';
/** Erstellt ausschließlich den statischen Canvas2D-Fallback des Dithering-Musters. */
export class DitheringFallback {
  private readonly front: readonly number[]; // Vordergrundfarbe im Canvas-Byteformat.
  private readonly back: readonly number[];  // Hintergrundfarbe im Canvas-Byteformat.
  /**
   * Verbindet Canvas-Größe, Einstellungen und statische Farben.
   * @param width Interne Canvas-Breite.
   * @param height Interne Canvas-Höhe.
   * @param options Aktuelle Shader-Einstellungen.
   * @param front Normalisierte Vordergrundfarbe.
   * @param back Normalisierte Hintergrundfarbe.
   */
  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly options: DitheringOptions,
    front: RgbaColor,
    back: RgbaColor,
  ) {
    this.front = front.map(toColorByte);
    this.back = back.map(toColorByte);
  }
  /**
   * Zeichnet ein einziges statisches Bild mit Canvas2D.
   * @param context Verfügbarer zweidimensionaler Zeichenkontext.
   */
  draw(context: CanvasRenderingContext2D): void {
    /**
     * Pixelpuffer des statischen Fallback-Bildes.
     */
    const image = context.createImageData(this.width, this.height);
    /**
     * Aktuell vollständig ausgefüllte Zeile des Bildpuffers.
     */
    for (let y = 0; y < this.height; y++) this.fillRow(image.data, y);
    context.putImageData(image, 0, 0);
  }
  /**
   * Füllt eine Zeile des statischen Bildpuffers.
   * @param pixels RGBA-Pixelpuffer des Fallback-Bildes.
   * @param y Vertikale Pixelposition der aktuellen Zeile.
   */
  private fillRow(pixels: Uint8ClampedArray, y: number): void {
    /**
     * Aktuell anhand von Muster und Schwellenwert eingefärbter Pixel.
     */
    for (let x = 0; x < this.width; x++) this.fillPixel(pixels, x, y);
  }
  /**
   * Übernimmt die Schwellenwertfarbe eines einzelnen Pixels.
   * @param pixels RGBA-Pixelpuffer des Fallback-Bildes.
   * @param x Horizontale Pixelposition.
   * @param y Vertikale Pixelposition.
   */
  private fillPixel(pixels: Uint8ClampedArray, x: number, y: number): void {
    /**
     * Anhand der bisherigen 4x4-Schwelle gewählte Pixel-Farbe.
     */
    const color = this.sample(x, y) > ((y & 3) * 4 + (x & 3)) / 16 ? this.front : this.back;
    /**
     * Beginn der vier RGBA-Kanäle im Bildpuffer.
     */
    const offset = (y * this.width + x) * 4;
    pixels[offset] = color[0] ?? 0;
    pixels[offset + 1] = color[1] ?? 0;
    pixels[offset + 2] = color[2] ?? 0;
    pixels[offset + 3] = color[3] ?? 0;
  }
  /**
   * Berechnet die Musterenergie eines Pixels im bestehenden Koordinatensystem.
   * @param x Horizontale Pixelposition.
   * @param y Vertikale Pixelposition.
   */
  private sample(x: number, y: number): number {
    if (this.options.shape === 'wave') return getWaveEnergy(x, y, this.width, this.height);
    return getNormalizedEnergy(
      this.options.shape,
      this.normalizePosition(x, this.width),
      this.normalizePosition(y, this.height),
    );
  }
  /**
   * Berechnet eine Koordinate relativ zur Canvas-Mitte und zum bisherigen Zoom.
   * @param position Pixelposition auf der gewählten Achse.
   * @param size Interne Canvas-Größe auf der gewählten Achse.
   */
  private normalizePosition(position: number, size: number): number {
    return (
      ((position + 0.5 - size / 2) / Math.max(1, Math.min(this.width, this.height) * 0.5)) *
      Math.min(2, Math.max(0.05, this.options.zoom))
    );
  }
}
/**
 * Übersetzt einen normalisierten Farbkanal in das bisherige Byteformat.
 * @param channel Normalisierter RGBA-Farbkanal.
 */
function toColorByte(channel: number): number {
  return Math.round(channel * 255);
}
