/**
 * @file Eigenes Privacy-Control-Panel der Studio-Website.
 * @description Informiert transparent über notwendige lokale Einstellungen ohne externe Consent- oder Tracking-Dienste.
 */

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CookieConsentService } from '../../core/services/cookie-consent.service';
import { LanguageService } from '../../core/services/language.service';

/** Eintrag innerhalb der technischen Privacy-Details. */
interface PrivacyControlItem {
  readonly icon: string;
  readonly title: string;
  readonly status: string;
  readonly text: string;
  readonly state: 'locked' | 'local' | 'off';
}

/** Übersetzte Bannertexte. */
interface CookieBannerTexts {
  readonly ariaLabel: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly necessaryLabel: string;
  readonly trackingLabel: string;
  readonly externalLabel: string;
  readonly detailsLabel: string;
  readonly overviewLabel: string;
  readonly acceptLabel: string;
  readonly controls: readonly PrivacyControlItem[];
}

/** Globales Privacy-Control-Panel. */
@Component({
  selector: 'dcr-cookie-banner',
  standalone: true,
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBannerComponent {
  /** Gemeinsamer Panel-Zustand für Banner, Footer und Rechtliches. */
  readonly consentService = inject(CookieConsentService);

  /** Aktive Sprache. */
  private readonly languageService = inject(LanguageService);

  /** Sprachabhängige Inhalte. */
  readonly texts = computed<CookieBannerTexts>(() => COOKIE_BANNER_TEXTS[this.languageService.language()]);
}

/** Statische, bewusst trackingfreie Privacy-Informationen. */
const COOKIE_BANNER_TEXTS: Record<'de' | 'en', CookieBannerTexts> = {
  de: {
    ariaLabel: 'Privacy Controls zu notwendigen lokalen Technologien',
    eyebrow: 'privacy_controls.exe',
    title: 'Privacy Controls',
    text: 'Diese Website verwendet aktuell kein Marketing-Tracking und keine externen Consent-Dienste. Lokal gespeichert werden nur Einstellungen, die Theme, Sprache, Accessibility und diesen Hinweis funktionsfähig halten.',
    necessaryLabel: 'Notwendig: aktiv',
    trackingLabel: 'Tracking: aus',
    externalLabel: 'Consent-Dienst: keiner',
    detailsLabel: 'Technik ansehen',
    overviewLabel: 'Zur Übersicht',
    acceptLabel: 'Alles klar',
    controls: [
      { icon: 'lock', title: 'Notwendige Einstellungen', status: 'aktiv · lokal', text: 'Theme, Sprache, Accessibility-Modi und der Hinweisstatus werden ausschließlich im Browser gespeichert.', state: 'locked' },
      { icon: 'tune', title: 'Komfortfunktionen', status: 'lokal · ohne Profiling', text: 'Darstellungsoptionen personalisieren die Oberfläche, ohne daraus Nutzerprofile zu erstellen.', state: 'local' },
      { icon: 'query_stats', title: 'Analytics / Marketing', status: 'nicht aktiv', text: 'Aktuell werden keine Analytics-, Marketing- oder Profiling-Cookies gesetzt.', state: 'off' },
      { icon: 'hub', title: 'Externe Consent-Dienste', status: 'nicht aktiv', text: 'Das Privacy-Panel ist Bestandteil der Website und lädt dafür keinen Drittanbieter.', state: 'off' },
    ],
  },
  en: {
    ariaLabel: 'Privacy controls for necessary local technologies',
    eyebrow: 'privacy_controls.exe',
    title: 'Privacy Controls',
    text: 'This website currently uses no marketing tracking and no external consent service. Only settings required for theme, language, accessibility and this notice are stored locally.',
    necessaryLabel: 'Necessary: active',
    trackingLabel: 'Tracking: off',
    externalLabel: 'Consent service: none',
    detailsLabel: 'Show technology',
    overviewLabel: 'Back to overview',
    acceptLabel: 'Got it',
    controls: [
      { icon: 'lock', title: 'Necessary settings', status: 'active · local', text: 'Theme, language, accessibility modes and the notice status are stored only in this browser.', state: 'locked' },
      { icon: 'tune', title: 'Comfort features', status: 'local · no profiling', text: 'Display preferences personalize the interface without creating user profiles.', state: 'local' },
      { icon: 'query_stats', title: 'Analytics / marketing', status: 'not active', text: 'No analytics, marketing or profiling cookies are currently used.', state: 'off' },
      { icon: 'hub', title: 'External consent services', status: 'not active', text: 'The privacy panel is part of the website and does not load a third-party consent provider.', state: 'off' },
    ],
  },
};
