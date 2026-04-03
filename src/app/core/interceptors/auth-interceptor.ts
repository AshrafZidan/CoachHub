import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.getAccessToken();

  if (!token || isPublicEndpoint(req.url)) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};

function isPublicEndpoint(url: string): boolean {
  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  return publicPaths.some((path) => url.includes(path));
}