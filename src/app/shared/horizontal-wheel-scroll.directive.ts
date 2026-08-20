/**
 * @file Horizontaler Wheel-Scroll für fokussierte Showcase-Sections.
 * @description Übersetzt vertikales Mausrad-Scrolling innerhalb der Section in horizontales Scrolling.
 * An Anfang und Ende wird das Wheel bewusst nicht blockiert, damit der normale Body-Scroll weiterläuft.
 */

import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/** Wiederverwendbare Wheel-to-horizontal-Scroll-Direktive mit optionalem Scroll-Ziel. */
@Directive({
  selector: '[dcrHorizontalWheel]',
  standalone: true,
})
export class HorizontalWheelScrollDirective {
  /** Optionales horizontales Ziel; ohne Angabe scrollt der Host selbst. */
  readonly dcrHorizontalWheel = input<HTMLElement | undefined>();

  /** Host-Element, das Wheel- und Keyboard-Events für die gesamte Showcase-Section empfängt. */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Übersetzt primäre Wheel-Bewegung in horizontales Scrollen. */
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    const target = this.scrollTarget();
    const maxScrollLeft = target.scrollWidth - target.clientWidth;

    if (maxScrollLeft <= 1) {
      return;
    }

    const movingForward = event.deltaY > 0;
    const movingBackward = event.deltaY < 0;
    const atStart = target.scrollLeft <= 1;
    const atEnd = target.scrollLeft >= maxScrollLeft - 1;

    if ((movingForward && atEnd) || (movingBackward && atStart)) {
      return;
    }

    event.preventDefault();
    target.scrollLeft += event.deltaY;
  }

  /** Unterstützt dieselbe Interaktion per Tastatur, wenn ein Kind des Hosts fokussiert ist. */
  @HostListener('keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent): void {
    event.preventDefault();
    const target = this.scrollTarget();
    target.scrollBy({ left: Math.max(280, target.clientWidth * 0.45), behavior: this.scrollBehavior() });
  }

  /** Unterstützt Rückwärtsnavigation per Tastatur. */
  @HostListener('keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent): void {
    event.preventDefault();
    const target = this.scrollTarget();
    target.scrollBy({ left: -Math.max(280, target.clientWidth * 0.45), behavior: this.scrollBehavior() });
  }

  /** Liefert das konfigurierte Scroll-Ziel oder den Host als Fallback. */
  private scrollTarget(): HTMLElement {
    return this.dcrHorizontalWheel() ?? this.host;
  }

  /** Respektiert die globale Motion-Einstellung. */
  private scrollBehavior(): ScrollBehavior {
    return document.documentElement.dataset['motion'] === 'full' ? 'smooth' : 'auto';
  }
}
