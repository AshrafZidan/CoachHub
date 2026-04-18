import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
  Observable
} from 'rxjs';

const isRefreshing = new BehaviorSubject<boolean>(false);
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

    const authService = inject(AuthService);
    const storageService = inject(StorageService);
    const router = inject(Router);

    return next(req).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {

        if (error.status === 401) {
          return handle401Error(req, next, error, authService, storageService, router);
        }

        return throwError(() => error);
      })
    );
  };

// ✅ IMPORTANT: MUST return HttpEvent observable
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  error: HttpErrorResponse,
  authService: AuthService,
  storageService: StorageService,
  router: Router
): Observable<HttpEvent<unknown>> {

  if (!isRefreshing.value) {
    isRefreshing.next(true);

    if (storageService.isRefreshTokenExpired()) {
      authService.logout();
      isRefreshing.next(false);
      return throwError(() => error);
    }

    const refreshToken = storageService.getRefreshToken();

    if (!refreshToken) {
      authService.logout();
      isRefreshing.next(false);
      return throwError(() => error);
    }

    return authService.refreshAccessToken(refreshToken).pipe(
      switchMap((response) => {
        isRefreshing.next(false);
        refreshTokenSubject.next(response.data.accessToken);

        return next(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data.accessToken}`
            }
          })
        );
      }),
      catchError((refreshError): Observable<HttpEvent<unknown>> => {
        isRefreshing.next(false);
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((t): t is string => t !== null),
    take(1),
    switchMap((token) =>
      next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      )
    )
  );
}