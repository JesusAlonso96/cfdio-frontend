import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      {
        path: 'datos-fiscales',
        loadChildren: () =>
          import('../tax-data/tax-data.routes').then(m => m.TAX_DATA_ROUTES),
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
