/**
 * @file Development-Environment der Studio-Website.
 * @description Nutzt lokal den Angular-Proxy für das Django-API und eine feste Development-Origin für SEO-Fallbacks.
 */

export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  apiBaseUrl: '/api',
} as const;
