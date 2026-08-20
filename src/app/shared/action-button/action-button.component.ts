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
  /** Sichtbare Beschriftung. */
  readonly label = input.required<string>();

  /** Interne Angular-Route. Wenn gesetzt, wird ein Router-Link gerendert. */
  readonly route = input<string | undefined>();

  /** Optionales Router-Fragment. */
  readonly fragment = input<string | undefined>();

  /** Externe URL oder Mail-/Tel-Link. */
  readonly href = input<string | undefined>();

  /** Optionales Material-Symbol hinter dem Text. */
  readonly icon = input<string | undefined>();

  /** Visuelle Variante. */
  readonly variant = input<ActionButtonVariant>('default');

  /** Größenvariante. */
  readonly size = input<ActionButtonSize>('default');

  /** ARIA-Label, falls der sichtbare Text nicht ausreichend beschreibt. */
  readonly ariaLabel = input<string | undefined>();

  /** Target für externe Links. */
  readonly target = input<'_self' | '_blank'>('_self');

  /** Button-Typ, wenn weder Route noch href gesetzt sind. */
  readonly type = input<'button' | 'submit'>('button');

  /** Disabled-Zustand für echte Buttons. */
  readonly disabled = input<boolean>(false);

  /** Wird bei einem echten Button-Klick ausgelöst. */
  readonly pressed = output<MouseEvent>();

  /** Liefert die gemeinsame Klassenliste aller Renderpfade. */
  buttonClasses(): string {
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
