import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

/**
 * Error Interceptor
 * 
 * Responsibilities:
 * 1. Catch HTTP errors
 * 2. Display user-friendly error messages via Toast
 * 3. Log errors for debugging
 * 4. Handle specific error codes (400, 403, 404, 500, etc.)
 * 
 * Order in interceptor chain: THIRD (last, after auth and refresh token interceptors)
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // ─── Extract error message ────────────────────────────────
      const message = getErrorMessage(error);
      const summary = getErrorSummary(error);
      const severity = getErrorSeverity(error.status);

      // ─── Log error for debugging ──────────────────────────────
      logError(error, message);

      // ─── Show toast notification ──────────────────────────────
      messageService.add({
        severity,
        summary,
        detail: message,
        sticky: false,
        life: 4000
      });

      // ─── Pass error to component error handler ────────────────
      return throwError(() => error);
    })
  );
};

/**
 * Get error message from response
 * Handles multiple error response formats
 */
function getErrorMessage(error: HttpErrorResponse): string {
  // Try to get message from backend API response
  if (error.error?.messageEn) {
    return error.error.messageEn;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  if (error.error?.errors) {
    // Handle validation errors (array or object)
    if (Array.isArray(error.error.errors)) {
      return error.error.errors[0]?.message || 'Validation error occurred';
    } else if (typeof error.error.errors === 'object') {
      const errorMessages = Object.values(error.error.errors)
        .filter((e: any) => typeof e === 'string')
        .join(', ');
      return errorMessages || 'Validation error occurred';
    }
  }

  // Fallback messages based on status code
  switch (error.status) {
    case 0:
      return 'Unable to connect to server. Please check your network connection.';
    case 400:
      return error.error?.detail || 'Invalid request. Please check your input.';
    case 401:
      return 'Unauthorized. Please login again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Request conflict. Please refresh and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Bad Gateway. Server is temporarily unavailable.';
    case 503:
      return 'Service Unavailable. Please try again later.';
    case 504:
      return 'Gateway Timeout. Please try again later.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
}

/**
 * Get error summary for toast
 */
function getErrorSummary(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return 'Connection Error';
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 500:
      return 'Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      return 'Error';
  }
}

/**
 * Get toast severity based on status code
 */
function getErrorSeverity(status: number): 'error' | 'warn' | 'info' {
  if (status === 0 || (status >= 500 && status < 600)) {
    return 'error'; // Server errors are critical
  }
  if (status >= 400 && status < 500) {
    return 'warn'; // Client errors are warnings
  }
  return 'info'; // Other errors are info
}

/**
 * Log error to console for debugging
 */
function logError(error: HttpErrorResponse, message: string): void {
  // ⚠️ Only log in development
  if (!isProduction()) {
    console.group(`%c❌ HTTP Error ${error.status}`, 'color: red; font-weight: bold;');
    console.log('URL:', error.url);
    console.log('Status:', error.status);
    console.log('Message:', message);
    console.log('Response:', error.error);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

/**
 * Check if running in production
 */
function isProduction(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  );
}