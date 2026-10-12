/* src/app/core/services/accessibility-panel.service.ts */

/**
 * @file UI-Steuerung für das globale Accessibility-Panel.
 * @description Entkoppelt Trigger in Header und globalem Panel von der nativen Dialog-Implementierung.
 */

import { Injectable, signal } from '@angular/core';

/** Zentraler Trigger zum Öffnen des globalen Accessibility-Dialogs. */
@Injectable({ providedIn: 'root' })
export class AccessibilityPanelService {
  readonly openRequest = signal(0); // Fortlaufende Anfrage-ID, damit auch wiederholte Öffnungen zuverlässig erkannt werden.

  /** Fordert das Öffnen des globalen Accessibility-Panels an. */
  requestOpen(): void {
    this.openRequest.update(
      /**
       * Erzeugt eine neue Anfrage-ID auch bei wiederholtem Öffnen.
       * @param request Zuletzt vergebene Anfrage-ID.
       */
      (request) => request + 1,
    );
  }
}
