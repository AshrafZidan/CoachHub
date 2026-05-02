import { Injectable, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Storage keys
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly REFRESH_TOKEN_EXPIRY_KEY = 'refresh_token_expiry';
  private readonly PERMISSIONS_KEY = 'permissions';

  // ─── Get / Set Access Token ──────────────────────────
  getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  // ─── Get / Set Refresh Token ─────────────────────────
  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // ─── Get / Set Refresh Token Expiry ──────────────────
  getRefreshTokenExpiry(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);
  }

  setRefreshTokenExpiry(expiry: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRY_KEY, expiry);
  }

  
  // ─── Get / Set Permissions ───────────────────────────
  /**
   * Get permissions array from storage
   * @returns Array of permission strings, or null if not found
   */
  getPermissions(): string[] | null {
    if (!this.isBrowser) return null;
    const stored = localStorage.getItem(this.PERMISSIONS_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid JSON, clear it
      localStorage.removeItem(this.PERMISSIONS_KEY);
      return null;
    }
  }

  /**
   * Set permissions array in storage
   * @param permissions Array of permission strings
   */
  setPermissions(permissions: string[]): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions));
    } catch (error) {
      console.error('Error storing permissions:', error);
    }
  }

  // ─── Clear All Storage ───────────────────────────────
  /**
   * Clear all stored data (tokens and permissions)
   */
  clear(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);
  }

  // ─── Utility Methods ─────────────────────────────────
  /**
   * Check if user is authenticated (has valid access token)
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isRefreshTokenExpired(): boolean {
  if (!this.isBrowser) return true;

  const expiry = this.getRefreshTokenExpiry();
  if (!expiry) return true;

  const expiryDate = new Date(expiry).getTime();
  const now = Date.now();

  return now >= expiryDate;
}
  
  /**
   * Get all stored data (useful for debugging)
   */
  getAllData(): Record<string, any> {
    if (!this.isBrowser) return {};
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      refreshTokenExpiry: this.getRefreshTokenExpiry(),
      permissions: this.getPermissions(),
    };
  }
}