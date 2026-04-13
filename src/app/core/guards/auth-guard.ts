// core/guards/auth-guard.ts

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  if (auth.isLoggedIn()) return true;

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  if (auth.isAdmin()) return true;

  return router.createUrlTree(['/auth/login-admin']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;

  // ✅ NEVER return false → always redirect instead
  return router.createUrlTree([
    auth.isAdmin() ? '/admin/coaches' : '/user/dashboard'
  ]);
};