/**
 * @file Stabile Router-Sprünge zu verzögert gerenderten Abschnitten.
 * @description Wartet auf reale Anker und korrigiert Layoutverschiebungen während des initialen Sprungs.
 */
import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { NavigationStart, Router, Scroll } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FragmentScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private cancelScroll?: () => void;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.cancelScroll?.();
      }
      if (event instanceof Scroll && event.anchor) {
        this.scrollToFragment(event.anchor, event.position);
      }
    });
    this.destroyRef.onDestroy(() => this.cancelScroll?.());
  }

  /** Stabilisiert nur den angeforderten Sprung; Nutzerinteraktion beendet die Korrektur sofort. */
  private scrollToFragment(anchor: string, position: [number, number] | null): void {
    const windowRef = this.document.defaultView;
    if (!windowRef) {
      return;
    }
    this.cancelScroll?.();
    const root = this.document.documentElement;
    root.classList.add('dcr-anchor-is-scrolling');
    let frameId = 0;
    let stableFrames = 0;
    let previousTop = Number.NaN;
    let previousHeight = 0;
    const startedAt = windowRef.performance.now();
    const finish = (): void => {
      windowRef.cancelAnimationFrame(frameId);
      root.classList.remove('dcr-anchor-is-scrolling');
      windowRef.removeEventListener('wheel', finish);
      windowRef.removeEventListener('touchstart', finish);
      windowRef.removeEventListener('pointerdown', finish);
      windowRef.removeEventListener('keydown', finish);
      this.cancelScroll = undefined;
    };
    this.cancelScroll = finish;
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
      windowRef.addEventListener(type, finish, { passive: true });
    }
    const align = (): void => {
      const target = this.document.getElementById(anchor);
      const expired = windowRef.performance.now() - startedAt > 2500;
      if (target && !target.classList.contains('home-deferred-placeholder')) {
        const headerHeight = this.document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
        const top = position?.[1] ?? Math.max(0, windowRef.scrollY + target.getBoundingClientRect().top - headerHeight);
        const height = root.scrollHeight;
        windowRef.scrollTo({ top, left: position?.[0] ?? 0, behavior: 'instant' });
        stableFrames = Math.abs(top - previousTop) < 1 && height === previousHeight ? stableFrames + 1 : 0;
        previousTop = top;
        previousHeight = height;
        if ((stableFrames >= 4 && this.document.fonts.status !== 'loading') || expired) {
          finish();
          if (anchor === 'main-content') {
            target.focus({ preventScroll: true });
          }
          return;
        }
      } else if (expired) {
        finish();
        return;
      }
      frameId = windowRef.requestAnimationFrame(align);
    };
    frameId = windowRef.requestAnimationFrame(align);
  }
}
