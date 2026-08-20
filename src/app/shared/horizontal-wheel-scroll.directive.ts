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
  /** Horizontales Ziel innerhalb des Hosts. */
  readonly dcrHorizontalWheel = input<HTMLElement | undefined>();

  /** Eigenständiger Sticky-Viewport; davor liegende Inhalte bleiben normal scrollbar. */
  readonly dcrHorizontalSticky = input<HTMLElement | undefined>();

  /** Section, deren zusätzliche Höhe den horizontalen Scrollweg bereitstellt. */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Hält Scroll- und Resize-Arbeit aus der Angular-Change-Detection heraus. */
  private readonly ngZone = inject(NgZone);

  /** Beobachtet Größenänderungen am Track. */
  private resizeObserver?: ResizeObserver;

  /** Aktuell berechneter Dokumentstart der gepinnten Strecke. */
  private scrollStart = 0;

  /** Scrollbare horizontale Distanz in Pixeln. */
  private scrollDistance = 0;

  /** Gebündelter Render-Frame für Scroll-Updates. */
  private scrollFrameId = 0;

  /** Gebündelter Render-Frame für Layout-Neuberechnungen. */
  private layoutFrameId = 0;

  /** Initialisiert die scrollgekoppelte Strecke nach dem Rendern des Tracks. */
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scheduleScrollUpdate, { passive: true });
      window.addEventListener('resize', this.scheduleLayoutUpdate, { passive: true });

      const target = this.scrollTarget();
      const sticky = this.stickyElement();
      if (target) {
        this.resizeObserver = new ResizeObserver(this.scheduleLayoutUpdate);
        this.resizeObserver.observe(target);
        sticky && this.resizeObserver.observe(sticky);

        const introduction = sticky?.previousElementSibling;
        if (introduction instanceof HTMLElement) {
          this.resizeObserver.observe(introduction);
        }
      }

      this.scheduleLayoutUpdate();
    });
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

  /** Navigiert im gepinnten Zustand per Pfeiltaste vorwärts. */
  @HostListener('keydown.arrowright', ['$event'])
  onArrowRight(event: Event): void {
    this.navigateByKeyboard(event as KeyboardEvent, 1);
  }

  /** Navigiert im gepinnten Zustand per Pfeiltaste rückwärts. */
  @HostListener('keydown.arrowleft', ['$event'])
  onArrowLeft(event: Event): void {
    this.navigateByKeyboard(event as KeyboardEvent, -1);
  }

  /** Bündelt Scroll-Ereignisse auf maximal einen DOM-Schreibzugriff pro Frame. */
  private readonly scheduleScrollUpdate = (): void => {
    if (this.scrollFrameId) {
      return;
    }

    this.scrollFrameId = window.requestAnimationFrame(() => {
      this.scrollFrameId = 0;
      this.updateHorizontalProgress();
    });
  };

  /** Berechnet die Pinning-Strecke nach Größenänderungen neu. */
  private readonly scheduleLayoutUpdate = (): void => {
    window.cancelAnimationFrame(this.layoutFrameId);
    this.layoutFrameId = window.requestAnimationFrame(() => {
      this.layoutFrameId = 0;
      this.updateLayout();
    });
  };

  /** Setzt die Section-Höhe aus Viewport und realer Track-Breite zusammen. */
  private updateLayout(): void {
    const target = this.scrollTarget();
    const sticky = this.stickyElement();
    const canPin = window.matchMedia('(min-width: 901px) and (min-height: 800px)').matches;

    if (!target || !sticky || !canPin) {
      this.scrollDistance = 0;
      this.host.style.removeProperty('height');
      this.host.style.removeProperty('--dcr-horizontal-progress');
      this.host.classList.remove('is-scroll-pinned');
      return;
    }

    const headerHeight = this.headerHeight();
    const stickyHeight = Math.max(1, window.innerHeight - headerHeight);
    this.scrollDistance = Math.max(0, target.scrollWidth - target.clientWidth);

    if (this.scrollDistance <= 1) {
      this.host.style.removeProperty('height');
      this.host.classList.remove('is-scroll-pinned');
      return;
    }

    const stickyOffset = sticky.offsetTop;
    this.host.style.height = `${stickyOffset + stickyHeight + this.scrollDistance}px`;
    this.host.classList.add('is-scroll-pinned');
    this.scrollStart = window.scrollY + this.host.getBoundingClientRect().top + stickyOffset - headerHeight;
    this.updateHorizontalProgress();
  }

  /** Überträgt den normalen Seitenfortschritt verlustfrei auf den Track. */
  private updateHorizontalProgress(): void {
    const target = this.scrollTarget();

    if (!target || this.scrollDistance <= 1) {
      return;
    }

    const progress = Math.min(1, Math.max(0, (window.scrollY - this.scrollStart) / this.scrollDistance));
    target.scrollLeft = progress * this.scrollDistance;
    this.host.style.setProperty('--dcr-horizontal-progress', progress.toFixed(4));
  }

  /** Verschiebt je Tastendruck etwa eine halbe sichtbare Kartenbreite. */
  private navigateByKeyboard(event: KeyboardEvent, direction: -1 | 1): void {
    const target = this.scrollTarget();
    if (!target) {
      return;
    }

    event.preventDefault();
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
    const value = getComputedStyle(document.documentElement).getPropertyValue('--dcr-header-height');
    return Number.parseFloat(value) || 0;
  }

  /** Respektiert die globale Motion-Einstellung. */
  private scrollBehavior(): ScrollBehavior {
    return document.documentElement.dataset['motion'] === 'full' ? 'smooth' : 'auto';
  }
}
