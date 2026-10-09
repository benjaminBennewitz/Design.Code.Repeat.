/** Wortweise Text-Reveals mit der vorhandenen Scroll-Auslösung. */
import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Directive({
  selector: '[dcrTextReveal]',
  standalone: true,
  hostDirectives: [ScrollRevealDirective],
  host: { class: 'dcr-text-reveal' },
})
export class TextRevealDirective {
  /** Reiner Text bleibt auch bei Sprach- oder Inhaltswechseln synchron. */
  readonly text = input.required<string | undefined | null>({ alias: 'dcrTextReveal' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => this.renderText(this.text() ?? ''));
  }

  /** Erhält Leerraum und natürliche Wortgrenzen ohne doppelte Screenreader-Texte. */
  private renderText(text: string): void {
    while (this.element.firstChild) {
      this.renderer.removeChild(this.element, this.element.firstChild);
    }

    let wordIndex = 0;
    for (const part of text.split(/(\s+)/u).filter(Boolean)) {
      if (/^\s+$/u.test(part)) {
        this.renderer.appendChild(this.element, this.renderer.createText(part));
        continue;
      }

      const word = this.renderer.createElement('span');
      this.renderer.addClass(word, 'dcr-text-reveal__word');
      this.renderer.setStyle(word, '--dcr-word-delay', `${Math.min(wordIndex++, 24) * 18}ms`);
      this.renderer.appendChild(word, this.renderer.createText(part));
      this.renderer.appendChild(this.element, word);
    }
  }
}
