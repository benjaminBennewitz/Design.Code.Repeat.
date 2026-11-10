/**
 * @file Temporärer Entwurf für einen internen Navigationswechsel zum Kontaktformular.
 * @description Keine Query-Parameter, lokale Speicherung oder Übermittlung ohne ausdrücklichen Formular-Submit.
 */
import { Injectable } from '@angular/core';
import type { ContactTopic } from '../models/studio.models';

export interface ContactDraft {
  readonly message: string;
  readonly topic: ContactTopic;
}

@Injectable({ providedIn: 'root' })
export class ContactDraftService {
  private pending: ContactDraft | null = null;

  /** Hält den Entwurf nur bis zum nächsten Öffnen der Kontaktseite im Arbeitsspeicher. */
  prepare(draft: ContactDraft): void { this.pending = draft; }

  /** Liest den Entwurf einmalig aus und gibt die Referenz anschließend frei. */
  consume(): ContactDraft | null {
    const draft = this.pending;
    this.pending = null;
    return draft;
  }
}
