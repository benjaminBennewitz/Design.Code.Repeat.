/** Prüft sichere Texte und reaktive Sprachwechsel ohne Layout-Duplikate. */
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextRevealDirective } from './text-reveal.directive';

@Component({
  standalone: true,
  imports: [TextRevealDirective],
  template: '<h2 [dcrTextReveal]="text()"></h2>',
})
class TestHostComponent {
  readonly text = signal<string | undefined>('Design.  Code.\nRepeat.');
}

describe('TextRevealDirective', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('erhält Text und Leerraum ohne zusätzliche zugängliche Kopie', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h2') as HTMLElement;
    expect(heading.textContent).toBe('Design.  Code.\nRepeat.');
    expect(heading.querySelectorAll('.dcr-text-reveal__word')).toHaveLength(3);
    expect(heading.hasAttribute('aria-label')).toBe(false);
    expect(heading.querySelector('[aria-hidden]')).toBeNull();
  });

  it('ersetzt Wörter bei einem Sprachwechsel und akzeptiert optionale Texte', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.text.set('Work done.');
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h2') as HTMLElement;
    expect(heading.textContent).toBe('Work done.');
    expect(heading.querySelectorAll('.dcr-text-reveal__word')).toHaveLength(2);
    fixture.componentInstance.text.set(undefined);
    fixture.detectChanges();
    expect(heading.textContent).toBe('');
  });

  it('behandelt Markup als Text und begrenzt die Staffelung langer Absätze', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.text.set('<img src=x> ' + 'Wort '.repeat(80));
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h2') as HTMLElement;
    expect(heading.querySelector('img')).toBeNull();
    expect(heading.textContent).toContain('<img src=x>');
    const lastWord = heading.lastElementChild as HTMLElement;
    expect(lastWord.style.getPropertyValue('--dcr-word-delay')).toBe('432ms');
  });
});
