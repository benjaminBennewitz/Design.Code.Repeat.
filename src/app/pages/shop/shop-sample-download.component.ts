/** @file Abruf und Integritätsprüfung öffentlicher Shop-Muster. */

import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ShopProduct, shopImage } from './shop-products.data';
import { SHOP_SAMPLE_HASHES } from './shop-sample-hashes.data';

const COPY = {
  de: { title: 'Downloadprüfung', checking: 'Datei wird vom Server abgerufen und geprüft …', ready: 'Datei erfolgreich abgerufen. SHA-256-Prüfsumme stimmt überein.', error: 'Die Datei konnte nicht abgerufen oder verifiziert werden. Bitte versuche es erneut.', note: 'Integritätsprüfung eines öffentlichen Musters. Dies ist kein Virenscan.', save: 'Datei speichern', close: 'Schließen', retry: 'Erneut prüfen', support: 'Hilfe beim Download' },
  en: { title: 'Download verification', checking: 'Retrieving and verifying the file …', ready: 'File retrieved successfully. SHA-256 checksum matches.', error: 'The file could not be retrieved or verified. Please try again.', note: 'Integrity check of a public sample. This is not a malware scan.', save: 'Save file', close: 'Close', retry: 'Try again', support: 'Download help' },
} as const;

/** Prüft die tatsächlich empfangenen Bytes, bevor ein Muster gespeichert werden kann. */
@Component({
  selector: 'dcr-shop-sample-download',
  imports: [RouterLink],
  templateUrl: './shop-sample-download.component.html',
  styleUrl: './shop-sample-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopSampleDownloadComponent {
  readonly product = input.required<ShopProduct>();
  readonly label = input.required<string>();
  readonly language = inject(LanguageService).language;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('verification');
  readonly ui = computed(() => COPY[this.language()]);
  readonly state = signal<'checking' | 'ready' | 'error'>('checking');
  readonly downloadUrl = signal('');
  private request?: AbortController;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cleanup());
  }

  /** Öffnet den nativen Dialog und startet den echten Dateiaufruf. */
  open(): void {
    this.dialog().nativeElement.showModal();
    void this.verify();
  }

  /** Ruft das öffentliche Muster ohne Cache ab und vergleicht dessen SHA-256-Wert. */
  async verify(): Promise<void> {
    this.cleanup();
    const controller = new AbortController();
    this.request = controller;
    this.state.set('checking');
    const product = this.product();
    const expected = SHOP_SAMPLE_HASHES[product.slug];
    try {
      if (!expected || !globalThis.crypto?.subtle) throw new Error('Missing integrity reference');
      const response = await fetch(shopImage(product, 'layout'), { cache: 'no-store', credentials: 'same-origin', signal: controller.signal });
      if (!response.ok) throw new Error('Download unavailable');
      const bytes = await response.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const actual = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      if (actual !== expected) throw new Error('Integrity mismatch');
      if (controller.signal.aborted) return;
      this.downloadUrl.set(URL.createObjectURL(new Blob([bytes], { type: 'image/webp' })));
      this.state.set('ready');
    } catch {
      if (!controller.signal.aborted) this.state.set('error');
    }
  }

  /** Bricht offene Abrufe ab und gibt temporäre Objekt-URLs wieder frei. */
  cleanup(): void {
    this.request?.abort();
    this.request = undefined;
    if (this.downloadUrl()) URL.revokeObjectURL(this.downloadUrl());
    this.downloadUrl.set('');
  }
}
