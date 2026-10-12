/* src/app/shared/reference-case-study/controllers/catalog-flow.ts */
import { signal, type NgZone, type Signal } from '@angular/core';
import type { PortfolioProject } from '../../../core/models/reference-project.models';
import { CatalogFlowRenderer } from './catalog-flow-renderer';
/** Verwaltet Canvas-Lifecycle, Sichtbarkeit und responsive Auflösung des Archiv-Heros. */
export class CatalogFlow {
  readonly isVisible = signal(false);                        // Sichtbarkeit der Archiv-Hero-Fläche.
  private canvas?: HTMLCanvasElement;                        // Aktuelles Canvas des Komponenten-Templates.
  private context?: CanvasRenderingContext2D;                // Aktiver Zeichenkontext des Canvas.
  private animationId = 0;                                   // Laufender Animations-Frame.
  private resizeObserver?: ResizeObserver;                   // Beobachtet responsive Canvas-Abmessungen.
  private visibilityObserver?: IntersectionObserver;         // Beobachtet die Sichtbarkeit des Heros.
  private readonly renderer = new CatalogFlowRenderer();     // Partikelzeichnung ohne Angular-Abhängigkeit.
  private readonly drawCallback = this.drawFrame.bind(this); // Stabiler Callback für alle Animations-Frames.

  /**
   * Verbindet Canvas-Lifecycle mit dem aktuellen Projekt und Angular.
   * @param project Aktuell ausgewählte Case Study.
   * @param zone Angular-Zone für Animationen außerhalb der Change Detection.
   */
  constructor(
    private readonly project: Signal<PortfolioProject | undefined>,
    private readonly zone: NgZone,
  ) {}

  /**
   * Verbindet das nach dem Rendern verfügbare Canvas mit der Sichtbarkeitsprüfung.
   * @param canvas Aktuelles Canvas oder fehlendes Element beim Entfernen.
   */
  connect(canvas: HTMLCanvasElement | undefined): void {
    this.stop();
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = undefined;
    this.canvas = canvas;
    this.isVisible.set(false);
    if (!canvas || typeof window === 'undefined') return;
    if (typeof IntersectionObserver === 'undefined') {
      this.isVisible.set(true);
      return;
    }
    this.observeVisibility(canvas);
  }

  /** Synchronisiert die Animation mit Projekt und Hero-Sichtbarkeit. */
  synchronize(): void {
    if (!this.canAnimate()) {
      this.stop();
      return;
    }
    queueMicrotask(this.restart.bind(this));
  }

  /** Stoppt die Animation und entfernt sämtliche Canvas-Observer. */
  destroy(): void {
    this.stop();
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = undefined;
    this.canvas = undefined;
    this.isVisible.set(false);
  }

  /**
   * Beobachtet die tatsächliche Hero-Fläche statt eines isolierten Canvas-Ausschnitts.
   * @param canvas Aktuelles Canvas der Archiv-Hero-Fläche.
   */
  private observeVisibility(canvas: HTMLCanvasElement): void {
    this.visibilityObserver = new IntersectionObserver(this.updateVisibility.bind(this), { threshold: [0, 0.08, 0.2] });
    this.visibilityObserver.observe(canvas.closest('.project-detail__hero') ?? canvas);
  }

  /**
   * Übernimmt die Sichtbarkeit der beobachteten Hero-Fläche.
   * @param entries Sichtbarkeitsmeldungen des Hero-Observers.
   */
  private updateVisibility(entries: IntersectionObserverEntry[]): void {
    this.isVisible.set(Boolean(entries[0]?.isIntersecting));
    if (!this.isVisible()) this.stop();
  }

  /** Prüft, ob das aktuelle Projekt eine sichtbare Archiv-Animation benötigt. */
  private canAnimate(): boolean {
    return Boolean(this.canvas && this.project()?.slug === 'grafikdesign-katalog' && this.isVisible());
  }

  /** Initialisiert Zeichenkontext und Größenprüfung für die sichtbare Hero-Fläche. */
  private restart(): void {
    this.stop();
    if (!this.canAnimate() || !this.connectContext()) return;
    this.resizeObserver = new ResizeObserver(this.resize.bind(this));
    this.resizeObserver.observe(this.canvas!);
    this.resize();
    this.renderer.seed(this.canvas!.getBoundingClientRect());
    if (isMotionReduced()) this.renderFrame();
    else this.zone.runOutsideAngular(this.startFrames.bind(this));
  }

  /** Verbindet den verfügbaren zweidimensionalen Zeichenkontext. */
  private connectContext(): boolean {
    this.context = this.canvas?.getContext('2d', { alpha: true }) ?? undefined;
    return Boolean(this.context);
  }

  /** Plant den ersten Animations-Frame außerhalb der Angular-Zone. */
  private startFrames(): void {
    this.animationId = requestAnimationFrame(this.drawCallback);
  }

  /** Zeichnet eine Animationsstufe und plant den nächsten sichtbaren Frame. */
  private drawFrame(): void {
    this.renderFrame();
    if (this.context && this.isVisible()) this.animationId = requestAnimationFrame(this.drawCallback);
  }

  /** Zeichnet ausschließlich eine weiterhin sichtbare Canvas-Fläche. */
  private renderFrame(): void {
    if (!this.canvas || !this.context) return;
    if (!this.isVisible()) {
      this.stop();
      return;
    }
    this.renderer.draw(this.context, this.canvas.getBoundingClientRect());
  }

  /** Stoppt Animations-Frames und Größenprüfung der bisherigen Zeichenfläche. */
  private stop(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = 0;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.context = undefined;
  }

  /** Passt die Canvas-Auflösung an die aktuelle sichtbare Größe an. */
  private resize(): void {
    if (!this.canvas || !this.context) return;
    /**
     * Aktuelle sichtbare Canvas-Abmessungen und begrenzte Pixeldichte.
     */
    const dimensions = getCanvasDimensions(this.canvas);
    if (this.canvas.width === dimensions.width && this.canvas.height === dimensions.height) return;
    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;
    this.context.setTransform(dimensions.ratio, 0, 0, dimensions.ratio, 0, 0);
    this.renderer.seed(this.canvas.getBoundingClientRect());
  }
}

/**
 * Berechnet die physische Canvas-Auflösung aus sichtbarer Größe und Pixeldichte.
 * @param canvas Aktuelles Canvas der Archiv-Hero-Fläche.
 */
function getCanvasDimensions(canvas: HTMLCanvasElement): { width: number; height: number; ratio: number } {
  /**
   * An die ursprüngliche Obergrenze angepasste Pixeldichte.
   */
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  /**
   * Sichtbare Größe der Canvas-Fläche im aktuellen Layout.
   */
  const rect = canvas.getBoundingClientRect();
  return {
    width: Math.max(1, Math.floor(rect.width * ratio)),
    height: Math.max(1, Math.floor(rect.height * ratio)),
    ratio,
  };
}

/** Prüft die Bewegungspräferenzen für die Canvas-Animation. */
function isMotionReduced(): boolean {
  return (
    ['off', 'reduced'].includes(document.documentElement.dataset['motion'] ?? '') ||
    document.documentElement.dataset['comfort'] === 'simple' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
