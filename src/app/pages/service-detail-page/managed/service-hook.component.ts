/* src/app/pages/service-detail-page/managed/service-hook.component.ts */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManagedInfo } from './managed-service.models';

/** Wiederkehrender Kontaktimpuls innerhalb einer ausführlichen Leistungsseite. */
@Component({
  selector: 'dcr-service-hook',
  standalone: true,
  imports: [RouterLink],
  template: `<aside><div><h2>{{ content().title }}</h2><p>{{ content().text }}</p></div><a class="dcr-button" routerLink="/kontakt">{{ label() }} <span aria-hidden="true">↗</span></a></aside>`,
  styleUrl: './service-hook.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceHookComponent {
  readonly content = input.required<ManagedInfo>(); // Eigener Kontaktimpuls der ausgewählten Leistung.
  readonly label = input.required<string>(); // Bestehende lokalisierte Handlungsaufforderung.
}
