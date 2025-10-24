import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { BYPASS_REFRESH } from '../../../core/tokens/http-context.tokens';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const _toastService = inject(ToastService);
  const route = inject(ActivatedRoute);
  // URLs que NO deben disparar el refresh
  const excludedEndpoints = ['login', 'logout', 'register', 'refresh'];

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si no es 401 → se propaga el error
      if (error.status !== 401) return throwError(() => error);

      if (req.context.get(BYPASS_REFRESH)) {
        return next(req);
      }

      // Si la URL coincide con alguno de los endpoints excluidos → no refrescar
      const shouldSkip = excludedEndpoints.some(url => req.url.includes(url));
      if (shouldSkip) return throwError(() => error);

      // Evitar múltiples refresh simultáneos
      if (authService.refreshInProgress) {
        return authService.refreshInProgress$.pipe(
          switchMap(() => next(req.clone()))
        );
      }

      // Marcar refresh en curso
      authService.setRefreshInProgress(true);

      return authService.refreshToken().pipe(
        switchMap(() => {
          authService.setRefreshInProgress(false);
          // Reintentar la petición original
          return next(req.clone());
        }),
        catchError(err => {
          authService.setRefreshInProgress(false);


          _toastService.showError('Tu sesión expiró, por favor inicia sesión de nuevo');
          authService.logout();
          return throwError(() => err);
        })
      );
    })
  );
};