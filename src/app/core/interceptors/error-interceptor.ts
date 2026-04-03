import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token expired or invalid → redirect to login
          localStorage.clear();
          router.navigate(['/auth/login']);
          break;

        case 403:
          // No permission → redirect to dashboard
          router.navigate(['/app/dashboard']);
          break;

        case 0:
          // Network error / server unreachable
          console.error('Network error — server unreachable');
          break;

        default:
          console.error(`HTTP Error ${error.status}:`, error.message);
      }

      return throwError(() => error);
    })
  );
};