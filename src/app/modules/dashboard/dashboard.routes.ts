import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      {
        path: 'datos-fiscales',
        loadComponent: () =>
          import('../tax-data/pages/main-tax-data/main-tax-data').then(m => m.MainTaxData),
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('../home/pages/home/home').then(m => m.HomeComponent)
      }
      //   { path: '', redirectTo: 'facturacion', pathMatch: 'full' },
    ],
  },
];
