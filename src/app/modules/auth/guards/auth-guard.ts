import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
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
