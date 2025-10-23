import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldUseCredentials = !req.url.endsWith('/auth/login') && !req.url.endsWith('/auth/register');
  const cloned = shouldUseCredentials ? req.clone({ withCredentials: true }) : req;
  return next(cloned);
};
