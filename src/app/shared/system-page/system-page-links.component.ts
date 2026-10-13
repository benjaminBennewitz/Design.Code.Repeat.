/* src/app/shared/system-page/system-page-links.component.ts */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SYSTEM_PAGE_UI } from './system-page-ui.data';

/** Zeigt dieselben zentralen Navigationsziele auf Fehler- und Bestätigungsseiten. */
@Component({
  selector: 'dcr-system-page-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './system-page-links.component.html',
  styleUrl: './system-page-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemPageLinksComponent {
  private readonly languageService = inject(LanguageService); // Zentrale Sprache und Navigationsbeschriftungen.
  readonly ui = computed(
    /** Liest die lokalisierten Steuertexte der Quicklinks. */
    () => SYSTEM_PAGE_UI[this.languageService.language()],
  ); // Lokalisierte Navigation und Zielbeschreibungen.
  readonly links = computed(
    /** Wählt Start, Referenzen und Studio aus der zentralen Navigation. */
    () => this.languageService.content().navigation.items.filter(isQuicklink),
  ); // Vorhandene Ziele mit zentral gepflegten Beschriftungen.

  /**
   * Liefert die lokalisierte Kurzbeschreibung des bestehenden Navigationsziels.
   * @param route Interne Route des Quicklinks.
   */
  descriptionFor(route: string): string {
    return this.ui().linkDescriptions[route as keyof typeof SYSTEM_PAGE_UI.de.linkDescriptions] ?? '';
  }
}

/**
 * Prüft die drei für beide Statusseiten vorgesehenen internen Ziele.
 * @param item Eintrag aus der zentralen Navigation.
 */
function isQuicklink(item: { readonly href: string }): boolean {
  return item.href === '/' || item.href === '/referenzen' || item.href === '/studio';
}
