/**
 * @file Dynamischer Tab-Titel.
 * @description Zeigt bei inaktivem Browser-Tab einen dezenten Rückkehrhinweis und stellt beim Aktivieren den SEO-Titel wieder her.
 */

import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** Verwaltet sichtbaren und inaktiven Dokumenttitel. */
@Injectable({ providedIn: 'root' })
export class TabTitleService {
  private readonly document = inject(DOCUMENT);
  private activeTitle = this.document.title;
  private hiddenTitle = 'psst... come back 👀';

  /** Registriert den Visibility-Listener einmalig. */
  constructor() {
    this.document.addEventListener('visibilitychange', () => {
      this.document.title = this.document.hidden ? this.hiddenTitle : this.activeTitle;
    });
  }

  /** Setzt den regulären Seitentitel. */
  setActiveTitle(title: string): void {
    this.activeTitle = title;
    if (!this.document.hidden) {
      this.document.title = title;
    }
  }

  /** Setzt den Titel für inaktive Tabs. */
  setHiddenTitle(title: string): void {
    this.hiddenTitle = title;
  }
}
