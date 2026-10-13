/* src/app/pages/service-detail-page/managed/managed-service.component.ts */
import { ServiceGuidanceComponent } from '../service-guidance.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudioService } from '../../../core/models/studio.models';
import { TextRevealDirective } from '../../../shared/text-reveal.directive';
import { ManagedServiceContent } from './managed-service.models';

/** Präsentiert Preise, Betreuung, Ablauf und zugängliche FAQs der betreuten Leistungen. */
@Component({
  selector: 'dcr-managed-service',
  standalone: true,
  imports: [ServiceGuidanceComponent, RouterLink, TextRevealDirective],
  templateUrl: './managed-service.component.html',
  styleUrl: './managed-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagedServiceComponent {
  readonly service = input.required<StudioService>(); // Bestehender Preis und fachlicher Leistungsumfang.
  readonly content = input.required<ManagedServiceContent>(); // Eigene Kundeninformationen in der aktiven Sprache.
}
