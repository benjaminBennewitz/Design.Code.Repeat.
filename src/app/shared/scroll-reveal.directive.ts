/** Aktiviert einmalige Scroll-Reveals und lässt Inhalte ohne erlaubte Bewegung sichtbar. */
import { afterNextRender, booleanAttribute, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[dcrScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  /** Erlaubt Komponenten, die Einfahrt gezielt pro Element einzuschalten. */
  readonly enabled = input(true, { alias: 'dcrScrollReveal', transform: booleanAttribute });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const windowRef = this.element.ownerDocument.defaultView;
      const root = this.element.ownerDocument.documentElement;
      if (!this.enabled() || !windowRef || !('IntersectionObserver' in windowRef)
        || windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches
        || root.dataset['motion'] === 'off' || root.dataset['motion'] === 'reduced'
        || root.dataset['comfort'] === 'simple') {
        return;
      }

      this.element.classList.add('is-reveal-ready');
      const observer = new windowRef.IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          this.element.classList.add('is-in-view');
          observer.disconnect();
        }
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
      observer.observe(this.element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
