/* src/app/shared/text-reveal.directive.spec.ts */
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
  readonly text = signal<string | undefined>('Design.  Code.\nRepeat.'); // Reaktiver Text der Testkomponente.
}

/** Registriert die fachlichen Regressionstests dieses Bereichs. */
function registerTests(): void {
  afterEach(cleanUpTest);
  it('erhält Text und Leerraum ohne zusätzliche zugängliche Kopie', verifyTextSpacing);
  it('ersetzt Wörter bei einem Sprachwechsel und akzeptiert optionale Texte', verifyTextChanges);
  it('behandelt Markup als Text und begrenzt die Staffelung langer Absätze', verifySafeMarkup);
}

/** Gibt Testinstanzen und simulierte Browserzustände frei. */
function cleanUpTest(): void {
  TestBed.resetTestingModule();
}

/** Erhält Text und Leerraum ohne zusätzliche zugängliche Kopie. */
function verifyTextSpacing(): void {
  /**
   * Isolierte Angular-Testinstanz der Textdarstellung.
   */
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  /**
   * Gerenderte Überschrift für Text- und DOM-Prüfungen.
   */
  const heading = fixture.nativeElement.querySelector('h2') as HTMLElement;
  expect(heading.textContent).toBe('Design.  Code.\nRepeat.');
  expect(heading.querySelectorAll('.dcr-text-reveal__word')).toHaveLength(3);
  expect(heading.hasAttribute('aria-label')).toBe(false);
  expect(heading.querySelector('[aria-hidden]')).toBeNull();
}

/** Ersetzt Wörter bei einem Sprachwechsel und akzeptiert optionale Texte. */
function verifyTextChanges(): void {
  /**
   * Isolierte Angular-Testinstanz der Textdarstellung.
   */
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  fixture.componentInstance.text.set('Work done.');
  fixture.detectChanges();
  /**
   * Gerenderte Überschrift für Text- und DOM-Prüfungen.
   */
  const heading = fixture.nativeElement.querySelector('h2') as HTMLElement;
  expect(heading.textContent).toBe('Work done.');
  expect(heading.querySelectorAll('.dcr-text-reveal__word')).toHaveLength(2);
  fixture.componentInstance.text.set(undefined);
  fixture.detectChanges();
  expect(heading.textContent).toBe('');
}

/** Behandelt Markup als Text und begrenzt die Staffelung langer Absätze. */
function verifySafeMarkup(): void {
  /**
   * Isolierte Angular-Testinstanz der Textdarstellung.
   */
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.componentInstance.text.set('<img src=x> ' + 'Wort '.repeat(80));
  fixture.detectChanges();
  /**
   * Gerenderte Überschrift für Text- und DOM-Prüfungen.
   */
  const heading = fixture.nativeElement.querySelector('h2') as HTMLElement;
  expect(heading.querySelector('img')).toBeNull();
  expect(heading.textContent).toContain('<img src=x>');
  /**
   * Letzte Wortspanne zur Prüfung der maximalen Verzögerung.
   */
  const lastWord = heading.lastElementChild as HTMLElement;
  expect(lastWord.style.getPropertyValue('--dcr-word-delay')).toBe('432ms');
}

describe('TextRevealDirective', registerTests);
