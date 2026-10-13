/* src/app/shared/reference-telemetry-chart/reference-telemetry-chart.component.ts */
/**
* @file Wiederverwendbare Arcade-Tech-Datenvisualisierung.
* @description Rendert Radial-, Dotted-Area- und 8-Bit-Step-Charts ohne externe Chart-Bibliothek.
*/

import { Component, Input } from '@angular/core';
import { TelemetryChartDataPoint, TelemetryChartVariant } from '../../core/models/reference-case.models';
import { RevealOnScrollDirective } from '../reference-reveal-on-scroll.directive';

/** SVG-Punkt für intern berechnete Linienpfade. */
interface TelemetrySvgPoint {
  readonly x: number;
  readonly y: number;
  readonly source: TelemetryChartDataPoint;
}

@Component({
  selector: 'bp-telemetry-chart',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './reference-telemetry-chart.component.html',
  styleUrl: './reference-telemetry-chart.component.scss',
})
export class TelemetryChartComponent {
  @Input({ required: true }) eyebrow = ''; // Kleine technische Beschriftung oberhalb des Charts.

  @Input({ required: true }) title = ''; // Sichtbarer Chart-Titel.

  @Input() description = ''; // Kurze Einordnung der dargestellten Daten.

  @Input() variant: TelemetryChartVariant = 'area'; // Visualisierungsvariante.

  @Input({ required: true }) data: readonly TelemetryChartDataPoint[] = []; // Datenpunkte des Charts.

  @Input() valueSuffix = ''; // Optionales Suffix für Werte in Legende und Tooltip.

  @Input() maxValue?: number; // Optional fest vorgegebener Maximalwert der Skala.

  @Input() chartId = 'telemetry-chart'; // Eindeutige ID für zugängliche SVG-Beschriftungen.

  @Input() syncParentReveal = false; // Synchronisiert Reveal und Chart-Draw optional mit dem Reveal des umgebenden Telemetrie-Blocks.

  /** Sichtbarer Maximalwert mit Schutz vor Division durch null. */
  resolvedMax(): number {
    /**
    * Optional konfigurierte Obergrenze der Werteskala.
    */
    const configuredMax = this.maxValue;

    if (configuredMax && configuredMax > 0) {
      return configuredMax;
    }

    return Math.max(1, ...this.data.map(
      /**
      * Liest den Wert des aktuellen Datenpunkts.
      * @param item Aktueller Messwert mit Beschriftung.
      */
      (item) => item.value));
  }

  /** Aufbereitete Punkte für Area- und Step-Chart. */
  chartPoints(): readonly TelemetrySvgPoint[] {
    if (!this.data.length) {
      return [];
    }

    /**
    * Einmalig bestimmte Obergrenze für alle Punkte des Charts.
    */
    const max = this.resolvedMax();
    return this.data.map(
      /**
      * Überträgt den Messwert auf die gemeinsame Skala.
      * @param item Aktueller Messwert.
      * @param index Position innerhalb der Datenfolge.
      */
      (item, index) => this.chartPoint(item, index, max),
    );
  }

  /**
  * Überträgt einen Messwert auf die bestehenden SVG-Koordinaten.
  * @param item Messwert mit zugehöriger Beschriftung.
  * @param index Position des Messwerts in der Datenfolge.
  * @param max Obergrenze der gemeinsamen Skala.
  */
  private chartPoint(item: TelemetryChartDataPoint, index: number, max: number): TelemetrySvgPoint {
    /**
    * Anzahl der horizontalen Abstände zwischen den Datenpunkten.
    */
    const divisor = Math.max(1, this.data.length - 1);
    return { x: 44 + (576 * index) / divisor, y: 228 - (Math.min(item.value, max) / max) * 204, source: item };
  }

  /** Linienpfad für weiche Dotted-Area-Charts. */
  areaLinePath(): string {
    /**
    * Berechnete SVG-Punkte der aktuellen Datenfolge.
    */
    const points = this.chartPoints();

    if (!points.length) return '';

    return points.map(
      /**
      * Formatiert ein Segment des SVG-Linienpfads.
      * @param point Berechneter SVG-Punkt.
      * @param index Position innerhalb der Datenfolge.
      */
      (point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }

  /** Flächenpfad für weiche Dotted-Area-Charts. */
  areaFillPath(): string {
    return this.closeArea(this.areaLinePath(), this.chartPoints());
  }

  /** Treppenförmiger Linienpfad für die 8-Bit-Variante. */
  stepLinePath(): string {
    /**
    * Berechnete SVG-Punkte der aktuellen Datenfolge.
    */
    const points = this.chartPoints();

    if (!points.length) return '';

    /**
    * Schrittweise aufgebauter Treppenpfad.
    */
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 1;index < points.length;index += 1) {
      path += this.stepSegment(points[index - 1], points[index]);
    }

    return path;
  }

  /**
  * Verbindet zwei benachbarte Punkte mit der unveränderten Treppengeometrie.
  * @param previous Ausgangspunkt des Segments.
  * @param current Zielpunkt des Segments.
  */
  private stepSegment(previous: TelemetrySvgPoint, current: TelemetrySvgPoint): string {
    /**
    * Horizontale Mitte für den vertikalen Treppensprung.
    */
    const middleX = previous.x + (current.x - previous.x) / 2;
    return ` H ${middleX} V ${current.y} H ${current.x}`;
  }

  /** Treppenförmiger Flächenpfad für die 8-Bit-Variante. */
  stepFillPath(): string {
    return this.closeArea(this.stepLinePath(), this.chartPoints());
  }

  /**
  * Schließt einen Linienpfad entlang der bestehenden SVG-Grundlinie.
  * @param line Sichtbarer Linienpfad des Charts.
  * @param points Zugehörige Datenpunkte zum Bestimmen der Flächengrenzen.
  */
  private closeArea(line: string, points: readonly TelemetrySvgPoint[]): string {
    if (!points.length) return '';
    /**
    * Linker Rand der geschlossenen Diagrammfläche.
    */
    const first = points[0];
    /**
    * Rechter Rand der geschlossenen Diagrammfläche.
    */
    const last = points[points.length - 1];
    return `${line} L ${last.x} 228 L ${first.x} 228 Z`;
  }

  /**
  * Radius eines einzelnen Radialrings.
  * @param index Position innerhalb der Datenfolge.
  */
  radialRadius(index: number): number {
    return Math.max(42, 104 - index * 16);
  }

  /**
  * Sichtbare Strichlänge eines Radialrings relativ zur 100er-Pfadskala.
  * @param item Aktueller Messwert mit Beschriftung.
  */
  radialDasharray(item: TelemetryChartDataPoint): string {
    /**
    * Auf die Ringlänge normierter Messwert.
    */
    const visible = (Math.min(item.value, this.resolvedMax()) / this.resolvedMax()) * 100;

    return `${visible} ${100 - visible}`;
  }

  /**
  * Formatiert einen sichtbaren Messwert inklusive optionalem Suffix.
  * @param item Aktueller Messwert mit Beschriftung.
  */
  formattedValue(item: TelemetryChartDataPoint): string {
    return `${item.value}${this.valueSuffix}`;
  }
}
