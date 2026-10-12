/* src/app/shared/dithering-shader/dithering-program.ts */
import type { ShaderUniforms } from './dithering.models';
import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from './shader-sources';
/** Nullable Uniform-Locations vor der vollständigen Prüfung. */
type UniformLocations = { readonly [Key in keyof ShaderUniforms]: WebGLUniformLocation | null };
/** Temporäre Shader-Ressourcen während des Programmaufbaus. */
interface ShaderPair {
  readonly vertex?: WebGLShader;
  readonly fragment?: WebGLShader;
}
/**
 * Erstellt den unverändert konfigurierten WebGL2-Kontext.
 * @param canvas Canvas des Shader-Hosts.
 */
export function createWebGlContext(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  return canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    desynchronized: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: 'high-performance',
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: false,
  });
}
/**
 * Erstellt das GPU-Programm und gibt temporäre Shader wieder frei.
 * @param gl Aktiver WebGL2-Kontext.
 */
export function createShaderProgram(gl: WebGL2RenderingContext): WebGLProgram | undefined {
  /**
   * Für das Linking vorbereitete Vertex- und Fragment-Programme.
   */
  const shaders: ShaderPair = {
    vertex: compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE),
    fragment: compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE),
  };
  try {
    return shaders.vertex && shaders.fragment ? linkProgram(gl, shaders.vertex, shaders.fragment) : undefined;
  } finally {
    deleteShaders(gl, shaders);
  }
}
/**
 * Kompiliert eine einzelne Shader-Stufe.
 * @param gl Aktiver WebGL2-Kontext.
 * @param type WebGL-Kennung der Shader-Stufe.
 * @param source Unveränderter GLSL-Quelltext.
 */
function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | undefined {
  /**
   * Neue GPU-Ressource für die gewünschte Shader-Stufe.
   */
  const shader = gl.createShader(type);
  if (!shader) return undefined;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : rejectShader(gl, shader);
}
/**
 * Protokolliert einen Compilerfehler und gibt die Shader-Ressource frei.
 * @param gl Aktiver WebGL2-Kontext.
 * @param shader Nicht erfolgreich kompilierte Shader-Ressource.
 */
function rejectShader(gl: WebGL2RenderingContext, shader: WebGLShader): undefined {
  console.warn('Dithering-Shader konnte nicht kompiliert werden.', gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
}
/**
 * Verknüpft die beiden vorbereiteten Shader-Stufen.
 * @param gl Aktiver WebGL2-Kontext.
 * @param vertex Kompiliertes Vertex-Programm.
 * @param fragment Kompiliertes Fragment-Programm.
 */
function linkProgram(gl: WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader): WebGLProgram | undefined {
  /**
   * Neues GPU-Programm für das Linking beider Shader-Stufen.
   */
  const program = gl.createProgram();
  if (!program) return undefined;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : rejectProgram(gl, program);
}
/**
 * Protokolliert einen Linking-Fehler und gibt das GPU-Programm frei.
 * @param gl Aktiver WebGL2-Kontext.
 * @param program Nicht erfolgreich verknüpftes GPU-Programm.
 */
function rejectProgram(gl: WebGL2RenderingContext, program: WebGLProgram): undefined {
  console.warn('Dithering-Shader konnte nicht verlinkt werden.', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
}
/**
 * Gibt alle angelegten temporären Shader-Stufen frei.
 * @param gl Aktiver WebGL2-Kontext.
 * @param shaders Während der Initialisierung angelegte Shader-Ressourcen.
 */
function deleteShaders(gl: WebGL2RenderingContext, shaders: ShaderPair): void {
  if (shaders.vertex) gl.deleteShader(shaders.vertex);
  if (shaders.fragment) gl.deleteShader(shaders.fragment);
}
/**
 * Löst die benötigten Uniform-Locations genau einmal auf.
 * @param gl Aktiver WebGL2-Kontext.
 * @param program Erfolgreich verknüpftes GPU-Programm.
 */
export function resolveUniforms(gl: WebGL2RenderingContext, program: WebGLProgram): ShaderUniforms | undefined {
  /**
   * Vollständiger Satz der vom bisherigen Shader erwarteten Uniforms.
   */
  const locations: UniformLocations = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    time: gl.getUniformLocation(program, 'u_time'),
    speed: gl.getUniformLocation(program, 'u_speed'),
    intensity: gl.getUniformLocation(program, 'u_intensity'),
    zoom: gl.getUniformLocation(program, 'u_zoom'),
    frontColor: gl.getUniformLocation(program, 'u_front_color'),
    backColor: gl.getUniformLocation(program, 'u_back_color'),
    ditherSize: gl.getUniformLocation(program, 'u_dither_size'),
    shape: gl.getUniformLocation(program, 'u_shape'),
  };
  return hasUniforms(locations) ? locations : undefined;
}
/**
 * Prüft die Vollständigkeit der Uniform-Locations.
 * @param locations Noch ungeprüfte Uniform-Locations des GPU-Programms.
 */
function hasUniforms(locations: UniformLocations): locations is ShaderUniforms {
  return Object.values(locations).every(Boolean);
}
