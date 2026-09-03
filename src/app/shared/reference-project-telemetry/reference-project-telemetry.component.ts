/**
 * @file Vollflächige Project-Telemetry-Section.
 * @description Kombiniert echte Projekt-KPIs mit Arcade-Tech-Charts zu einem dichten 100vh-Dashboard.
 */

import { Component, Input } from '@angular/core';
import { PortfolioProject } from '../../core/models/reference-case.models';
import { RevealOnScrollDirective } from '../reference-reveal-on-scroll.directive';
import { TelemetryChartComponent } from '../reference-telemetry-chart/reference-telemetry-chart.component';

@Component({
  selector: 'bp-project-telemetry',
  standalone: true,
  imports: [RevealOnScrollDirective, TelemetryChartComponent],
  templateUrl: './reference-project-telemetry.component.html',
  styleUrl: './reference-project-telemetry.component.scss',
})
export class ProjectTelemetryComponent {
  /** Projekt inklusive lokalisierter Telemetriedaten. */
  @Input({ required: true }) project!: PortfolioProject;
}
