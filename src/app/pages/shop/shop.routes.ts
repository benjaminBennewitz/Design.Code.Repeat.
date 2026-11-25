/** @file Lazy-geladene Seiten des DCR//TOOLS Shops. */

import { Routes } from '@angular/router';

/** Katalog, Produktdetails und Vorschau des Gastkaufs. */
export const SHOP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./shop-catalog.component').then(module => module.ShopCatalogComponent),
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./shop-product.component').then(module => module.ShopProductComponent),
  },
  {
    path: 'checkout/:slug',
    loadComponent: () => import('./shop-checkout.component').then(module => module.ShopCheckoutComponent),
  },
  {
    path: 'order/:slug',
    loadComponent: () => import('./shop-order.component').then(module => module.ShopOrderComponent),
  },
  {
    path: 'support',
    loadComponent: () => import('./shop-support.component').then(module => module.ShopSupportComponent),
  },
  {
    path: 'agb',
    data: { kind: 'terms' },
    loadComponent: () => import('./shop-legal.component').then(module => module.ShopLegalComponent),
  },
  {
    path: 'widerrufsbelehrung',
    data: { kind: 'notice' },
    loadComponent: () => import('./shop-legal.component').then(module => module.ShopLegalComponent),
  },
  {
    path: 'widerruf',
    loadComponent: () => import('./shop-withdrawal.component').then(module => module.ShopWithdrawalComponent),
  },
  {
    path: '**',
    loadComponent: () => import('../not-found-page/not-found-page.component').then(module => module.NotFoundPageComponent),
  },
];
