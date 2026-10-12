/* src/app/shared/dithering-shader/dithering.models.ts */
/** Unterstützte Bayer-Matrizen. */
export type DitheringMatrixType = '2x2' | '4x4' | '8x8';
/** Unterstützte prozedurale Muster. */
export type DitheringShape = 'swirl' | 'wave' | 'liquid' | 'cat';
/** RGBA-Farbe mit normalisierten Kanälen. */
export type RgbaColor = readonly [number, number, number, number];
/** Öffentliche Einstellungen für GPU-Rendering und statischen Fallback. */
export interface DitheringOptions {
  readonly shape: DitheringShape;
  readonly type: DitheringMatrixType;
  readonly pxSize: number;
  readonly speed: number;
  readonly intensity: number;
  readonly zoom: number;
}
/** Einmalig aufgelöste Uniform-Locations des GPU-Programms. */
export interface ShaderUniforms {
  readonly resolution: WebGLUniformLocation;
  readonly time: WebGLUniformLocation;
  readonly speed: WebGLUniformLocation;
  readonly intensity: WebGLUniformLocation;
  readonly zoom: WebGLUniformLocation;
  readonly frontColor: WebGLUniformLocation;
  readonly backColor: WebGLUniformLocation;
  readonly ditherSize: WebGLUniformLocation;
  readonly shape: WebGLUniformLocation;
}
