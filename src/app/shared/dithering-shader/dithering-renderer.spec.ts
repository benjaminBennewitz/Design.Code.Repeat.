import { DitheringRenderer } from './dithering-renderer';
import { parseCssColor } from './dithering-colors';

/** Kontrolliert GPU-Erstellung, Fehlerpfade und Uniform-Werte ohne echte GPU. */
class TestGl {
  readonly VERTEX_SHADER = 1;                    // Kennung der Vertex-Stufe.
  readonly FRAGMENT_SHADER = 2;                  // Kennung der Fragment-Stufe.
  readonly COMPILE_STATUS = 3;                   // Abfrage des Compilerstatus.
  readonly LINK_STATUS = 4;                      // Abfrage des Linkerstatus.
  readonly BLEND = 5;                            // Abschaltbare Mischfunktion.
  readonly DEPTH_TEST = 6;                       // Abschaltbarer Tiefentest.
  readonly CULL_FACE = 7;                        // Abschaltbare Rückseitenprüfung.
  readonly TRIANGLES = 8;                        // Primitive des bildschirmfüllenden Dreiecks.
  compileSuccess = true;                         // Steuerbarer Erfolg der Shader-Kompilierung.
  linkSuccess = true;                            // Steuerbarer Erfolg des Programm-Linkings.
  missingUniform = '';                           // Gezielt fehlende Uniform-Location.
  readonly program = {};                         // Identität des erstellten GPU-Programms.
  readonly deletedShaders: object[] = [];        // Freigegebene temporäre Shader.
  readonly deletedPrograms: object[] = [];       // Freigegebene GPU-Programme.
  readonly values = new Map<string, number[]>(); // Zuletzt übertragene Uniform-Werte.
  drawCount = 0;                                 // Anzahl tatsächlich gezeichneter Frames.
  /** Erstellt eine eindeutig identifizierbare Shader-Ressource. */
  createShader(): object {
    return {};
  }
  /** Übernimmt im Double keine Shader-Quellen. */
  shaderSource(): void {}
  /** Startet im Double keine echte Kompilierung. */
  compileShader(): void {}
  /** Liefert den konfigurierten Compilerstatus. */
  getShaderParameter(): boolean {
    return this.compileSuccess;
  }
  /** Liefert eine neutrale Compilerdiagnose. */
  getShaderInfoLog(): string {
    return 'Test compiler failure';
  }
  /**
   * Erfasst eine freigegebene Shader-Ressource.
   * @param shader Freigegebene Shader-Identität.
   */
  deleteShader(shader: object): void {
    this.deletedShaders.push(shader);
  }
  /** Liefert die stabile Programmidentität. */
  createProgram(): object {
    return this.program;
  }
  /** Übernimmt im Double keine Shader-Verknüpfung. */
  attachShader(): void {}
  /** Startet im Double kein echtes Linking. */
  linkProgram(): void {}
  /** Liefert den konfigurierten Linkerstatus. */
  getProgramParameter(): boolean {
    return this.linkSuccess;
  }
  /** Liefert eine neutrale Linkerdiagnose. */
  getProgramInfoLog(): string {
    return 'Test linker failure';
  }
  /**
   * Erfasst ein freigegebenes Programm.
   * @param program Freigegebene Programmidentität.
   */
  deleteProgram(program: object): void {
    this.deletedPrograms.push(program);
  }
  /**
   * Liefert eine benannte Location oder den gezielt simulierten Ausfall.
   * @param program Programm der angeforderten Location.
   * @param name Name des Shader-Parameters.
   */
  getUniformLocation(program: object, name: string): string | null {
    return program === this.program && name !== this.missingUniform ? name : null;
  }
  /** Übernimmt im Double keine Zustandsänderung. */
  disable(): void {}
  /** Aktiviert im Double kein GPU-Programm. */
  useProgram(): void {}
  /** Übernimmt im Double keinen GPU-Viewport. */
  viewport(): void {}
  /**
   * Erfasst einen skalaren Uniform-Wert.
   * @param name Parametername der Location.
   * @param value Übertragener Wert.
   */
  uniform1f(name: string, value: number): void {
    this.values.set(name, [value]);
  }
  /**
   * Erfasst einen ganzzahligen Uniform-Wert.
   * @param name Parametername der Location.
   * @param value Übertragener Wert.
   */
  uniform1i(name: string, value: number): void {
    this.values.set(name, [value]);
  }
  /**
   * Erfasst einen zweidimensionalen Uniform-Wert.
   * @param name Parametername der Location.
   * @param x Horizontale Komponente.
   * @param y Vertikale Komponente.
   */
  uniform2f(name: string, x: number, y: number): void {
    this.values.set(name, [x, y]);
  }
  /**
   * Erfasst eine vollständige RGBA-Farbe.
   * @param name Parametername der Location.
   * @param values Übertragene Farbkanäle.
   */
  uniform4f(name: string, ...values: number[]): void {
    this.values.set(name, values);
  }
  /** Erfasst einen abgeschlossenen Zeichenauftrag. */
  drawArrays(): void {
    this.drawCount++;
  }
}

/** Registriert Ressourcen- und Parameterprüfungen des Renderers. */
function registerRendererTests(): void {
  afterEach(restoreMocks);
  it('verzichtet ohne WebGL2 auf den GPU-Renderer', expectMissingContext);
  it('gibt Shader nach einem Compilerfehler frei', expectCompileFailure);
  it('gibt Programm und Shader nach einem Linkerfehler frei', expectLinkFailure);
  it('gibt das Programm bei fehlenden Uniforms frei', expectMissingUniform);
  it('überträgt begrenzte Werte und gibt das fertige Programm frei', expectFrameAndDisposal);
  it('normalisiert CSS-Farben und transparente Ersatzwerte', expectCssColors);
}

/** Entfernt die pro Test angelegten Diagnose-Spies. */
function restoreMocks(): void {
  vi.restoreAllMocks();
}

/**
 * Erstellt ein Canvas-Double mit kontrollierbarem WebGL-Kontext.
 * @param gl Verfügbarer Kontext oder simulierter Kontextausfall.
 */
function createCanvas(gl: TestGl | null): HTMLCanvasElement {
  return { width: 120, height: 80, getContext: getContext } as unknown as HTMLCanvasElement;
  /** Liefert ausschließlich den vom Test vorgegebenen Kontext. */
  function getContext(): TestGl | null {
    return gl;
  }
}

/** Prüft den unmittelbaren Übergang zum Canvas2D-Fallback. */
function expectMissingContext(): void {
  expect(DitheringRenderer.create(createCanvas(null))).toBeUndefined();
}

/** Prüft die vollständige Freigabe fehlgeschlagener Compiler-Ressourcen. */
function expectCompileFailure(): void {
  /**
   * Kontext mit gezielt fehlgeschlagenen Shader-Stufen.
   */
  const gl = new TestGl();
  gl.compileSuccess = false;
  vi.spyOn(console, 'warn').mockImplementation(ignoreWarning);
  expect(DitheringRenderer.create(createCanvas(gl))).toBeUndefined();
  expect(gl.deletedShaders).toHaveLength(2);
  expect(gl.deletedPrograms).toHaveLength(0);
}

/** Unterdrückt die erwartete Diagnose eines gezielt simulierten GPU-Fehlers. */
function ignoreWarning(): void {}

/** Prüft die Freigabe des erfolglos verknüpften Programms und beider Shader. */
function expectLinkFailure(): void {
  /**
   * Kontext mit gezielt fehlgeschlagenem Programm-Linking.
   */
  const gl = new TestGl();
  gl.linkSuccess = false;
  vi.spyOn(console, 'warn').mockImplementation(ignoreWarning);
  expect(DitheringRenderer.create(createCanvas(gl))).toBeUndefined();
  expect(gl.deletedShaders).toHaveLength(2);
  expect(gl.deletedPrograms).toEqual([gl.program]);
}

/** Prüft, dass unvollständige Uniforms keinen aktiven Renderer hinterlassen. */
function expectMissingUniform(): void {
  /**
   * Kontext mit einem gezielt fehlenden Farbparameter.
   */
  const gl = new TestGl();
  gl.missingUniform = 'u_front_color';
  expect(DitheringRenderer.create(createCanvas(gl))).toBeUndefined();
  expect(gl.deletedShaders).toHaveLength(2);
  expect(gl.deletedPrograms).toEqual([gl.program]);
}

/** Prüft die bisherigen Parametergrenzen und die Freigabe nach dem Zeichnen. */
function expectFrameAndDisposal(): void {
  /**
   * Erfolgreicher GPU-Kontext mit aufgezeichneten Uniform-Werten.
   */
  const gl = new TestGl();
  /**
   * Vollständig angelegter Renderer des Test-Canvas.
   */
  const renderer = DitheringRenderer.create(createCanvas(gl))!;
  renderer.draw(
    createCanvas(gl),
    { shape: 'cat', type: '8x8', pxSize: 1, zoom: 9, speed: -1, intensity: 9 },
    2,
    [1, 0, 0, 1],
    [0, 0, 0, 0],
  );
  expectFrameValues(gl);
  renderer.destroy();
  expect(gl.deletedPrograms).toEqual([gl.program]);
}

/**
 * Prüft die vollständigen Parametergrenzen eines gezeichneten Frames.
 * @param gl Kontext mit den zuletzt übertragenen Uniform-Werten.
 */
function expectFrameValues(gl: TestGl): void {
  expect(gl.values.get('u_resolution')).toEqual([120, 80]);
  expect(gl.values.get('u_zoom')).toEqual([2]);
  expect(gl.values.get('u_speed')).toEqual([0.05]);
  expect(gl.values.get('u_intensity')).toEqual([1.6]);
  expect(gl.values.get('u_shape')).toEqual([3]);
  expect(gl.values.get('u_dither_size')).toEqual([8]);
  expect(gl.drawCount).toBe(1);
}

/** Prüft Kanalgrenzen, Alpha und den defensiven Ersatz für unbekannte Farben. */
function expectCssColors(): void {
  expect(parseCssColor('rgb(255, 128, 0)')).toEqual([1, 128 / 255, 0, 1]);
  expect(parseCssColor('rgba(300, -1, 255, 0.4)')).toEqual([1, 0, 1, 0.4]);
  expect(parseCssColor('transparent')).toEqual([0, 0, 0, 0]);
  expect(parseCssColor('invalid')).toEqual([0, 0, 0, 0]);
}

describe('DitheringRenderer', registerRendererTests);
