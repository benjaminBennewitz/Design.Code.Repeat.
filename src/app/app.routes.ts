/**
 * @file Routing der Studio-Website.
 * @description Lazy lädt alle Seiten und hält die kommerzielle Anwendung technisch unabhängig vom Portfolio.
 */

import { Routes } from '@angular/router';

/** Öffentliche Routen. */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent) },
  { path: 'leistungen', loadComponent: () => import('./pages/services-page/services-page.component').then((m) => m.ServicesPageComponent) },
  { path: 'leistungen/:slug', loadComponent: () => import('./pages/service-detail-page/service-detail-page.component').then((m) => m.ServiceDetailPageComponent) },
  { path: 'referenzen', loadComponent: () => import('./pages/references-page/references-page.component').then((m) => m.ReferencesPageComponent) },
  { path: 'referenzen/intranet', loadComponent: () => import('./pages/intranet-case-page/intranet-case-page.component').then((m) => m.IntranetCasePageComponent) },
  { path: 'referenzen/design-archiv', loadComponent: () => import('./pages/design-archive-case-page/design-archive-case-page.component').then((m) => m.DesignArchiveCasePageComponent) },
  { path: 'studio', loadComponent: () => import('./pages/studio-page/studio-page.component').then((m) => m.StudioPageComponent) },
  { path: 'kontakt', loadComponent: () => import('./pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent) },
  { path: 'danke', loadComponent: () => import('./pages/thank-you-page/thank-you-page.component').then((m) => m.ThankYouPageComponent) },
  { path: 'impressum', loadComponent: () => import('./pages/legal-notice-page/legal-notice-page.component').then((m) => m.LegalNoticePageComponent) },
  { path: 'datenschutz', loadComponent: () => import('./pages/privacy-page/privacy-page.component').then((m) => m.PrivacyPageComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found-page/not-found-page.component').then((m) => m.NotFoundPageComponent) },
];
