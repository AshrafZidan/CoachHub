import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // ✅ SSR safe
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/auth/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  if (auth.isAdmin()) return true;

  return router.createUrlTree(['/auth/login-admin']);
};

export const guestGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  if (!auth.isLoggedIn()) return true;

  // ✅ Return UrlTree directly
  return auth.isAdmin()
    ? router.createUrlTree(['/admin/coaches'])
    : router.createUrlTree(['/user/dashboard']);
};