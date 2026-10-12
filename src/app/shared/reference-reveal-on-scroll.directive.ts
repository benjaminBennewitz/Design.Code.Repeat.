/* src/app/shared/reference-reveal-on-scroll.directive.ts */
import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { ScrollRevealService } from '../core/services/scroll-reveal.service';

/** Aktiviert Referenz-Reveals auch bei schnellen Scroll-Sprüngen dauerhaft. */
@Directive({
  selector: '[bpReveal]',
  standalone: true,
})
export class RevealOnScrollDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollReveal = inject(ScrollRevealService);

  constructor() {
    afterNextRender(() => {
      this.element.classList.add('bp-reveal');
      const cleanup = this.scrollReveal.register(this.element, () => {
        this.element.classList.add('bp-reveal--visible');
      });
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
