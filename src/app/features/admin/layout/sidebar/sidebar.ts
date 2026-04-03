import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// ─── Nav Item Model ───────────────────────────────────────
interface NavItem {
  label:   string;
  icon:    string;          // PrimeIcons class
  route:   string;
  badge?:  number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls:   ['./sidebar.scss']
})
export class Sidebar {
  private auth = inject(AuthService);

  // ─── Sidebar collapsed state (for mobile) ────────────
  isCollapsed = signal(false);

  // ─── Main nav items (matching the Figma design) ───────
  mainNavItems: NavItem[] = [
    { label: 'Coaches',      icon: 'pi pi-users',        route: '/admin/coaches'      },
    { label: 'Bookings',     icon: 'pi pi-calendar',     route: '/admin/bookings'     },
    { label: 'Coupons',      icon: 'pi pi-tag',          route: '/admin/coupons'      },
    { label: 'Admins',       icon: 'pi pi-shield',       route: '/admin/admins'       },
    { label: 'Reports',      icon: 'pi pi-chart-bar',    route: '/admin/reports', badge: 3 },
    { label: 'Gateways',     icon: 'pi pi-credit-card',  route: '/admin/gateways'     },
    { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', route: '/admin/transactions' }
  ];

  // ─── Settings nav items ───────────────────────────────
  settingsNavItems: NavItem[] = [
    { label: 'Help Center', icon: 'pi pi-question-circle', route: '/admin/help-center' }
  ];

  toggleSidebar(): void {
    this.isCollapsed.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}