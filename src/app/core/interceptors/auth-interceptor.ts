import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const publicRoutes = [
    '/auth/login',
    '/auth/admin-login',
    '/auth/signup',
    '/auth/forgot-password'
  ];

  const isPublicRoute = publicRoutes.some(route => req.url.endsWith(route));

  if (isPublicRoute) {
    return next(req);
  }

  const token = authService.getAccessToken();

  if (!token) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq);
};