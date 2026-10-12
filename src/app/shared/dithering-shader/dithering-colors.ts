/* src/app/shared/dithering-shader/dithering-colors.ts */
import type { RgbaColor } from './dithering.models';
/**
 * Löst CSS-Tokens im Kontext des Shader-Hosts auf.
 * @param host Hostelement mit den geerbten Design-Tokens.
 * @param value Zu prüfende CSS-Farbe oder Variable.
 */
export function resolveCssColor(host: HTMLElement, value: string): RgbaColor {
  /**
   * Temporäres Element für die native CSS-Farbauflösung.
   */
  const probe = document.createElement('span');
  probe.style.color = value;
  host.appendChild(probe);
  /**
   * Vom Browser berechnete Farbe einschließlich geerbter Tokens.
   */
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return parseCssColor(resolved);
}
/**
 * Übersetzt eine berechnete RGB-Farbe in normalisierte GPU-Kanäle.
 * @param value Vom Browser berechneter CSS-Farbwert.
 */
export function parseCssColor(value: string): RgbaColor {
  /**
   * Farbkanäle des vom Browser verwendeten RGB-Formats.
   */
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return [0, 0, 0, 0];
  return normalizeColor(
    match[1]
      .split(/[ ,/]+/)
      .filter(Boolean)
      .map(Number),
  );
}
/**
 * Normalisiert RGB-Kanäle und begrenzt den optionalen Alphawert.
 * @param channels Farbkanäle des berechneten CSS-Farbwerts.
 */
function normalizeColor(channels: readonly number[]): RgbaColor {
  return [
    clamp((channels[0] ?? 0) / 255),
    clamp((channels[1] ?? 0) / 255),
    clamp((channels[2] ?? 0) / 255),
    clamp(channels[3] ?? 1),
  ];
}
/**
 * Begrenzt einen Farbkanal auf den normalisierten Wertebereich.
 * @param value Numerischer Farbkanal.
 */
function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
