import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from '../services/permission.service';

/**
 * Functional guard that checks if user has required permissions for a route
 * Usage in routing config:
 * {
 *   path: 'coaches',
 *   canActivate: [permissionGuard(['view_coaches'])],
 *   component: CoachesComponent
 * }
 */
export const permissionGuard = (requiredPermissions: string[], requireAll = true): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    // Check permissions based on requireAll flag
    const hasAccess = requireAll
      ? permissionService.hasAllPermissions(requiredPermissions)
      : permissionService.hasAnyPermission(requiredPermissions);

    if (hasAccess) {
      return true;
    }

    // Redirect to 403 page on unauthorized access
    router.navigate(['/admin/forbidden'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  };
};

/**
 * Alternative: Class-based guard if you prefer it
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionGuard {
  private readonly permissionService = inject(PermissionService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermissions = route.data['requiredPermissions'] as string[];
    const requireAll = route.data['requireAll'] !== false; // Default to AND logic

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const hasAccess = requireAll
      ? this.permissionService.hasAllPermissions(requiredPermissions)
      : this.permissionService.hasAnyPermission(requiredPermissions);

    if (hasAccess) {
      return true;
    }

    this.router.navigate(['/admin/forbidden'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}