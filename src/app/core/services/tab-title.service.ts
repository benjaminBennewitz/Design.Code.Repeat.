/* src/app/core/services/tab-title.service.ts */
/**
 * @file Dynamischer Tab-Titel.
 * @description Zeigt bei inaktivem Browser-Tab einen dezenten Rückkehrhinweis und stellt beim Aktivieren den SEO-Titel wieder her.
 */

import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** Verwaltet sichtbaren und inaktiven Dokumenttitel. */
@Injectable({ providedIn: 'root' })
export class TabTitleService {
  private readonly document = inject(DOCUMENT); // Dokument für Attribute und Browserzugriffe.
  private activeTitle = this.document.title;    // Regulärer SEO-Titel des aktiven Tabs.
  private hiddenTitle = 'psst... come back 👀'; // Rückkehrhinweis mit dem erlaubten Tab-Emoji.

  /** Registriert den Visibility-Listener einmalig. */
  constructor() {
    this.document.addEventListener('visibilitychange', this.updateVisibleTitle.bind(this));
  }

  /** Übernimmt passend zur Tab-Sichtbarkeit den aktiven Titel oder Rückkehrhinweis. */
  private updateVisibleTitle(): void {
    this.document.title = this.document.hidden ? this.hiddenTitle : this.activeTitle;
  }

  /**
   * Setzt den regulären Seitentitel.
   * @param title Gewünschter Dokumenttitel.
   */
  setActiveTitle(title: string): void {
    this.activeTitle = title;
    if (!this.document.hidden) {
      this.document.title = title;
    }
  }

  /**
   * Setzt den Titel für inaktive Tabs.
   * @param title Gewünschter Dokumenttitel.
   */
  setHiddenTitle(title: string): void {
    this.hiddenTitle = title;
  }
}
