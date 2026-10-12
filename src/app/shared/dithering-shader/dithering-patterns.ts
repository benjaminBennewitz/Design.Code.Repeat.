/* src/app/shared/dithering-shader/dithering-patterns.ts */
import type { DitheringShape } from './dithering.models';
/**
 * Liefert die Musterenergie einer normalisierten Position.
 * @param shape Prozedurales Muster des Fallbacks.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 */
export function getNormalizedEnergy(shape: DitheringShape, x: number, y: number): number {
  if (shape === 'cat') return getCatEnergy(x, y);
  if (shape === 'liquid') return smoothStep(0.9, 1.3, getLiquidDensity(x, y));
  return getSwirlEnergy(x, y);
}
/**
 * Liefert die Energie des statischen Wellenmusters.
 * @param x Horizontale Pixelposition.
 * @param y Vertikale Pixelposition.
 * @param width Interne Canvas-Breite.
 * @param height Interne Canvas-Höhe.
 */
export function getWaveEnergy(x: number, y: number, width: number, height: number): number {
  /**
   * Horizontale Wellenposition im bisherigen Koordinatensystem.
   */
  const waveX = (x / Math.max(1, width)) * 8 - 4;
  return (
    1 -
    smoothStep(
      -0.95,
      0.95,
      (1 - y / Math.max(1, height) - 0.48) * 4.2 + Math.cos(0.5 * waveX) * Math.sin(1.5 * waveX) * 0.88,
    )
  );
}
/**
 * Liefert die weich begrenzte Katzensilhouette mit den bisherigen Farbbändern.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 */
function getCatEnergy(x: number, y: number): number {
  return Math.min(
    1,
    Math.max(0, getCatSilhouette(x, y) * (0.58 + 0.22 * Math.sin(x * 8.5 + y * 5.8) + 0.12 * Math.cos(y * 13))),
  );
}
/**
 * Verbindet die Teilmasken der unveränderten Katzensilhouette.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 */
function getCatSilhouette(x: number, y: number): number {
  return Math.max(
    ellipseMask(x, y, 0, -0.34, 0.38, 0.34),
    ellipseMask(x, y, 0, 0.3, 0.47, 0.62),
    diamondMask(x, y, -0.27, -0.62, 0.18, 0.28),
    diamondMask(x, y, 0.27, -0.62, 0.18, 0.28),
    ellipseMask(x, y, -0.2, 0.82, 0.2, 0.16),
    ellipseMask(x, y, 0.2, 0.82, 0.2, 0.16),
    rotatedEllipseMask(x, y, 0.47, 0.34, 0.17, 0.5, -0.58),
    rotatedEllipseMask(x, y, 0.62, 0.02, 0.14, 0.34, -0.82),
  );
}
/**
 * Berechnet die Dichte der drei statischen Flüssigkeitszentren.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 */
function getLiquidDensity(x: number, y: number): number {
  return (
    0.3 / (Math.hypot(x + 0.45, y + 0.08) ** 2 + 0.08) +
    0.26 / (Math.hypot(x - 0.32, y - 0.12) ** 2 + 0.08) +
    0.2 / (Math.hypot(x - 0.05, y + 0.48) ** 2 + 0.07)
  );
}
/**
 * Liefert die Energie des statischen Swirl-Musters.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 */
function getSwirlEnergy(x: number, y: number): number {
  return getSwirlPattern(Math.hypot(x, y), Math.atan2(y, x));
}
/**
 * Verbindet Spiral-, Ring- und Arm-Anteil des Swirls.
 * @param distance Abstand zur Mustermitte.
 * @param angle Winkel zur Mustermitte.
 */
function getSwirlPattern(distance: number, angle: number): number {
  return (
    (Math.sin(distance * 17.5 - angle * 5.8) * 0.58 +
      Math.sin(distance * 23.5) * 0.24 +
      Math.cos(angle * 2.6 + distance * 8.2) * 0.18) *
      0.5 +
    0.5
  );
}
/**
 * Liefert eine weich begrenzte Ellipsenmaske.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 * @param centerX Horizontale Maskenmitte.
 * @param centerY Vertikale Maskenmitte.
 * @param radiusX Horizontaler Maskenradius.
 * @param radiusY Vertikaler Maskenradius.
 */
function ellipseMask(x: number, y: number, centerX: number, centerY: number, radiusX: number, radiusY: number): number {
  return 1 - smoothStep(0.84, 1, ((x - centerX) / radiusX) ** 2 + ((y - centerY) / radiusY) ** 2);
}
/**
 * Liefert die rautenförmige Maske einer Ohrspitze.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 * @param centerX Horizontale Maskenmitte.
 * @param centerY Vertikale Maskenmitte.
 * @param radiusX Horizontaler Maskenradius.
 * @param radiusY Vertikaler Maskenradius.
 */
function diamondMask(x: number, y: number, centerX: number, centerY: number, radiusX: number, radiusY: number): number {
  return 1 - smoothStep(0.82, 1, Math.abs((x - centerX) / radiusX) + Math.abs((y - centerY) / radiusY));
}
/**
 * Liefert eine rotierte Ellipsenmaske für ein Schwanzsegment.
 * @param x Normalisierte X-Position.
 * @param y Normalisierte Y-Position.
 * @param centerX Horizontale Maskenmitte.
 * @param centerY Vertikale Maskenmitte.
 * @param radiusX Horizontaler Maskenradius.
 * @param radiusY Vertikaler Maskenradius.
 * @param rotation Drehwinkel des Schwanzsegments.
 */
function rotatedEllipseMask(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
): number {
  /**
   * In das lokale Maskensystem gedrehte Position.
   */
  const point = rotatePoint(x - centerX, y - centerY, rotation);
  return ellipseMask(point.x, point.y, 0, 0, radiusX, radiusY);
}
/**
 * Dreht eine Position um den Ursprung ihres Maskensystems.
 * @param x Horizontale Position relativ zur Maskenmitte.
 * @param y Vertikale Position relativ zur Maskenmitte.
 * @param rotation Drehwinkel der Maske.
 */
function rotatePoint(x: number, y: number, rotation: number): { x: number; y: number } {
  return { x: x * Math.cos(rotation) - y * Math.sin(rotation), y: x * Math.sin(rotation) + y * Math.cos(rotation) };
}
/**
 * Interpoliert weich zwischen den beiden bisherigen Maskengrenzen.
 * @param edge0 Untere Interpolationsgrenze.
 * @param edge1 Obere Interpolationsgrenze.
 * @param value Zu interpolierender Maskenwert.
 */
function smoothStep(edge0: number, edge1: number, value: number): number {
  /**
   * Auf den gültigen Interpolationsbereich begrenzter Maskenwert.
   */
  const t = Math.min(1, Math.max(0, (value - edge0) / Math.max(0.0001, edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
