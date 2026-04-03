import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ─── authGuard: only logged-in users ─────────────────────
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/auth/login']);
};

// ─── adminGuard: only ADMIN role ─────────────────────────
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) return true;
  return router.createUrlTree(['/app/dashboard']);
};

// ─── guestGuard: redirect logged-in users away from auth pages ──
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (!auth.isLoggedIn()) return true;

  // Redirect based on role
  return auth.isAdmin()
    ? inject(Router).createUrlTree(['/admin/dashboard'])
    : inject(Router).createUrlTree(['/app/dashboard']);
};