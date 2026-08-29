/* src/app/core/services/accessibility-panel.service.ts */

/**
 * @file UI-Steuerung für das globale Accessibility-Panel.
 * @description Entkoppelt Trigger in Header und globalem Panel von der nativen Dialog-Implementierung.
 */

import { Injectable, signal } from '@angular/core';

/** Zentraler Trigger zum Öffnen des globalen Accessibility-Dialogs. */
@Injectable({ providedIn: 'root' })
export class AccessibilityPanelService {
  /** Fortlaufende Anfrage-ID, damit auch wiederholte Öffnungen zuverlässig erkannt werden. */
  readonly openRequest = signal(0);

  /** Fordert das Öffnen des globalen Accessibility-Panels an. */
  requestOpen(): void {
    this.openRequest.update((request) => request + 1);
  }
}
