import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  LoginRequest,
  LoginData,
  ApiResponse,
  ApiError,
  User,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE_URL = environment.apiUrl;

  private http    = inject(HttpClient);
  private router  = inject(Router);
  private storage = inject(StorageService);

  // ─── Signals ──────────────────────────────────────────
  private _accessToken = signal<string | null>(
    this.storage.getAccessToken()
  );

  readonly isLoggedIn = computed(() => !!this._accessToken());

  readonly isAdmin = computed(() => {
    const token = this._accessToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // ✅ Backend returns "ROLE_ADMIN" — check both formats
      return (
        payload.roles?.includes('ROLE_ADMIN') ||
        payload.roles?.includes('ADMIN') ||
        false
      );
    } catch {
      return false;
    }
  });

  // ─── Get User from token ──────────────────────────────
  readonly user = computed<User | null>(() => {
    const token = this._accessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      let firstName = payload.firstName || payload.given_name || payload.first_name || '';
      let lastName  = payload.lastName  || payload.family_name || payload.last_name  || '';
      const email   = payload.email || payload.sub || '';

      if (!firstName && !lastName && payload.name) {
        const parts = payload.name.split(' ');
        firstName = parts[0] || '';
        lastName  = parts.slice(1).join(' ') || '';
      }

      return {
        id:        payload.id,
        email,
        firstName,
        lastName,
        roles: payload.roles || []
      };
    } catch {
      return null;
    }
  });

  // ─── LOGIN ────────────────────────────────────────────
  login(payload: LoginRequest): Observable<ApiResponse<LoginData>> {
    return this.http
      .post<ApiResponse<LoginData>>(`${this.BASE_URL}/auth/login`, payload)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          const apiError: ApiError = error.error;
          const message = apiError?.messageEn ?? 'Login failed. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  // ─── LOGOUT ───────────────────────────────────────────
  logout(): void {
    this.storage.clear();
    this._accessToken.set(null);
    // ✅ Use createUrlTree-style navigation
    this.router.navigateByUrl('/auth/login');
  }

  // ─── TOKEN ────────────────────────────────────────────
  getAccessToken(): string | null {
    return this._accessToken();
  }

  getUser(): User | null {
    return this.user();
  }

  getFullName(): string {
    const u = this.user();
    if (!u) return 'Admin';

    const firstName = u.firstName?.trim() || '';
    const lastName  = u.lastName?.trim()  || '';

    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName || lastName) return (firstName || lastName).trim();
    if (u.email) {
      const name = u.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Admin';
  }

  // ─── REDIRECT AFTER LOGIN (role-based) ────────────────
  redirectAfterLogin(): void {
    // ✅ navigateByUrl is fine here — called after successful login, not in a guard
    this.router.navigateByUrl(
      this.isAdmin() ? '/admin/coaches' : '/user/dashboard'
    );
  }

  // ─── PRIVATE ──────────────────────────────────────────
  private handleAuthSuccess(response: ApiResponse<LoginData>): void {
    const { accessToken, refreshToken } = response.data;

    this.storage.setAccessToken(accessToken);
    this.storage.setRefreshToken(refreshToken.token);
    this.storage.setRefreshTokenExpiry(refreshToken.expiryDate);

    this._accessToken.set(accessToken);
  }
}