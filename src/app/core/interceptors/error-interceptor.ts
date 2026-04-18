import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService); // Assuming you have a toast service for notifications


  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
           if (!router.url.includes('/auth/login')) {

    toast.error('Session expired. Please log in again.', 'Unauthorized');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: router.url }
    });
  }
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