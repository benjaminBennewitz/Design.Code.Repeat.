/* src/app/shared/action-button/action-button.component.ts */
/**
* @file Wiederverwendbarer Aktionsbutton der Studio-Website.
* @description Zentralisiert interne Links, externe Links und echte Buttons inklusive Varianten, Icon und ARIA-Beschriftung.
*/

import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Visuelle Varianten des Studio-Buttons. */
export type ActionButtonVariant = 'default' | 'primary' | 'ghost' | 'dark' | 'accent' | 'inverse';

/** Größenvarianten des Studio-Buttons. */
export type ActionButtonSize = 'default' | 'small';

/** Einheitlicher Button für Navigation und Aktionen. */
@Component({
  selector: 'dcr-action-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent {
  readonly label = input.required<string>(); // Sichtbare Beschriftung.

  readonly route = input<string | undefined>(); // Interne Angular-Route. Wenn gesetzt, wird ein Router-Link gerendert.

  readonly fragment = input<string | undefined>(); // Optionales Router-Fragment.

  readonly href = input<string | undefined>(); // Externe URL oder Mail-/Tel-Link.

  readonly icon = input<string | undefined>(); // Optionales Material-Symbol hinter dem Text.

  readonly variant = input<ActionButtonVariant>('default'); // Visuelle Variante.

  readonly size = input<ActionButtonSize>('default'); // Größenvariante.

  readonly ariaLabel = input<string | undefined>(); // ARIA-Label, falls der sichtbare Text nicht ausreichend beschreibt.

  readonly target = input<'_self' | '_blank'>('_self'); // Target für externe Links.

  readonly type = input<'button' | 'submit'>('button'); // Button-Typ, wenn weder Route noch href gesetzt sind.

  readonly disabled = input<boolean>(false); // Disabled-Zustand für echte Buttons.

  readonly pressed = output<MouseEvent>(); // Wird bei einem echten Button-Klick ausgelöst.

  /** Liefert die gemeinsame Klassenliste aller Renderpfade. */
  buttonClasses(): string {
    /**
    * Gemeinsame CSS-Klassen des Aktionsbuttons.
    */
    const classes = ['dcr-button'];

    if (this.variant() !== 'default') {
      classes.push(`dcr-button--${this.variant()}`);
    }

    if (this.size() === 'small') {
      classes.push('dcr-button--small');
    }

    return classes.join(' ');
  }

  /** Verhindert tab-nabbing bei Links in neuen Tabs. */
  rel(): string | null {
    return this.target() === '_blank' ? 'noopener noreferrer' : null;
  }
}
