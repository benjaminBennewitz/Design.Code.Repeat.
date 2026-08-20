/**
 * @file Wiederverwendbare, flächenbasierte System-Section.
 * @description Überträgt die visuelle Logik von studio.system auf Unterseiten, ohne deren Inhalte oder Semantik zu duplizieren.
 */

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Inhalt eines einzelnen Panels innerhalb der System-Section. */
export interface SystemGridItem {
  /** Kleine technische Vorzeile beziehungsweise Kategorie. */
  eyebrow?: string;
  /** Primäre Bezeichnung des Panels. */
  title: string;
  /** Erläuternder Text. */
  text?: string;
  /** Kompakte Zusatzinformation, beispielsweise Preis oder Jahr. */
  meta?: string;
  /** Optionale Stichpunkte für technische oder inhaltliche Details. */
  details?: readonly string[];
  /** Optionaler Sprunglink innerhalb der aktuellen Seite. */
  href?: string;
  /** Zugängliche Beschriftung des optionalen Sprunglinks. */
  actionLabel?: string;
}

/** Wiederverwendbares Vier-Flächen-System für zentrale Route-Sections. */
@Component({
  selector: 'dcr-system-grid',
  standalone: true,
  templateUrl: './system-grid.component.html',
  styleUrl: './system-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemGridComponent {
  /** Technische Vorzeile der Hauptfläche. */
  readonly eyebrow = input.required<string>();

  /** Hauptüberschrift der Section. */
  readonly title = input.required<string>();

  /** Einleitender Beschreibungstext. */
  readonly text = input<string | undefined>('');

  /** ID der Hauptüberschrift für aria-labelledby-Verknüpfungen. */
  readonly titleId = input<string | undefined>();

  /** Semantische Ebene der Hauptüberschrift. */
  readonly titleLevel = input<1 | 2>(2);

  /** Rechter Kontextblock der großen oberen Fläche. */
  readonly leadAside = input<SystemGridItem | null>(null);

  /** Inhalte der beiden mittleren und der unteren Fläche. */
  readonly panels = input<readonly SystemGridItem[]>([]);

  /** Blendet Meta-Werte auf Geräten mit Hover erst bei Interaktion ein. */
  readonly revealMetaOnInteraction = input(false);

  /** Die Komponente besitzt bewusst exakt drei Sekundärflächen. */
  readonly visiblePanels = computed(() => this.panels().slice(0, 3));
}
