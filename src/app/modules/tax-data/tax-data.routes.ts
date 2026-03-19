import { Routes } from '@angular/router';

export const TAX_DATA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main-tax-data/main-tax-data').then((c) => c.MainTaxData),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/create-tax-data/create-tax-data').then((c) => c.CreateTaxDataComponent),
  },
  {
    path: 'nuevo/resumen',
    loadComponent: () =>
      import('./pages/tax-data-summary/tax-data-summary').then((c) => c.TaxDataSummaryComponent),
  },
];
