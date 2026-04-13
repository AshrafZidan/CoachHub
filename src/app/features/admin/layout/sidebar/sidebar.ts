import { Component, signal, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TooltipModule } from 'primeng/tooltip';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
  badge?: number;
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

  // ─── Collapse state ──────────────────────────────
  isCollapsed = signal(true);

  // ─── Reactive screen width signal ───────────────
  screenWidth = signal(0);

  mainNavItems: NavItem[] = [
    { label: 'Coaches',      icon: 'pi pi-users',                  route: '/admin/coaches'      },
    { label: 'Bookings',     icon: 'pi pi-calendar',               route: '/admin/bookings'     },
    { label: 'Coupons',      icon: 'pi pi-tag',                    route: '/admin/coupons'      },
    { label: 'Admins',       icon: 'pi pi-shield',                 route: '/admin/admins-List'       },
    { label: 'Reports',      icon: 'pi pi-chart-bar',              route: '/admin/reports', badge: 1 },
    { label: 'Gateways',     icon: 'pi pi-credit-card',            route: '/admin/gateways'     },
    { label: 'Transactions', icon: 'pi pi-arrow-right-arrow-left', route: '/admin/transactions' }
  ];

  settingsNavItems: NavItem[] = [
    { label: 'Help Center', icon: 'pi pi-question-circle', route: '/admin/help-center' }
  ];

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