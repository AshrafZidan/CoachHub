import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly ACCESS_TOKEN_KEY  = 'coachhub_access_token';
  private readonly REFRESH_TOKEN_KEY = 'coachhub_refresh_token';
  private readonly USER_KEY          = 'coachhub_user';

  private platformId = inject(PLATFORM_ID);
  private isBrowser  = isPlatformBrowser(this.platformId);

  private getStorage(): Storage | null {
    return this.isBrowser ? localStorage : null;
  }

  // ─── Access Token ─────────────────────────────────────
  setAccessToken(token: string): void {
    this.getStorage()?.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return this.getStorage()?.getItem(this.ACCESS_TOKEN_KEY) ?? null;
  }

  // ─── Refresh Token ────────────────────────────────────
  setRefreshToken(token: string): void {
    this.getStorage()?.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return this.getStorage()?.getItem(this.REFRESH_TOKEN_KEY) ?? null;
  }

  // ─── User ─────────────────────────────────────────────
  setUser(user: object): void {
    this.getStorage()?.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const raw = this.getStorage()?.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  // ─── Clear All ────────────────────────────────────────
  clear(): void {
    this.getStorage()?.removeItem(this.ACCESS_TOKEN_KEY);
    this.getStorage()?.removeItem(this.REFRESH_TOKEN_KEY);
    this.getStorage()?.removeItem(this.USER_KEY);
  }
}