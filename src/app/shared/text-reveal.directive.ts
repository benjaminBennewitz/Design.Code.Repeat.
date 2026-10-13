/* src/app/shared/text-reveal.directive.ts */
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
  readonly text = input.required<string | undefined | null>({ alias: 'dcrTextReveal' }); // Reiner Text bleibt auch bei Sprach- oder Inhaltswechseln synchron.

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement; // Hostelement der Direktive.
  private readonly renderer = inject(Renderer2); // Renderer für die sichere Textdarstellung.

  /** Verbindet Eingabeänderungen mit der Wortdarstellung. */
  constructor() {
    effect(this.updateText.bind(this));
  }

  /** Synchronisiert die Wortdarstellung mit dem aktiven Eingabetext. */
  private updateText(): void {
    this.renderText(this.text() ?? '');
  }

  /**
  * Erhält Leerraum und natürliche Wortgrenzen ohne doppelte Screenreader-Texte.
  * @param text Aktueller Text einschließlich seiner natürlichen Wortabstände.
  */
  private renderText(text: string): void {
    this.clearText();
    /**
    * Laufender Wortindex für die begrenzte Reveal-Verzögerung.
    */
    let wordIndex = 0;
    for (const part of text.split(/(\s+)/u).filter(Boolean)) {
      if (/^\s+$/u.test(part)) this.appendSpace(part);
      else this.appendWord(part, wordIndex++);
    }
  }

  /** Entfernt die bisher gerenderten Textknoten vor einem Inhaltswechsel. */
  private clearText(): void {
    while (this.element.firstChild) {
      this.renderer.removeChild(this.element, this.element.firstChild);
    }
  }

  /**
  * Fügt den unveränderten Wortabstand als Textknoten ein.
  * @param space Ursprünglicher Leerraum zwischen zwei Wörtern.
  */
  private appendSpace(space: string): void {
    this.renderer.appendChild(this.element, this.renderer.createText(space));
  }

  /**
  * Erzeugt eine einzelne Wortspanne mit begrenzter Reveal-Verzögerung.
  * @param text Sichtbarer Text der Wortspanne.
  * @param index Position des Wortes im gesamten Text.
  */
  private appendWord(text: string, index: number): void {
    /**
    * Einzelne Wortspanne für die vorhandene CSS-Animation.
    */
    const word = this.renderer.createElement('span');
    this.renderer.addClass(word, 'dcr-text-reveal__word');
    this.renderer.setStyle(word, '--dcr-word-delay', `${Math.min(index, 24) * 18}ms`);
    this.renderer.appendChild(word, this.renderer.createText(text));
    this.renderer.appendChild(this.element, word);
  }
}
