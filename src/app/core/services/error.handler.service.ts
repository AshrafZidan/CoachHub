import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { StorageService } from './storage.service';

// ─── Backend error response shape ────────────────────────
interface ApiErrorResponse {
  messageEn?: string;
  messageAr?: string;
  code?:      string;
  httpStatus?: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private toast   = inject(ToastService);
  private router  = inject(Router);
  private storage = inject(StorageService);

  // ─── Main handler — call this in every catchError ─────
  handle(error: unknown, fallbackMessage = 'Something went wrong'): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error, fallbackMessage);
    } else if (error instanceof Error) {
      this.toast.error(error.message || fallbackMessage);
    } else {
      this.toast.error(fallbackMessage);
    }
  }

  // ─── Extract message from backend response ────────────
  extractMessage(error: unknown, fallback = 'Something went wrong'): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiErrorResponse;
      return body?.messageEn || this.getStatusMessage(error.status) || fallback;
    }
    if (error instanceof Error) return error.message || fallback;
    return fallback;
  }

  // ─── HTTP error handler ───────────────────────────────
  private handleHttpError(
    error: HttpErrorResponse,
    fallback: string
  ): void {
    const body    = error.error as ApiErrorResponse;
    const message = body?.messageEn || this.getStatusMessage(error.status) || fallback;

    switch (error.status) {
      case 0:
        // Network error — server unreachable
        this.toast.error(
          'Unable to connect to the server. Check your internet connection.',
          'Connection Error'
        );
        break;

      case 400:
        this.toast.error(message, 'Bad Request');
        break;

      case 401:
        // Token expired — handled by refresh interceptor
        // Only show toast if refresh also failed
        this.toast.warn('Your session has expired. Please log in again.', 'Session Expired');
        this.storage.clear();
        this.router.navigateByUrl('/auth/login');
        break;

      case 403:
        this.toast.error('You do not have permission to perform this action.', 'Access Denied');
        break;

      case 404:
        this.toast.error(message || 'The requested resource was not found.', 'Not Found');
        break;

      case 422:
        this.toast.error(message, 'Validation Error');
        break;

      case 429:
        this.toast.warn('Too many requests. Please slow down.', 'Rate Limited');
        break;

      case 500:
      case 502:
      case 503:
        this.toast.error(
          'A server error occurred. Please try again later.',
          'Server Error'
        );
        break;

      default:
        this.toast.error(message || fallback);
    }
  }

  // ─── Status code → human readable message ────────────
  private getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      0:   'No internet connection',
      400: 'Invalid request',
      401: 'Session expired',
      403: 'Access denied',
      404: 'Not found',
      422: 'Validation failed',
      429: 'Too many requests',
      500: 'Internal server error',
      502: 'Bad gateway',
      503: 'Service unavailable'
    };
    return messages[status] ?? '';
  }

}