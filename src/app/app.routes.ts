/**
 * @file Routing der Studio-Website.
 * @description Lazy lädt alle Seiten und hält die kommerzielle Anwendung technisch unabhängig vom Portfolio.
 */

import { Routes } from '@angular/router';

/** Öffentliche Routen. */
export const routes: Routes = [
  {
    path: '', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/home-page/home-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.HomePageComponent,
      )
  },
  {
    path: 'leistungen', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/services-page/services-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.ServicesPageComponent,
      )
  },
  {
    path: 'leistungen/:slug', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/service-detail-page/service-detail-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.ServiceDetailPageComponent,
      )
  },
  {
    path: 'referenzen', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/references-page/references-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.ReferencesPageComponent,
      )
  },
  {
    path: 'referenzen/intranet', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/intranet-case-page/intranet-case-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.IntranetCasePageComponent,
      )
  },
  {
    path: 'referenzen/design-archiv', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/design-archive-case-page/design-archive-case-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.DesignArchiveCasePageComponent,
      )
  },
  {
    path: 'studio', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/studio-page/studio-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.StudioPageComponent,
      )
  },
  {
    path: 'faq',
    loadComponent:
      /** Lädt die zentrale Fragenübersicht erst beim Aufruf ihrer eigenen Route. */
      () => import('./pages/faq-page/faq-page.component').then(
        /**
         * Wählt die exportierte FAQ-Komponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Fragenübersicht.
         */
        (module) => module.FaqPageComponent,
      ),
  },
  {
    path: 'kontakt', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/contact-page/contact-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.ContactPageComponent,
      )
  },
  {
    path: 'danke', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/thank-you-page/thank-you-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.ThankYouPageComponent,
      )
  },
  {
    path: 'impressum', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/legal-notice-page/legal-notice-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.LegalNoticePageComponent,
      )
  },
  {
    path: 'datenschutz', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/privacy-page/privacy-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.PrivacyPageComponent,
      )
  },
  {
    path: '**', loadComponent:
      /** Lädt die Seitenkomponente erst bei Aufruf der zugehörigen Route. */
      () => import('./pages/not-found-page/not-found-page.component').then(
        /**
         * Wählt die exportierte Seitenkomponente aus dem geladenen Modul.
         * @param module Geladenes Modul der Seitenkomponente.
         */
        (module) => module.NotFoundPageComponent,
      )
  },
];
