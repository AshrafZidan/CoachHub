import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

let isRedirecting = false;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // ─── Prevent redirect for login APIs ─────────────────────
      const isAuthRequest =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/admin-login');

      // ✅ Handle 401 Unauthorized
      if (error.status === 401 && !isAuthRequest) {
        handleUnauthorized(router, messageService);
        return throwError(() => error);
      }

      // ─── Normal error handling ──────────────────────────────
      const message = getErrorMessage(error);
      const summary = getErrorSummary(error);
      const severity = getErrorSeverity(error.status);

      logError(error, message);

      messageService.add({
        severity,
        summary,
        detail: message,
        life: 4000
      });

      return throwError(() => error);
    })
  );
};

/**
 * Handle Unauthorized (401)
 */
function handleUnauthorized(router: Router, messageService: MessageService): void {
  if (isRedirecting) return;

  isRedirecting = true;

  // 🧹 Clear tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  // 🔔 Show message
  messageService.add({
    severity: 'warn',
    summary: 'Unauthorized',
    detail: 'Session expired. Please login again.',
    life: 4000
  });

  // 🔁 Redirect
  router.navigate(['/login']).then(() => {
    isRedirecting = false;
  });
}

/**
 * Get error message
 */
function getErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.messageEn) return error.error.messageEn;
  if (error.error?.message) return error.error.message;

  if (error.error?.errors) {
    if (Array.isArray(error.error.errors)) {
      return error.error.errors[0]?.message || 'Validation error occurred';
    } else if (typeof error.error.errors === 'object') {
      return Object.values(error.error.errors).join(', ');
    }
  }

  switch (error.status) {
    case 0: return 'Unable to connect to server.';
    case 400: return error.error?.detail || 'Invalid request.';
    case 401: return 'Unauthorized. Please login again.';
    case 403: return 'Permission denied.';
    case 404: return 'Resource not found.';
    case 500: return 'Server error.';
    default: return error.message || 'Unknown error';
  }
}

/**
 * Get summary
 */
function getErrorSummary(error: HttpErrorResponse): string {
  switch (error.status) {
    case 400: return 'Bad Request';
    case 401: return 'Unauthorized';
    case 403: return 'Forbidden';
    case 404: return 'Not Found';
    case 500: return 'Server Error';
    default: return 'Error';
  }
}

/**
 * Severity
 */
function getErrorSeverity(status: number): 'error' | 'warn' | 'info' {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'info';
}

/**
 * Debug log
 */
function logError(error: HttpErrorResponse, message: string): void {
  if (!isProduction()) {
    console.group(`❌ HTTP ${error.status}`);
    console.log('URL:', error.url);
    console.log('Message:', message);
    console.log('Response:', error.error);
    console.groupEnd();
  }
}

function isProduction(): boolean {
  return !location.hostname.includes('localhost');
}