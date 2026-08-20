/**
 * @file Globaler Studio-Header.
 * @description Konventionelle Hauptnavigation mit reduziertem Terminal-Charakter, Mobile-Menü sowie Theme- und Sprachschalter.
 */

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '../../core/models/studio.models';
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
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);
  readonly content = computed(() => this.languageService.content().navigation);
  readonly menuOpen = signal(false);
  readonly brandLabel = computed(() => this.languageService.language() === 'de'
    ? 'Design. Code. Repeat. Startseite'
    : 'Design. Code. Repeat. Home');

  /** Öffnet oder schließt die mobile Navigation. */
  toggleMenu(): void {
    this.menuOpen.update((open: boolean) => !open);
  }

  /** Schließt die Navigation nach einer Auswahl. */
  closeMenu(): void {
    this.menuOpen.set(false);
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
