/* src/app/shared/scroll-reveal.directive.ts */
import { afterNextRender, booleanAttribute, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { ScrollRevealService } from '../core/services/scroll-reveal.service';

/** Aktiviert einmalige Scroll-Reveals und lässt Inhalte ohne erlaubte Bewegung sichtbar. */
@Directive({
  selector: '[dcrScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  /** Erlaubt Komponenten, die Einfahrt gezielt pro Element einzuschalten. */
  readonly enabled = input(true, { alias: 'dcrScrollReveal', transform: booleanAttribute });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollReveal = inject(ScrollRevealService);

  constructor() {
    afterNextRender(() => {
      if (!this.enabled()) {
        return;
      }

      this.element.classList.add('is-reveal-ready');
      const cleanup = this.scrollReveal.register(this.element, () => {
        this.element.classList.add('is-in-view');
      });
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
