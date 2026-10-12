/* src/app/shared/reference-case-study/views/case-reader.view.ts */
import { Component, input, ViewEncapsulation, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import type { ProjectCatalogShowcase } from '../../../core/models/reference-catalog.models';
import type { CatalogReader } from '../controllers/catalog-reader';
import type { CatalogMenu } from '../controllers/catalog-menu';
import type { CatalogLoupe } from '../controllers/catalog-loupe';
import { ProtectedAssetDirective } from './protected-asset.directive';
import type { CatalogReaderPage } from '../controllers/catalog-reader.models';

/** Rendert Katalogseiten, Lupe und Inhaltsverzeichnis. */
@Component({
  selector: 'section[dcrCaseReader]',
  standalone: true,
  imports: [ProtectedAssetDirective],
  templateUrl: './case-reader.view.html',
  encapsulation: ViewEncapsulation.None,
})
export class CaseReaderView implements OnDestroy {
  readonly showcase = input.required<ProjectCatalogShowcase>(); // Texte und Navigationsdaten des Katalog-Readers.
  readonly loadingLabel = input.required<string>();             // Zugänglicher Status während des Seitenladens.
  readonly reader = input.required<CatalogReader>();            // Seitenwahl und vorbereitete Reader-Assets.
  readonly menu = input.required<CatalogMenu>();                // Sichtbarkeit und Fokusführung des Inhaltsverzeichnisses.
  readonly loupe = input.required<CatalogLoupe>();              // Bildausschnitt der rechteckigen Kataloglupe.

  /**
   * Verbindet den Trigger mit der Fokus-Rückgabe des Inhaltsverzeichnisses.
   * @param triggerRef Aktuelle Referenz des Menü-Triggers.
   */
  @ViewChild('catalogMenuTrigger') set triggerRef(triggerRef: ElementRef<HTMLButtonElement> | undefined) {
    this.menu().trigger = triggerRef?.nativeElement;
  }
  /**
   * Verbindet den Dialog mit der modalen Fokusführung.
   * @param dialogRef Aktuelle Referenz des Menü-Dialogs.
   */
  @ViewChild('catalogMenuDialog') set dialogRef(dialogRef: ElementRef<HTMLElement> | undefined) {
    this.menu().dialog = dialogRef?.nativeElement;
  }
  /** Öffnet oder schließt das Inhaltsverzeichnis ohne sichtbare Lupe. */
  toggleCatalogMenu(): void {
    this.loupe().hide();
    if (this.menu().isOpen()) this.menu().close();
    else this.menu().open();
  }
  /**
   * Aktualisiert den Bildausschnitt der Reader-Lupe.
   * @param event Pointer-Ereignis der dargestellten Katalogseite.
   * @param page Vorbereitete Reader-Seite.
   */
  updateCatalogLoupe(event: PointerEvent, page: CatalogReaderPage): void {
    this.loupe().update(event, page, this.menu().isOpen());
  }
  /** Entfernt Dialogreferenzen und ausstehende Fokuswechsel. */
  ngOnDestroy(): void {
    this.menu().reset();
    this.menu().dialog = undefined;
    this.menu().trigger = undefined;
    this.loupe().hide();
  }
}
