/* src/app/shared/reference-case-study/views/protected-asset.directive.ts */
import { Directive, HostListener } from '@angular/core';
/** Erhält die bestehenden Standardaktions-Sperren für Katalogassets. */
@Directive({ selector: '[dcrProtectedAsset]', standalone: true })
export class ProtectedAssetDirective {
  /**
   * Verhindert die bisher unterdrückten Kontextmenü- und Drag-Aktionen.
   * @param event Browserereignis des zugehörigen Asset-Elements.
   */
  @HostListener('contextmenu', ['$event']) @HostListener('dragstart', ['$event']) block(event: Event): false {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}
