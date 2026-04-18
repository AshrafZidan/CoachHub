import { Component, signal, inject, HostListener, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Permissions, PermissionService } from '../../../../core/services/permission.service';
import { TooltipModule } from 'primeng/tooltip';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  permission?: string | string[]; // Single permission or array for AND logic
  requireAllPermissions?: boolean; // Default: true (AND logic). Set false for OR
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TooltipModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar implements OnInit {
  private auth = inject(AuthService);
  private permissionService = inject(PermissionService);

  // ─── Collapse state ──────────────────────────────
  isCollapsed = signal(true);

  // ─── Reactive screen width signal ───────────────
  screenWidth = signal(0);

  // ─── All nav items (unfiltered) ──────────────────
  private allMainNavItems: NavItem[] = [
    { 
      label: 'Coaches', 
      icon: 'pi pi-users', 
      route: '/admin/coaches',
      permission: Permissions.Coaches
    },
    { 
      label: 'Bookings', 
      icon: 'pi pi-calendar', 
      route: '/admin/bookings',
      permission: Permissions.Booking
    },
    { 
      label: 'Coupons', 
      icon: 'pi pi-tag', 
      route: '/admin/coupons',
      permission: 'view_coupons'
    },
    { 
      label: 'Admins', 
      icon: 'pi pi-shield', 
      route: '/admin/admins-list',
      permission: 'manage_admins'
    },
    { 
      label: 'Reports', 
      icon: 'pi pi-chart-bar', 
      route: '/admin/reports', 
      badge: 1,
      permission: 'view_reports'
    },
    { 
      label: 'Gateways', 
      icon: 'pi pi-credit-card', 
      route: '/admin/gateways',
      permission: ['view_gateways', 'manage_gateways'],
      requireAllPermissions: false // User needs either permission (OR logic)
    },
    { 
      label: 'Transactions', 
      icon: 'pi pi-arrow-right-arrow-left', 
      route: '/admin/transactions',
      permission: 'view_transactions'
    }
  ];

  private allSettingsNavItems: NavItem[] = [
    { 
      label: 'Help Center', 
      icon: 'pi pi-question-circle', 
      route: '/admin/help-center'
      // No permission required for help center
    }
  ];

  // ─── Computed filtered nav items based on permissions ───────────────────
  mainNavItems = computed(() => this.filterNavItems(this.allMainNavItems));
  settingsNavItems = computed(() => this.filterNavItems(this.allSettingsNavItems));

  ngOnInit(): void {
    // SSR-safe: only access window if it exists
    if (typeof window !== 'undefined') {
      this.screenWidth.set(window.innerWidth);
      this.updateCollapseState();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (typeof window !== 'undefined') {
      this.screenWidth.set(window.innerWidth);
      this.updateCollapseState();
    }
  }

  /**
   * Filter nav items based on user permissions
   * Only shows items the user has permission to access
   */
  private filterNavItems(items: NavItem[]): NavItem[] {
    return items.filter(item => {
      // If no permission is specified, always show the item
      if (!item.permission) {
        return true;
      }

      // Single permission string
      if (typeof item.permission === 'string') {
        return this.permissionService.hasPermission(item.permission);
      }

      // Multiple permissions (array)
      const requireAll = item.requireAllPermissions !== false; // Default to AND logic
      if (requireAll) {
        return this.permissionService.hasAllPermissions(item.permission);
      } else {
        return this.permissionService.hasAnyPermission(item.permission);
      }
    });
  }

  /**
   * Check if a nav item should be visible (for dynamic disabling if needed)
   */
  canAccessRoute(item: NavItem): boolean {
    if (!item.permission) {
      return true;
    }

    if (typeof item.permission === 'string') {
      return this.permissionService.hasPermission(item.permission);
    }

    const requireAll = item.requireAllPermissions !== false;
    return requireAll
      ? this.permissionService.hasAllPermissions(item.permission)
      : this.permissionService.hasAnyPermission(item.permission);
  }

  private updateCollapseState(): void {
    const width = this.screenWidth();
    if (width <= 768) {
      this.isCollapsed.set(true); // mobile: hidden
    } else if (width > 768 && width <= 1024) {
      this.isCollapsed.set(true); // tablet: icons only
    } else {
      this.isCollapsed.set(false); // desktop: expanded
    }
  }

  isMobileView(): boolean {
    return this.screenWidth() < 768;
  }

  toggle(): void {
    this.isCollapsed.update(v => !v);
  }

  close(): void {
    if (this.isMobileView()) {
      this.isCollapsed.set(true);
    }
  }

  logout(): void {
    this.auth.logout();
  }
}