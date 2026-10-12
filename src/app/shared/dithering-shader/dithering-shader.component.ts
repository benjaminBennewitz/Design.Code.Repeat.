/* src/app/shared/dithering-shader/dithering-shader.component.ts */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import type { DitheringMatrixType, DitheringShape, DitheringOptions, RgbaColor } from './dithering.models';
import { DitheringRenderer } from './dithering-renderer';
import { DitheringFallback } from './dithering-fallback';
import { resolveCssColor } from './dithering-colors';
/** Verbindet Dithering-Einstellungen mit GPU-Rendering, Fallback und Browser-Lifecycle. */
@Component({
  selector: 'dcr-dithering-shader',
  standalone: true,
  templateUrl: './dithering-shader.component.html',
  styleUrl: './dithering-shader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DitheringShaderComponent implements AfterViewInit, OnDestroy, DitheringOptions {
  @ViewChild('canvasRef') private readonly canvasRef?: ElementRef<HTMLCanvasElement>; // Canvas des GPU- oder Fallback-Renderers.
  private readonly hostRef = inject(ElementRef<HTMLElement>);                         // Größe und CSS-Farbkontext des Hosts.
  private readonly ngZone = inject(NgZone);                                           // Animationen außerhalb der Angular-Zone.
  private renderer?: DitheringRenderer;                                               // Vollständig initialisiertes GPU-Programm.
  private resizeObserver?: ResizeObserver;                                            // Größenänderungen des Shader-Hosts.
  private rootObserver?: MutationObserver;                                            // Theme-, Kontrast- und Motion-Änderungen.
  private visibilityObserver?: IntersectionObserver;                                  // Sichtbarkeit des Shader-Hosts.
  private animationFrameId = 0;                                                       // Aktuell ausstehender Animations-Frame.
  private animationStart = 0;                                                         // Startzeit der aktuellen Animationssequenz.
  private isVisible = true;                                                           // Sichtbarkeit bis zur ersten Observer-Meldung.
  private frontColor: RgbaColor = [167 / 255, 1, 25 / 255, 1];                        // Normalisierte GPU-Vordergrundfarbe.
  private backColor: RgbaColor = [0, 0, 0, 0];                                        // Normalisierte GPU-Hintergrundfarbe.
  private readonly animationCallback = this.animate.bind(this);                       // Stabiler Callback für alle Animations-Frames.
  @Input() colorBack = 'transparent';                                                 // CSS-Farbe der transparenten oder dunklen Musterflächen.
  @Input() colorFront = 'var(--dcr-color-primary)';                                   // CSS-Farbe der sichtbaren Dither-Pixel.
  @Input() shape: DitheringShape = 'swirl';                                           // Prozedurales Muster des Shader-Feldes.
  @Input() type: DitheringMatrixType = '4x4';                                         // Bayer-Matrix des GPU-Ditherings.
  @Input() pxSize = 4;                                                                // Größe eines Shader-Pixels in CSS-Pixeln.
  @Input() speed = 0.9;                                                               // Bewegungsgeschwindigkeit des GPU-Musters.
  @Input() intensity = 1;                                                             // Dichte und Stärke des GPU-Musters.
  @Input() zoom = 1;                                                                  // Mathematischer Ausschnitt ohne größere Renderfläche.
  @HostBinding('attr.aria-hidden') protected readonly ariaHidden = 'true';            // Dekorative Darstellung ohne Screenreader-Ausgabe.

  /** Initialisiert Farben, Renderauflösung, Renderer und Browser-Observer. */
  ngAfterViewInit(): void {
    /**
     * Nach dem Rendern verfügbares Canvas des Shader-Hosts.
     */
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.refreshColors();
    this.resizeCanvas();
    this.renderer = DitheringRenderer.create(canvas);
    this.renderer?.resize(canvas);
    this.bindObservers();
    if (this.renderer) this.updateAnimationState();
    else this.renderFallback(canvas);
  }
  /** Gibt Browser-Observer, Animations-Frames und GPU-Ressourcen frei. */
  ngOnDestroy(): void {
    this.stopAnimation();
    this.resizeObserver?.disconnect();
    this.rootObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    this.renderer?.destroy();
    this.renderer = undefined;
  }
  /** Registriert Größen-, Sichtbarkeits- und Theme-Beobachter. */
  private bindObservers(): void {
    this.bindHostObservers();
    this.bindThemeObserver();
  }
  /** Registriert Beobachter für die Größe und Sichtbarkeit des Hosts. */
  private bindHostObservers(): void {
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    this.resizeObserver.observe(this.hostRef.nativeElement);
    this.visibilityObserver = new IntersectionObserver(this.handleVisibility.bind(this), { threshold: 0.05 });
    this.visibilityObserver.observe(this.hostRef.nativeElement);
  }
  /** Registriert die bisherigen globalen Theme- und Motion-Attribute. */
  private bindThemeObserver(): void {
    this.rootObserver = new MutationObserver(this.handleThemeChange.bind(this));
    this.rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-contrast', 'data-color-vision', 'data-motion'],
    });
  }
  /** Zeichnet nach einer Größenänderung den aktuellen GPU- oder Fallback-Zustand. */
  private handleResize(): void {
    this.resizeCanvas();
    this.renderCurrentFrame();
  }
  /**
   * Aktualisiert den sichtbarkeitsabhängigen Animationszustand.
   * @param entries Sichtbarkeitsmeldungen für den Shader-Host.
   */
  private handleVisibility(entries: IntersectionObserverEntry[]): void {
    this.isVisible = entries[0]?.isIntersecting ?? false;
    this.updateAnimationState();
  }
  /** Übernimmt Theme-Farben und aktualisiert Rendering sowie Bewegungszustand. */
  private handleThemeChange(): void {
    this.refreshColors();
    if (this.renderer) this.updateAnimationState();
    else this.renderCurrentFrame();
  }
  /** Synchronisiert Canvas-Größe und GPU-Viewport mit der gewünschten Pixelgröße. */
  private resizeCanvas(): void {
    /**
     * Canvas mit der zuletzt verwendeten Renderauflösung.
     */
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    resizeRenderCanvas(canvas, this.hostRef.nativeElement, this.pxSize);
    this.renderer?.resize(canvas);
  }
  /** Startet oder statisiert das GPU-Rendering gemäß Sichtbarkeit und Motion-Modus. */
  private updateAnimationState(): void {
    this.stopAnimation();
    if (!this.renderer) return;
    if (!this.shouldAnimate()) {
      this.animationStart = 0;
      this.renderFrame(0);
    } else this.ngZone.runOutsideAngular(this.startAnimation.bind(this));
  }
  /** Plant den ersten Animations-Frame außerhalb der Angular-Zone. */
  private startAnimation(): void {
    this.animationFrameId = window.requestAnimationFrame(this.animationCallback);
  }
  /** Beendet einen noch ausstehenden Animations-Frame. */
  private stopAnimation(): void {
    if (typeof window !== 'undefined') window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
  }
  /**
   * Zeichnet eine GPU-Animationsstufe und plant den nächsten sichtbaren Frame.
   * @param timestamp Vom Browser gelieferter Frame-Zeitpunkt.
   */
  private animate(timestamp: number): void {
    this.renderFrame(this.getElapsedSeconds(timestamp));
    if (this.shouldAnimate()) this.startAnimation();
    else this.animationFrameId = 0;
  }
  /** Zeichnet den aktuellen Zustand nach Resize oder Theme-Wechsel. */
  private renderCurrentFrame(): void {
    /**
     * Für den aktuellen Zeichenauftrag verfügbares Canvas.
     */
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    if (this.renderer) this.renderFrame(this.shouldAnimate() ? this.getElapsedSeconds(performance.now()) : 0);
    else this.renderFallback(canvas);
  }
  /**
   * Liefert die seit dem Animationsstart verstrichenen Sekunden.
   * @param timestamp Vom Browser gelieferter Zeitwert.
   */
  private getElapsedSeconds(timestamp: number): number {
    this.animationStart ||= timestamp;
    return (timestamp - this.animationStart) / 1000;
  }
  /**
   * Übergibt die aktuellen Einstellungen an den GPU-Renderer.
   * @param elapsedSeconds Seit dem Animationsstart verstrichene Sekunden.
   */
  private renderFrame(elapsedSeconds: number): void {
    /**
     * Für den aktuellen GPU-Auftrag verfügbares Canvas.
     */
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) this.renderer?.draw(canvas, this, elapsedSeconds, this.frontColor, this.backColor);
  }
  /** Übernimmt Vorder- und Hintergrundfarbe aus dem aktuellen CSS-Kontext. */
  private refreshColors(): void {
    this.frontColor = resolveCssColor(this.hostRef.nativeElement, this.colorFront);
    this.backColor = resolveCssColor(this.hostRef.nativeElement, this.colorBack);
  }
  /** Prüft die bisherige Kombination aus Sichtbarkeit und globalem Motion-Modus. */
  private shouldAnimate(): boolean {
    return this.isVisible && !['reduced', 'off'].includes(document.documentElement.dataset['motion'] ?? '');
  }
  /**
   * Zeichnet bei fehlendem GPU-Programm genau einen statischen Canvas2D-Frame.
   * @param canvas Canvas des Shader-Hosts.
   */
  private renderFallback(canvas: HTMLCanvasElement): void {
    /**
     * Verfügbarer zweidimensionaler Fallback-Zeichenkontext.
     */
    const context = canvas.getContext('2d', { alpha: true });
    if (context)
      new DitheringFallback(canvas.width, canvas.height, this, this.frontColor, this.backColor).draw(context);
  }
}
/**
 * Berechnet die interne Canvas-Größe aus Hostgröße und gewünschter Pixelgröße.
 * @param canvas Canvas mit der bisherigen Renderauflösung.
 * @param host Hostelement mit den aktuellen Darstellungsabmessungen.
 * @param pxSize Gewünschte Größe eines Shader-Pixels in CSS-Pixeln.
 */
function resizeRenderCanvas(canvas: HTMLCanvasElement, host: HTMLElement, pxSize: number): void {
  /**
   * Ganzzahlige Pixelgröße mit der bisherigen Untergrenze.
   */
  const pixelSize = Math.max(1, Math.round(pxSize));
  /**
   * Neue interne Auflösung des Shader-Feldes.
   */
  const size = {
    width: Math.max(1, Math.ceil(host.clientWidth / pixelSize)),
    height: Math.max(1, Math.ceil(host.clientHeight / pixelSize)),
  };
  if (canvas.width !== size.width || canvas.height !== size.height) {
    canvas.width = size.width;
    canvas.height = size.height;
  }
}
