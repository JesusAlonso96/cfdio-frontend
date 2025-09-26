import { Routes } from '@angular/router';
// import { authGuard } from './modules/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/auth/pages/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/pages/dashboard/dashboard').then(m => m.DashboardComponent),
    //canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];