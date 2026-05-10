import { Injectable, inject } from '@angular/core';
import { signal, computed } from '@angular/core';

export interface PermissionResponse {
  permissions: Permissions[];
}


export enum Permissions {
  Transactions = 'TRANSACTIONS',
  Reports = 'REPORTS',
  Admins = 'ADMINS',
  Gateways = 'GATEWAYS',
  Coaches = 'COACHES',
  Coupons = 'COUPONS',
  Booking = 'BOOKING',
}
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  // Store permissions as a signal for reactive updates
  private readonly permissionsSignal = signal<string[]>([]);

  // Expose as a read-only computed signal
  readonly permissions = computed(() => this.permissionsSignal());

  /**
   * Set permissions from login response
   * Called after successful authentication
   */
  setPermissions(permissions: string[]): void {
    this.permissionsSignal.set(permissions);
  }

  /**
   * Clear permissions (e.g., on logout)
   */
  clearPermissions(): void {
    this.permissionsSignal.set([]);
  }

  /**
   * Check if user has a specific permission
   * @param permission - Single permission string to check
   * @returns true if user has the permission
   */
  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  /**
   * Check if user has ALL of multiple permissions (AND logic)
   * @param permissions - Array of permission strings
   * @returns true if user has all permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Check if user has ANY of multiple permissions (OR logic)
   * @param permissions - Array of permission strings
   * @returns true if user has at least one permission
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Get all permissions for debugging/display
   */
  getAllPermissions(): string[] {
    return [...this.permissions()];
  }
}