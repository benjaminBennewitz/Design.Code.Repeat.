/* src/app/shared/scroll-reveal.directive.ts */
import { afterNextRender, booleanAttribute, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { ScrollRevealService } from '../core/services/scroll-reveal.service';

/** Aktiviert einmalige Scroll-Reveals und lässt Inhalte ohne erlaubte Bewegung sichtbar. */
@Directive({
  selector: '[dcrScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  readonly enabled = input(true, { alias: 'dcrScrollReveal', transform: booleanAttribute }); // Erlaubt Komponenten, die Einfahrt gezielt pro Element einzuschalten.

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement; // Hostelement der Direktive.
  private readonly destroyRef = inject(DestroyRef); // Lebenszyklus der Direktive.
  private readonly scrollReveal = inject(ScrollRevealService); // Zentrale einmalige Reveal-Auslösung.

  /** Registriert den Reveal nach dem ersten vollständigen Render-Durchlauf. */
  constructor() {
    afterNextRender(this.registerReveal.bind(this));
  }

  /** Verbindet die einmalige Sichtbarkeitsänderung mit dem zentralen Reveal-Service. */
  private registerReveal(): void {
    if (!this.enabled()) return;
    this.element.classList.add('is-reveal-ready');
    /**
    * Abmeldung der Reveal-Beobachtung beim Entfernen des Elements.
    */
    const cleanup = this.scrollReveal.register(this.element, this.showContent.bind(this));
    this.destroyRef.onDestroy(cleanup);
  }

  /** Markiert den Inhalt dauerhaft als aufgedeckt. */
  private showContent(): void {
    this.element.classList.add('is-in-view');
  }
}
