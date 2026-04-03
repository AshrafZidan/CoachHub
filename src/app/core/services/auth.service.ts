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
  readonly isAdmin    = computed(() => {
    const token = this._accessToken();
    if (!token) return false;
    try {
      // Decode JWT payload to get role
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles?.includes('ROLE_ADMIN') ?? false;
    } catch {
      return false;
    }
  });

  // ─── LOGIN ────────────────────────────────────────────
  login(payload: LoginRequest): Observable<ApiResponse<LoginData>> {
    return this.http
      .post<ApiResponse<LoginData>>(`${this.BASE_URL}/auth/login`, payload)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          // Extract messageEn from backend error response
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
    this.router.navigateByUrl('/auth/login');
  }

  // ─── TOKEN HELPER ─────────────────────────────────────
  getAccessToken(): string | null {
    return this._accessToken();
  }

  // ─── REDIRECT AFTER LOGIN ─────────────────────────────
  redirectAfterLogin(): void {
    if(this.isAdmin()){
      this.router.navigateByUrl('/admin/dashboard')
    }else {
      this.router.navigateByUrl('/app/dashboard');
    }
    
  }

  // ─── PRIVATE: handle success response ─────────────────
  private handleAuthSuccess(response: ApiResponse<LoginData>): void {
    const { accessToken, refreshToken } = response.data;

    this.storage.setAccessToken(accessToken);
    this.storage.setRefreshToken(refreshToken.token);

    this._accessToken.set(accessToken);
  }
}