/* src/app/layout/header/header.component.ts */
/**
 * @file Globaler Studio-Header.
 * @description Konventionelle Hauptnavigation mit reduziertem Terminal-Charakter, Mobile-Menü sowie Theme- und Sprachschalter.
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '../../core/models/studio.models';
import { AccessibilityPanelService } from '../../core/services/accessibility-panel.service';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';

/** Sticky Header der kommerziellen Website. */
@Component({
  selector: 'dcr-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);                                   // Dokument für globale Zustände.
  private readonly accessibilityPanelService = inject(AccessibilityPanelService); // Trigger des zentralen Accessibility-Panels.
  readonly languageService = inject(LanguageService);                             // Aktive Sprache und übersetzte Inhalte.
  readonly themeService = inject(ThemeService);                                   // Globales Farbschema.
  readonly content = computed(
    /** Sprachabhängige Inhalte der Oberfläche. */ () => this.languageService.content().navigation,
  ); // Sprachabhängige Inhalte der Oberfläche.
  readonly menuOpen = signal(false); // Sichtbarkeit der mobilen Navigation.
  readonly brandLabel = computed(
    /** Lokalisierte Beschriftung des Markenlinks. */ () =>
      this.languageService.language() === 'de' ? 'Design. Code. Repeat. Startseite' : 'Design. Code. Repeat. Home',
  ); // Lokalisierte Beschriftung des Markenlinks.
  readonly accessibilityLabel = computed(
    /** Lokalisierte Beschriftung der Accessibility-Steuerung. */ () =>
      this.languageService.language() === 'de' ? 'Barrierefreiheit einstellen' : 'Adjust accessibility',
  ); // Lokalisierte Beschriftung der Accessibility-Steuerung.

  /** Verbindet die Komponente mit ihren reaktiven Dokumentzuständen. */
  constructor() {
    effect(
      /** Synchronisiert den reaktiven Zustand der Komponente. */ () =>
        this.document.documentElement.classList.toggle('dcr-menu-open', this.menuOpen()),
    );
  }

  /** Öffnet oder schließt die mobile Navigation. */
  toggleMenu(): void {
    this.menuOpen.update(
      /**
       * Synchronisiert den reaktiven Zustand der Komponente.
       * @param open Aktuelle Sichtbarkeit der mobilen Navigation.
       */
      (open: boolean) => !open,
    );
  }

  /** Schließt die Navigation nach einer Auswahl. */
  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Öffnet die globalen Accessibility-Einstellungen aus der mobilen Navigation. */
  openAccessibilityPanel(): void {
    this.closeMenu();
    this.accessibilityPanelService.requestOpen();
  }

  /** Schließt das Overlay erwartungsgemäß über Escape. */
  @HostListener('document:keydown.escape')
  closeMenuWithEscape(): void {
    this.closeMenu();
  }

  /**
   * Extrahiert das Fragment aus einem Home-Anker.
   * @param item Navigationsziel mit optionalem Home-Fragment.
   */
  fragmentFor(item: NavigationItem): string | undefined {
    return item.href.startsWith('/#') ? item.href.slice(2) : undefined;
  }

  /**
   * Liefert die Router-Route ohne Fragment.
   * @param item Navigationsziel mit optionalem Home-Fragment.
   */
  routeFor(item: NavigationItem): string {
    return item.href.startsWith('/#') ? '/' : item.href;
  }
}
