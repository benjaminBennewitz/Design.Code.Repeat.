/**
 * @file Wiederverwendbare, dezente Einladung zum Website-Audit.
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'dcr-audit-promo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './audit-promo.component.html',
  styleUrl: './audit-promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPromoComponent {
  private readonly language = inject(LanguageService);
  readonly ui = computed(() => this.language.language() === 'de' ? {
    eyebrow: 'FREE.TOOL / 01',
    title: 'Wie fit ist deine Website?',
    copy: 'Performance, Barrierefreiheit und SEO kostenlos prüfen. Eine URL pro Analyse.',
    action: 'Website-Check starten',
  } : {
    eyebrow: 'FREE.TOOL / 01',
    title: 'How healthy is your website?',
    copy: 'Check performance, accessibility and SEO for free. One URL per scan.',
    action: 'Start website audit',
  });
}
