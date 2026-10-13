/* src/app/shared/reference-reveal-on-scroll.directive.ts */
import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { ScrollRevealService } from '../core/services/scroll-reveal.service';

/** Aktiviert Referenz-Reveals auch bei schnellen Scroll-Sprüngen dauerhaft. */
@Directive({
  selector: '[bpReveal]',
  standalone: true,
})
export class RevealOnScrollDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement; // Hostelement der Direktive.
  private readonly destroyRef = inject(DestroyRef); // Lebenszyklus der Direktive.
  private readonly scrollReveal = inject(ScrollRevealService); // Zentrale einmalige Reveal-Auslösung.

  /** Registriert den Reveal nach dem ersten vollständigen Render-Durchlauf. */
  constructor() {
    afterNextRender(this.registerReveal.bind(this));
  }

  /** Verbindet die einmalige Sichtbarkeitsänderung mit dem zentralen Reveal-Service. */
  private registerReveal(): void {
    this.element.classList.add('bp-reveal');
    /**
    * Abmeldung der Reveal-Beobachtung beim Entfernen des Elements.
    */
    const cleanup = this.scrollReveal.register(this.element, this.showContent.bind(this));
    this.destroyRef.onDestroy(cleanup);
  }

  /** Markiert den Inhalt dauerhaft als aufgedeckt. */
  private showContent(): void {
    this.element.classList.add('bp-reveal--visible');
  }
}
