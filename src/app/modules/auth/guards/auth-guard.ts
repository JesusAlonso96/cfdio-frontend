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
    .validateSession()
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


// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshSubject = new BehaviorSubject<string | null>(null);

//   constructor(private authService: AuthService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     const accessToken = localStorage.getItem('accessToken');
//     let cloned = req;

//     if (accessToken) {
//       cloned = this.addToken(req, accessToken);
//     }

//     return next.handle(cloned).pipe(
//       catchError(error => {
//         // Si el error es 401, intenta refrescar
//         if (error.status === 401 && !this.isRefreshing) {
//           this.isRefreshing = true;
//           this.refreshSubject.next(null);

//           return this.authService.refreshToken().pipe(
//             switchMap((res: any) => {
//               this.isRefreshing = false;
//               localStorage.setItem('accessToken', res.accessToken);
//               this.refreshSubject.next(res.accessToken);

//               // Reintenta la petición original
//               return next.handle(this.addToken(req, res.accessToken));
//             }),
//             catchError(err => {
//               this.isRefreshing = false;
//               this.authService.logout();
//               return throwError(() => err);
//             })
//           );
//         }

//         return throwError(() => error);
//       })
//     );
//   }

//   private addToken(req: HttpRequest<any>, token: string) {
//     return req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }
// }
