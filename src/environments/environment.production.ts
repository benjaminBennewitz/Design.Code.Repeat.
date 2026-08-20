/**
 * @file Production-Environment-Template der Studio-Website.
 * @description Die endgültige öffentliche Domain ist vor dem ersten Production-Deployment einzutragen.
 */

export const environment = {
  production: true,
  siteUrl: 'https://replace-with-production-domain.invalid',
  apiBaseUrl: '/api',
} as const;
