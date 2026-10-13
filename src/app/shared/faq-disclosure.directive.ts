import { Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';

/** Animiert native FAQ-Details beim Öffnen und Schließen ohne feste Antwortgrößen. */
@Directive({ selector: 'details[dcrFaqDisclosure]', standalone: true })
export class FaqDisclosureDirective implements OnDestroy {
  private readonly details = inject<ElementRef<HTMLDetailsElement>>(ElementRef).nativeElement; // Natives Element samt Tastaturbedienung.
  private animation?: Animation; // Laufender, bei erneutem Klick umkehrbarer Übergang.
  private targetOpen?: boolean; // Gewünschter Zustand während des Übergangs.

  /**
   * Übernimmt nur die Aktivierung der Zusammenfassung.
   * @param event Maus- oder tastaturgenerierter Klick.
   */
  @HostListener('click', ['$event'])
  toggle(event: MouseEvent): void {
    if (!(event.target as Element).closest('summary')) return;
    event.preventDefault();
    /* Der aktuelle Zwischenstand verhindert Sprünge bei schnellen Folgeklicks. */
    const start = this.details.getBoundingClientRect().height;
    this.targetOpen = !(this.targetOpen ?? this.details.open);
    this.animation?.cancel();
    this.clearStyles();
    if (this.reducesMotion() || !this.details.animate) return this.finish();
    this.animate(start);
  }

  /**
   * Misst beide natürlichen Zustände und animiert ihre tatsächliche Höhe.
   * @param start Aktuelle sichtbare Höhe einschließlich Rahmen.
   */
  private animate(start: number): void {
    this.details.open = this.targetOpen ?? false;
    /* Die Zielhöhe wird vor dem Festhalten der bisherigen Höhe gemessen. */
    const end = this.details.getBoundingClientRect().height;
    this.details.open = true;
    this.details.style.height = `${start}px`;
    this.details.style.overflow = 'hidden';
    this.animation = this.details.animate(
      [{ height: `${start}px` }, { height: `${end}px` }],
      { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
    );
    this.animation.onfinish = this.finish.bind(this);
  }

  /** Prüft Systempräferenz und die vorhandenen Bewegungs- und Komforteinstellungen. */
  private reducesMotion(): boolean {
    /* Das Dokument des Elements funktioniert auch in isolierten Tests. */
    const document = this.details.ownerDocument;
    return document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
      || ['off', 'reduced'].includes(document.documentElement.dataset['motion'] ?? '')
      || document.documentElement.dataset['comfort'] === 'simple';
  }

  /** Stellt nach dem Übergang die natürliche, weiterhin responsive Darstellung wieder her. */
  private finish(): void {
    this.details.open = this.targetOpen ?? this.details.open;
    this.animation?.cancel();
    this.animation = undefined;
    this.targetOpen = undefined;
    this.clearStyles();
  }

  /** Entfernt ausschließlich die temporären Animationsgrößen. */
  private clearStyles(): void {
    this.details.style.removeProperty('height');
    this.details.style.removeProperty('overflow');
  }

  /** Gibt die Animation beim Entfernen durch Suche oder Navigation frei. */
  ngOnDestroy(): void {
    this.animation?.cancel();
    this.clearStyles();
  }
}
