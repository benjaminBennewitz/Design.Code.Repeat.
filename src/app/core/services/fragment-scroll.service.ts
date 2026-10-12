/* src/app/core/services/fragment-scroll.service.ts */
import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Event, NavigationStart, Router, Scroll } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FragmentScrollTask } from './fragment-scroll-task';

/** Verbindet Router-Ereignisse mit einem einzelnen abbrechbaren Ankersprung. */
@Injectable({ providedIn: 'root' })
export class FragmentScrollService {
  private readonly document = inject(DOCUMENT);     // Dokument mit den Routenankern.
  private readonly router = inject(Router);         // Ereignisse für Navigation und Scroll-Restoration.
  private readonly destroyRef = inject(DestroyRef); // Lebenszyklus der Router-Anbindung.
  private scrollTask?: FragmentScrollTask;          // Aktueller oder zuletzt abgeschlossener Ankersprung.

  /** Registriert Router-Ereignisse und die abschließende Sprungfreigabe. */
  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.handleRouterEvent.bind(this));
    this.destroyRef.onDestroy(this.cancelScroll.bind(this));
  }

  /**
   * Startet Ankersprünge und bricht sie vor der nächsten Navigation ab.
   * @param event Aktuelles Router-Ereignis.
   */
  private handleRouterEvent(event: Event): void {
    if (event instanceof NavigationStart) this.cancelScroll();
    if (event instanceof Scroll && event.anchor) this.scrollToFragment(event.anchor, event.position);
  }

  /**
   * Startet einen Ankersprung mit der optionalen Scroll-Restoration des Routers.
   * @param anchor Angeforderte Element-ID.
   * @param position Gespeicherte horizontale und vertikale Scrollposition.
   */
  private scrollToFragment(anchor: string, position: [number, number] | null): void {
    /**
     * Im Browser verfügbares Fenster für den Ankersprung.
     */
    const windowRef = this.document.defaultView;
    if (!windowRef) return;
    this.cancelScroll();
    this.scrollTask = new FragmentScrollTask(this.document, windowRef, anchor, position);
    this.scrollTask.start();
  }

  /** Gibt den aktuellen Sprung und dessen Browser-Listener frei. */
  private cancelScroll(): void {
    this.scrollTask?.stop();
    this.scrollTask = undefined;
  }
}
