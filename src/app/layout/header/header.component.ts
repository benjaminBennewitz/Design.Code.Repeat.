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
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';

/** Sticky Header der kommerziellen Website. */
@Component({
  selector: 'dcr-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ActionButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly accessibilityPanelService = inject(AccessibilityPanelService);
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);
  readonly content = computed(() => this.languageService.content().navigation);
  readonly menuOpen = signal(false);
  readonly brandLabel = computed(() => this.languageService.language() === 'de'
    ? 'Design. Code. Repeat. Startseite'
    : 'Design. Code. Repeat. Home');
  readonly accessibilityLabel = computed(() => this.languageService.language() === 'de'
    ? 'Barrierefreiheit einstellen'
    : 'Adjust accessibility');

  constructor() {
    effect(() => this.document.documentElement.classList.toggle('dcr-menu-open', this.menuOpen()));
  }

  /** Öffnet oder schließt die mobile Navigation. */
  toggleMenu(): void {
    this.menuOpen.update((open: boolean) => !open);
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

  /** Extrahiert das Fragment aus einem Home-Anker. */
  fragmentFor(item: NavigationItem): string | undefined {
    return item.href.startsWith('/#') ? item.href.slice(2) : undefined;
  }

  /** Liefert die Router-Route ohne Fragment. */
  routeFor(item: NavigationItem): string {
    return item.href.startsWith('/#') ? '/' : item.href;
  }
}
