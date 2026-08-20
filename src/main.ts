/**
 * @file Bootstrap der Studio-Anwendung.
 * @description Startet Angular 22 zoneless und stellt Router sowie HttpClient mit Django-kompatibler XSRF-Konfiguration bereit.
 */

import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

/** Globale Provider der Standalone-Anwendung. Angular 21+ arbeitet standardmäßig zoneless. */
const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken',
      }),
    ),
  ],
};

bootstrapApplication(AppComponent, appConfig)
  .catch((error: unknown) => console.error('Studio bootstrap failed.', error));
