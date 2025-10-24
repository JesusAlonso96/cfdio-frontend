import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const _loadingService = inject(LoadingService);
  const _authService = inject(AuthService);

  //se manda petición a backend para validar sesión con cookies
  const actualRoute: string = route.url[0].path;
  _loadingService.show();
  //si esta en dashboard
  const isDashboardRoute: boolean = actualRoute.includes("dashboard");

  return _authService
    .validateSession(!isDashboardRoute)
    .pipe(
      map(() => {
        _loadingService.hide();
        if (isDashboardRoute) {
          return true;

        } else {
          router.navigate(['/dashboard']);
          return false;
        }
      }),
      catchError(() => {
        _loadingService.hide();
        if (isDashboardRoute) {
          router.navigate(['/auth']);
          return of(false);
        } else {
          return of(true);
        }
      })
    );
};
