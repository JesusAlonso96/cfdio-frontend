import { Routes } from '@angular/router';
import { authGuard } from './modules/auth/guards/auth-guard';
import { AuthComponent } from './modules/auth/pages/auth/auth';


export const MAIN_ROUTES: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];


