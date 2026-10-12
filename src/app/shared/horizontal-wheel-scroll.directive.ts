/* src/app/shared/horizontal-wheel-scroll.directive.ts */
/**
 * @file Scrollgekoppelte horizontale Showcase-Navigation.
 * @description Pinnt eine Section im Desktop-Viewport und leitet den regulären
 * Seitenfortschritt deterministisch auf ein horizontales Scroll-Ziel ab.
 */

import { AfterViewInit, Directive, ElementRef, HostListener, NgZone, OnDestroy, inject, input } from '@angular/core';

/** Synchronisiert vertikalen Seitenfortschritt mit einem horizontalen Showcase. */
@Directive({
  selector: '[dcrHorizontalWheel]',
  standalone: true,
})
export class HorizontalWheelScrollDirective implements AfterViewInit, OnDestroy {
  readonly dcrHorizontalWheel = input<HTMLElement | undefined>();                    // Horizontales Ziel innerhalb des Hosts.
  readonly dcrHorizontalSticky = input<HTMLElement | undefined>();                   // Eigenständiger Sticky-Viewport; davor liegende Inhalte bleiben normal scrollbar.
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement; // Section, deren zusätzliche Höhe den horizontalen Scrollweg bereitstellt.
  private readonly ngZone = inject(NgZone);                                          // Hält Scroll- und Resize-Arbeit aus der Angular-Change-Detection heraus.
  private resizeObserver?: ResizeObserver;                                           // Beobachtet Größenänderungen am Track.
  private scrollStart = 0;                                                           // Aktuell berechneter Dokumentstart der gepinnten Strecke.
  private scrollDistance = 0;                                                        // Scrollbare horizontale Distanz in Pixeln.
  private scrollFrameId = 0;                                                         // Gebündelter Render-Frame für Scroll-Updates.
  private layoutFrameId = 0;                                                         // Gebündelter Render-Frame für Layout-Neuberechnungen.

  /** Initialisiert die scrollgekoppelte Strecke außerhalb der Angular-Zone. */
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(this.initializeObservation.bind(this));
  }

  /** Registriert globale Scroll-Ereignisse und die Track-Größenbeobachtung. */
  private initializeObservation(): void {
    window.addEventListener('scroll', this.scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleLayoutUpdate, { passive: true });
    this.observeTrack();
    this.scheduleLayoutUpdate();
  }

  /** Beobachtet den Track und seine für das Sticky-Layout relevanten Nachbarn. */
  private observeTrack(): void {
    /**
     * Für die horizontale Strecke konfigurierter Track.
     */
    const target = this.scrollTarget();
    /**
     * Konfigurierter Sticky-Viewport mit seiner optionalen Einleitung.
     */
    const sticky = this.stickyElement();
    if (!target) return;
    this.resizeObserver = new ResizeObserver(this.scheduleLayoutUpdate);
    this.resizeObserver.observe(target);
    if (sticky) this.resizeObserver.observe(sticky);
    if (sticky?.previousElementSibling instanceof HTMLElement)
      this.resizeObserver.observe(sticky.previousElementSibling);
  }

  /** Entfernt Listener, Observer, Frames und die dynamische Section-Höhe. */
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scheduleScrollUpdate);
    window.removeEventListener('resize', this.scheduleLayoutUpdate);
    window.cancelAnimationFrame(this.scrollFrameId);
    window.cancelAnimationFrame(this.layoutFrameId);
    this.resizeObserver?.disconnect();
    this.host.style.removeProperty('height');
    this.host.style.removeProperty('--dcr-horizontal-progress');
    this.host.classList.remove('is-scroll-pinned');
  }

  /**
   * Navigiert im gepinnten Zustand per Pfeiltaste vorwärts.
   * @param event Auslösendes Tastaturereignis.
   */
  @HostListener('keydown.arrowright', ['$event'])
  onArrowRight(event: Event): void {
    this.navigateByKeyboard(event as KeyboardEvent, 1);
  }

  /**
   * Navigiert im gepinnten Zustand per Pfeiltaste rückwärts.
   * @param event Auslösendes Tastaturereignis.
   */
  @HostListener('keydown.arrowleft', ['$event'])
  onArrowLeft(event: Event): void {
    this.navigateByKeyboard(event as KeyboardEvent, -1);
  }

  private readonly scheduleScrollUpdate =
    /** Bündelt Scroll-Ereignisse auf maximal einen DOM-Schreibzugriff pro Frame. */ (): void => {
      if (this.scrollFrameId) {
        return;
      }

      this.scrollFrameId = window.requestAnimationFrame(this.flushScrollUpdate.bind(this));
    }; // Bündelt Scroll-Ereignisse auf maximal einen DOM-Schreibzugriff pro Frame.
  private readonly scheduleLayoutUpdate = /** Berechnet die Pinning-Strecke nach Größenänderungen neu. */ (): void => {
    window.cancelAnimationFrame(this.layoutFrameId);
    this.layoutFrameId = window.requestAnimationFrame(this.flushLayoutUpdate.bind(this));
  }; // Berechnet die Pinning-Strecke nach Größenänderungen neu.

  /** Synchronisiert die gepinnte Strecke mit den aktuellen Track- und Viewport-Maßen. */
  private updateLayout(): void {
    /**
     * Im Desktop-Viewport verfügbare Track- und Sticky-Elemente.
     */
    const elements = this.pinnableElements();
    if (!elements) return this.clearPinnedLayout();
    this.scrollDistance = Math.max(0, elements.target.scrollWidth - elements.target.clientWidth);
    if (this.scrollDistance <= 1) {
      this.host.style.removeProperty('height');
      this.host.classList.remove('is-scroll-pinned');
      return;
    }
    this.configurePinnedLayout(elements.sticky);
    this.updateHorizontalProgress();
  }

  /** Liefert Track und Sticky-Viewport ausschließlich bei erlaubtem Desktop-Pinning. */
  private pinnableElements(): { target: HTMLElement; sticky: HTMLElement } | undefined {
    /**
     * Konfigurierter horizontaler Track.
     */
    const target = this.scrollTarget();
    /**
     * Konfigurierter Sticky-Viewport.
     */
    const sticky = this.stickyElement();
    return target && sticky && window.matchMedia('(min-width: 901px) and (min-height: 800px)').matches
      ? { target, sticky }
      : undefined;
  }

  /** Entfernt die dynamische Strecke beim Wechsel in ein ungepinntes Layout. */
  private clearPinnedLayout(): void {
    this.scrollDistance = 0;
    this.host.style.removeProperty('height');
    this.host.style.removeProperty('--dcr-horizontal-progress');
    this.host.classList.remove('is-scroll-pinned');
  }

  /**
   * Überträgt die gemessene Strecke in Section-Höhe und Scroll-Startposition.
   * @param sticky Konfigurierter Sticky-Viewport.
   */
  private configurePinnedLayout(sticky: HTMLElement): void {
    /**
     * Headerhöhe für die sichtbare Sticky-Fläche und den Streckenbeginn.
     */
    const headerHeight = this.headerHeight();
    /**
     * Position des Sticky-Viewports im normalen Dokumentfluss.
     */
    const stickyOffset = this.stickyOffset(sticky);
    this.host.style.height = `${stickyOffset + Math.max(1, window.innerHeight - headerHeight) + this.scrollDistance}px`;
    this.host.classList.add('is-scroll-pinned');
    this.scrollStart = window.scrollY + this.host.getBoundingClientRect().top + stickyOffset - headerHeight;
  }

  /**
   * Berechnet den normalen Flussabstand vor dem Sticky-Viewport.
   * @param sticky Konfigurierter Sticky-Viewport.
   */
  private stickyOffset(sticky: HTMLElement): number {
    /**
     * Optionaler Einleitungsblock unmittelbar vor dem Sticky-Viewport.
     */
    const introduction = sticky.previousElementSibling;
    if (!(introduction instanceof HTMLElement)) return 0;
    return (
      introduction.offsetTop +
      introduction.offsetHeight +
      (Number.parseFloat(getComputedStyle(introduction).marginBottom) || 0) +
      (Number.parseFloat(getComputedStyle(sticky).marginTop) || 0)
    );
  }

  /** Gibt den Scroll-Frame frei und überträgt den aktuellen Seitenfortschritt. */
  private flushScrollUpdate(): void {
    this.scrollFrameId = 0;
    this.updateHorizontalProgress();
  }

  /** Gibt den Layout-Frame frei und berechnet die Strecke neu. */
  private flushLayoutUpdate(): void {
    this.layoutFrameId = 0;
    this.updateLayout();
  }

  /** Überträgt den normalen Seitenfortschritt verlustfrei auf den Track. */
  private updateHorizontalProgress(): void {
    /**
     * Konfigurierter horizontaler Track.
     */
    const target = this.scrollTarget();

    if (!target || this.scrollDistance <= 1) {
      return;
    }

    /**
     * Auf die horizontale Strecke begrenzter Seitenfortschritt.
     */
    const progress = Math.min(1, Math.max(0, (window.scrollY - this.scrollStart) / this.scrollDistance));
    target.scrollLeft = progress * this.scrollDistance;
    this.host.style.setProperty('--dcr-horizontal-progress', progress.toFixed(4));
  }

  /**
   * Verschiebt je Tastendruck etwa eine halbe sichtbare Kartenbreite.
   * @param event Auslösendes Tastaturereignis.
   * @param direction Horizontale Navigationsrichtung.
   */
  private navigateByKeyboard(event: KeyboardEvent, direction: -1 | 1): void {
    /**
     * Konfigurierter horizontaler Track.
     */
    const target = this.scrollTarget();
    if (!target) return;
    event.preventDefault();
    /**
     * Vom Tastendruck angeforderter Scrollweg.
     */
    const distance = Math.max(280, target.clientWidth * 0.45) * direction;

    if (this.scrollDistance > 1) {
      window.scrollBy({ top: distance, behavior: this.scrollBehavior() });
      return;
    }

    target.scrollBy({ left: distance, behavior: this.scrollBehavior() });
  }

  /** Liefert den konfigurierten Track. */
  private scrollTarget(): HTMLElement | undefined {
    return this.dcrHorizontalWheel();
  }

  /** Liefert den gepinnten Karten-Viewport. */
  private stickyElement(): HTMLElement | undefined {
    return this.dcrHorizontalSticky();
  }

  /** Liest die zentrale Header-Höhe als Pixelwert. */
  private headerHeight(): number {
    /**
     * Aktueller CSS-Token der globalen Headerhöhe.
     */
    const value = getComputedStyle(document.documentElement).getPropertyValue('--dcr-header-height');
    return Number.parseFloat(value) || 0;
  }

  /** Respektiert die globale Motion-Einstellung. */
  private scrollBehavior(): ScrollBehavior {
    return document.documentElement.dataset['motion'] === 'full' ? 'smooth' : 'auto';
  }
}
