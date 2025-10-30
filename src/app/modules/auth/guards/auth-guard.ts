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

  _loadingService.show();
  //si esta en dashboard

  
  return _authService.validateSession(true).pipe(
    map(() => {
      _loadingService.hide();
      // Si es login u otra ruta pública, redirigir a dashboard si ya está logueado
      if (route.url[0]?.path !== 'dashboard') {
        return router.createUrlTree(['/dashboard']);
      }

      return true; // permitir dashboard
    }),
    catchError(() => {
      _loadingService.hide();
      // Si intenta acceder a dashboard sin sesión
      if (route.url[0]?.path === 'dashboard') {
        return of(router.createUrlTree(['/auth']));
      }
      return of(true);
    })
  );
};
