import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const publicRoutes = [
    '/auth/login',
    '/auth/login-admin',
    '/auth/register',
    '/auth/forgot-password',
    '/mobile/api/coachees/register',
    '/auth/forgot-password/send-otp',
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