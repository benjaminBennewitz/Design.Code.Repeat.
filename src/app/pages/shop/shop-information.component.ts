/** @file Shop-Informationen zu Nutzung, Downloadpaket und persönlichem Support. */

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SHOP_COPY } from './shop-copy.data';

/** Gemeinsame Informationen für Katalog und Produktdetail. */
@Component({
  selector: 'dcr-shop-information',
  imports: [RouterLink],
  templateUrl: './shop-information.component.html',
  styleUrl: './shop-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopInformationComponent {
  private readonly language = inject(LanguageService);

  /** Zeigt die Struktur des geplanten ZIP-Pakets. */
  readonly showPackage = input(true);

  /** Kennzeichnet den Katalog, der zusätzlich einen allgemeinen Überblick erhält. */
  readonly showOverview = input(false);

  readonly ui = computed(() => SHOP_COPY[this.language.language()]);
}
