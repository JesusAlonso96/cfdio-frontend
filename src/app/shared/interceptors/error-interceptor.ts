import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastService = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado.';
      // Mensaje explicito de error
      if (error.status === 401 && (req.url.includes('/auth/me') || req.url.includes('/auth/refresh'))) {
        // no mostrar toast
        return throwError(() => error);
      }
      
      if (error.error?.message) {
        message = error.error.message;
      } else {
        // Si no hay mensaje, decides según el código
        switch (error.status) {
          case 0:
            message = 'No se pudo conectar con el servidor.';
            break;
          case 500:
            message = 'Error interno del servidor.';
            break;
        }
      }

      _toastService.showError(message);

      // (Opcional) puedes agregar lógica para logout o refresh token
      // if (error.status === 401) {
      //   const authService = inject(AuthService);
      //   authService.logout();
      // }

      return throwError(() => error);
    })
  );
};