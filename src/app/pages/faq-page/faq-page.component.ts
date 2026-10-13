/* src/app/pages/faq-page/faq-page.component.ts */
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { TextRevealDirective } from '../../shared/text-reveal.directive';
import { buildFaqGroups } from './faq-content';
import { filterFaqGroups } from './faq-search';
import { FAQ_UI } from './faq-ui.data';
import { FaqGroup } from './faq.models';

/** Zentrale Fragenübersicht mit thematischen Zweispaltenlisten und lokaler Suche. */
@Component({
  selector: 'dcr-faq-page', standalone: true,
  imports: [RouterLink, TextRevealDirective],
  templateUrl: './faq-page.component.html', styleUrl: './faq-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqPageComponent {
  private readonly languageService = inject(LanguageService); // Aktive Sprache und gemeinsame FAQ-Quellen.
  private readonly seoService = inject(SeoService); // Metadaten und Canonical der Fragenübersicht.
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('faqSearch'); // Suchfeld für die Fokus-Rückgabe beim Zurücksetzen.
  readonly query = signal(''); // Aktuelle lokale Suchanfrage ohne Netzwerkanfragen.
  readonly category = signal('all'); // Gewählter Themen-Slug oder vollständiger Fragenbestand.
  readonly ui = computed(
    /** Liest die Oberfläche in der aktiven Sprache. */
    () => FAQ_UI[this.languageService.language()],
  ); // Lokalisierte Beschriftungen und SEO-Daten.
  readonly groups = computed(
    /** Bündelt alle aktuellen FAQ-Quellen beim Sprachwechsel. */
    () => buildFaqGroups(this.languageService.content(), this.languageService.language()),
  ); // Vollständiger gemeinsamer FAQ-Bestand ohne Antwortduplikate im Quellcode.
  readonly visibleGroups = computed(
    /** Kombiniert Suchtext und Themenauswahl. */
    () => filterFaqGroups(this.groups(), this.query(), this.category()),
  ); // Aktuell sichtbare Fragen nach Themen gruppiert.
  readonly resultCount = computed(
    /** Zählt die aktuell sichtbaren Fragen für die zugängliche Ergebnisanzeige. */
    () => this.visibleGroups().reduce(countQuestions, 0),
  ); // Anzahl aller aktuellen Treffer.

  /** Hält die SEO-Daten der zentralen Fragenübersicht mit der Sprache synchron. */
  constructor() {
    effect(this.updateSeo.bind(this));
  }

  /**
   * Übernimmt ausschließlich den sichtbaren Text aus dem Suchfeld.
   * @param event Eingabeereignis des Suchfelds.
   */
  updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value.slice(0, 200));
  }

  /** Löscht Suche und Themenfilter und setzt den Fokus ins Suchfeld zurück. */
  resetSearch(): void {
    this.query.set('');
    this.category.set('all');
    this.searchInput()?.nativeElement.focus();
  }

  /** Überträgt die eigene Seitenbeschreibung und Canonical-Route. */
  private updateSeo(): void {
    this.seoService.setPage(this.ui().seo, '/faq');
  }
}

/**
 * Summiert die Fragen eines sichtbaren Themenblocks.
 * @param total Bisherige Anzahl aller Fragen.
 * @param group Nächster sichtbarer Themenblock.
 */
function countQuestions(total: number, group: FaqGroup): number {
  return total + group.items.length;
}
