import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';

// ─── Singleton state (shared across all interceptor calls) ─
let isRefreshing = false;
const newAccessToken$ = new BehaviorSubject<string | null>(null);

interface RefreshResponse {
  accessToken: string;
  refreshToken: {
    id: number;
    token: string;
    expiryDate: string;
  };
}

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const router  = inject(Router);
  const http    = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // ─── Only handle 401 and skip auth endpoints ────────
      if (error.status !== 401 || isAuthEndpoint(req.url)) {
        return throwError(() => error);
      }

      const refreshToken = storage.getRefreshToken();

      // ─── No refresh token or it's expired → logout ──────
      if (!refreshToken || storage.isRefreshTokenExpired()) {
        forceLogout(storage, router);
        return throwError(() => error);
      }

      // ─── Already refreshing → queue this request ────────
      if (isRefreshing) {
        return newAccessToken$.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token => next(attachToken(req, token!)))
        );
      }

      // ─── Start refreshing ────────────────────────────────
      isRefreshing = true;
      newAccessToken$.next(null);

      return http.post<ApiResponse<RefreshResponse>>(
        `${environment.apiUrl}/auth/refresh-token`,
        { refreshToken }   // ← send the UUID string
      ).pipe(
        switchMap(response => {
          isRefreshing = false;

          const { accessToken, refreshToken: newRefresh } = response.data;

          // ✅ Save new tokens
          storage.setAccessToken(accessToken);
          storage.setRefreshToken(newRefresh.token);
          storage.setRefreshTokenExpiry(newRefresh.expiryDate);

          // ✅ Notify all queued requests
          newAccessToken$.next(accessToken);

          // ✅ Retry the original failed request
          return next(attachToken(req, accessToken));
        }),
        catchError(refreshError => {
          // ─── Refresh call itself failed → force logout ───
          isRefreshing = false;
          forceLogout(storage, router);
          return throwError(() => refreshError);
        })
      );
    })
  );
};

// ─── Helpers ─────────────────────────────────────────────
function attachToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

function isAuthEndpoint(url: string): boolean {
  return ['/auth/login', '/auth/refresh-token'].some(p => url.includes(p));
}

function forceLogout(storage: StorageService, router: Router): void {
  storage.clear();
  router.navigate(['/auth/login']);
}