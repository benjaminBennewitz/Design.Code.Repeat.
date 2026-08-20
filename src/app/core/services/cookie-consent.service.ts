/**
 * @file Lokale Privacy-/Cookie-Steuerung der Studio-Website.
 * @description Verwaltet ausschließlich den Hinweisstatus und das erneute Öffnen der Privacy Controls; es werden keine Tracking-Kategorien aktiviert.
 */

import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

/** Zentraler Zustand des Privacy-Control-Panels. */
@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  /** Versionsierter LocalStorage-Key des lokalen Hinweises. */
  private readonly storageKey = 'dcr-studio-cookie-consent-v1';

  /** Dokumentreferenz für sicheren Zugriff auf Browser-Storage. */
  private readonly document = inject(DOCUMENT);

  /** Sichtbarkeit des Panels. */
  readonly visible = signal<boolean>(this.shouldShowInitially());

  /** Detailansicht des Panels. */
  readonly detailsOpen = signal<boolean>(false);

  /** Öffnet die Privacy Controls bewusst in der Detailansicht. */
  openSettings(): void {
    this.detailsOpen.set(true);
    this.visible.set(true);
  }

  /** Schaltet zwischen Übersicht und technischer Detailansicht. */
  toggleDetails(): void {
    this.detailsOpen.update((open) => !open);
  }

  /** Bestätigt den Hinweis zu notwendigen lokalen Technologien. */
  acceptNecessary(): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, 'accepted');
    } catch {
      // Storage kann durch Browser-Policies gesperrt sein. Die Website bleibt trotzdem nutzbar.
    }

    this.detailsOpen.set(false);
    this.visible.set(false);
  }

  /** Prüft, ob der Hinweis bereits bestätigt wurde. */
  private shouldShowInitially(): boolean {
    try {
      return this.document.defaultView?.localStorage.getItem(this.storageKey) !== 'accepted';
    } catch {
      return true;
    }
  }
}
