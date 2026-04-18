import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth Interceptor
 * 
 * Responsibilities:
 * 1. Attach Bearer token to all outgoing requests
 * 2. Handle permission-based request blocking (optional)
 * 3. Log authentication state (development)
 * 
 * Order in interceptor chain: FIRST (before refresh token interceptor)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token attachment for public routes
  const publicRoutes = ['/auth/login','/auth/admin-login', '/auth/signup', '/auth/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  if (isPublicRoute) {
    return next(req);
  }

  // Get access token from AuthService
  const token = authService.getAccessToken();

  if (!token) {
    // No token available, continue without Bearer header
    return next(req);
  }

  // Clone request and attach Bearer token
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq);
};