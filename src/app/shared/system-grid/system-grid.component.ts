/* src/app/shared/system-grid/system-grid.component.ts */
/**
* @file Wiederverwendbare, flächenbasierte System-Section.
* @description Überträgt die visuelle Logik von studio.system auf Unterseiten, ohne deren Inhalte oder Semantik zu duplizieren.
*/

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ScrollRevealDirective } from '../scroll-reveal.directive';

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
  imports: [ScrollRevealDirective],
  templateUrl: './system-grid.component.html',
  styleUrl: './system-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemGridComponent {
  readonly eyebrow = input.required<string>(); // Technische Vorzeile der Hauptfläche.

  readonly title = input.required<string>(); // Hauptüberschrift der Section.

  readonly text = input<string | undefined>(''); // Einleitender Beschreibungstext.

  readonly titleId = input<string | undefined>(); // ID der Hauptüberschrift für aria-labelledby-Verknüpfungen.

  readonly titleLevel = input<1 | 2>(2); // Semantische Ebene der Hauptüberschrift.

  readonly leadAside = input<SystemGridItem | null>(null); // Rechter Kontextblock der großen oberen Fläche.

  readonly panels = input<readonly SystemGridItem[]>([]); // Inhalte der beiden mittleren und der unteren Fläche.

  readonly revealMetaOnInteraction = input(false); // Blendet Meta-Werte auf Geräten mit Hover erst bei Interaktion ein.

  readonly boxed = input(false); // Stellt die vorhandenen Flächen mit sichtbaren Abständen als Boxen dar.

  readonly animatePanels = input(false); // Aktiviert die einmalige, richtungsabhängige Einfahrt jeder Fläche.

  readonly visiblePanels = computed(
    /**
    * Die Komponente besitzt bewusst exakt drei Sekundärflächen.
    */
    () => this.panels().slice(0, 3)); // Die Komponente besitzt bewusst exakt drei Sekundärflächen.
}
