import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const  authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const coachGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  if (auth.isCoach()) {
    return true;
  }

  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/forbidden'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  // Admin → allow
  if (auth.isAdmin()) {
    return true;
  }

  // Logged-in non-admin (Coach/User) → Forbidden
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/forbidden'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Not logged in → Admin login
  return router.createUrlTree(['/auth/login-admin'], {
    queryParams: { returnUrl: state.url }
  });
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([
    auth.isAdmin()
      ? '/admin/coaches'
      : auth.isCoach()
        ? '/coach/bookings'
        : '/coachee/find-coach'
  ]);
};