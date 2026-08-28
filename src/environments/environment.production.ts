// src/environments/environment.production.ts

/**
 * @file Production-Environment der Studio-Website.
 * @description Enthält die öffentliche Produktionsdomain und den same-origin API-Pfad.
 */

export const environment = {
  production: true,
  siteUrl: 'https://design-code-repeat.de',
  apiBaseUrl: '/api',
} as const;