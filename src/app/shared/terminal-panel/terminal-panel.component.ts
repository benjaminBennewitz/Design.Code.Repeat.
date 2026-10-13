/* src/app/shared/terminal-panel/terminal-panel.component.ts */
/**
* @file Kontrolliertes Terminal-UI-Element.
* @description Liefert den visuellen Bezug zum Portfolio, ohne die Firmenwebsite in eine vollständige Terminal-Experience zu verwandeln.
*/

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Kleine Systembox für Status- und Kontextzeilen. */
@Component({
  selector: 'dcr-terminal-panel',
  standalone: true,
  templateUrl: './terminal-panel.component.html',
  styleUrl: './terminal-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalPanelComponent {
  readonly title = input<string>('system.status'); // Fenstertitel.
  readonly lines = input.required<readonly string[]>(); // Zeilen innerhalb des Terminalfensters.
}
