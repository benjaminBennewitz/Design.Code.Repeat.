/* src/app/shared/dithering-shader/dithering-renderer.ts */
import type { DitheringOptions, RgbaColor, ShaderUniforms } from './dithering.models';
import { createWebGlContext, createShaderProgram, resolveUniforms } from './dithering-program';
/** Verwaltet GPU-Programm, Uniforms und einzelne Render-Frames. */
export class DitheringRenderer {
  /**
   * Verbindet die geprüften GPU-Ressourcen des Renderers.
   * @param gl Aktiver WebGL2-Kontext.
   * @param program Erfolgreich verknüpftes GPU-Programm.
   * @param uniforms Vollständig aufgelöste Uniform-Locations.
   */
  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly program: WebGLProgram,
    private readonly uniforms: ShaderUniforms,
  ) {
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(program);
  }
  /**
   * Erstellt einen Renderer nur bei vollständig verfügbaren GPU-Ressourcen.
   * @param canvas Canvas des Shader-Hosts.
   */
  static create(canvas: HTMLCanvasElement): DitheringRenderer | undefined {
    /**
     * Für das aktuelle Canvas verfügbarer WebGL2-Kontext.
     */
    const gl = createWebGlContext(canvas);
    if (!gl) return undefined;
    /**
     * Für den aktuellen Kontext verknüpftes Shader-Programm.
     */
    const program = createShaderProgram(gl);
    return program ? buildRenderer(gl, program) : undefined;
  }
  /**
   * Synchronisiert den GPU-Viewport mit der internen Canvas-Größe.
   * @param canvas Canvas mit bereits aktualisierter Renderauflösung.
   */
  resize(canvas: HTMLCanvasElement): void {
    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }
  /** Gibt das vollständig angelegte GPU-Programm frei. */
  destroy(): void {
    this.gl.deleteProgram(this.program);
  }
  /**
   * Zeichnet einen Frame mit den aktuellen öffentlichen Einstellungen.
   * @param canvas Canvas mit der aktuellen Renderauflösung.
   * @param options Aktuelle Shader-Einstellungen der Komponente.
   * @param elapsed Seit dem Animationsstart verstrichene Sekunden.
   * @param front Normalisierte Vordergrundfarbe.
   * @param back Normalisierte Hintergrundfarbe.
   */
  draw(canvas: HTMLCanvasElement, options: DitheringOptions, elapsed: number, front: RgbaColor, back: RgbaColor): void {
    this.gl.useProgram(this.program);
    this.updateGeometry(canvas, options, elapsed);
    this.updatePattern(options);
    this.gl.uniform4f(this.uniforms.frontColor, ...front);
    this.gl.uniform4f(this.uniforms.backColor, ...back);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
  /**
   * Aktualisiert Auflösung, Zeit und Ausschnitt des Shader-Feldes.
   * @param canvas Canvas mit der aktuellen Renderauflösung.
   * @param options Aktuelle Shader-Einstellungen der Komponente.
   * @param elapsed Seit dem Animationsstart verstrichene Sekunden.
   */
  private updateGeometry(canvas: HTMLCanvasElement, options: DitheringOptions, elapsed: number): void {
    this.gl.uniform2f(this.uniforms.resolution, canvas.width, canvas.height);
    this.gl.uniform1f(this.uniforms.time, elapsed);
    this.gl.uniform1f(this.uniforms.zoom, Math.min(2, Math.max(0.05, options.zoom)));
  }
  /**
   * Aktualisiert Geschwindigkeit, Dichte, Bayer-Matrix und Muster.
   * @param options Aktuelle Shader-Einstellungen der Komponente.
   */
  private updatePattern(options: DitheringOptions): void {
    this.gl.uniform1f(this.uniforms.speed, Math.max(0.05, options.speed));
    this.gl.uniform1f(this.uniforms.intensity, Math.min(1.6, Math.max(0.2, options.intensity)));
    this.gl.uniform1i(this.uniforms.ditherSize, options.type === '2x2' ? 2 : options.type === '8x8' ? 8 : 4);
    this.gl.uniform1i(
      this.uniforms.shape,
      options.shape === 'cat' ? 3 : options.shape === 'liquid' ? 2 : options.shape === 'wave' ? 1 : 0,
    );
  }
}
/**
 * Erstellt den Renderer nach vollständiger Uniform-Prüfung.
 * @param gl Aktiver WebGL2-Kontext.
 * @param program Erfolgreich verknüpftes GPU-Programm.
 */
function buildRenderer(gl: WebGL2RenderingContext, program: WebGLProgram): DitheringRenderer | undefined {
  /**
   * Einmalig aufgelöste Parameter des GPU-Programms.
   */
  const uniforms = resolveUniforms(gl, program);
  if (uniforms) return new DitheringRenderer(gl, program, uniforms);
  gl.deleteProgram(program);
  return undefined;
}
