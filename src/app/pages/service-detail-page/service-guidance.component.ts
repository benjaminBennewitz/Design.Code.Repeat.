/* src/app/pages/service-detail-page/service-guidance.component.ts */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

/** Gemeinsamer Einstiegshinweis für Kunden ohne technisches Vorwissen. */
@Component({
  selector: 'dcr-service-guidance',
  standalone: true,
  template: `<aside [attr.aria-label]="content().title"><strong>{{ content().title }}</strong><p>{{ content().text }}</p></aside>`,
  styleUrl: './service-guidance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceGuidanceComponent {
  private readonly languageService = inject(LanguageService); // Aktive Sprache der Leistungsseite.
  readonly content = computed(
    /** Wählt den verständlichen Einstiegshinweis der aktiven Sprache. */
    () => GUIDANCE[this.languageService.language()],
  ); // Gemeinsame Kundenorientierung für alle Leistungsbereiche.
}

const GUIDANCE = {
  de: {
    title: 'Kein technisches Vorwissen nötig.',
    text: 'Du beschreibst dein Ziel und deinen Alltag. Ich übersetze das in die passende Lösung, erkläre Entscheidungen verständlich und übernehme die vereinbarte technische Umsetzung oder Betreuung.',
  },
  en: {
    title: 'No technical knowledge required.',
    text: 'Tell me about your goals and everyday work. I turn that into a suitable solution, explain decisions clearly and take care of the agreed technical implementation or support.',
  },
}; // Lokalisierter Hinweis für alle Leistungsseiten.
