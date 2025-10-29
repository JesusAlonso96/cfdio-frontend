import { Routes } from '@angular/router';
import { authGuard } from './modules/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./modules/auth/pages/auth/auth').then(m => m.AuthComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
];