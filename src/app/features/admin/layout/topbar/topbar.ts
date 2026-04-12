import { Component, inject, signal, OnInit, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { Sidebar } from '../sidebar/sidebar';
import { SearchService } from '../../services/global-table-search.service';



@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class Topbar implements OnInit {
  private auth   = inject(AuthService);
  private router = inject(Router);

  // ─── Sidebar ref passed from admin-layout ─────────────
  @Input() sidebar!: Sidebar;

  searchTerm = signal<string>('');
  public searchService = inject(SearchService);


  // ─── Reactive user name from auth service ─────────────
  userName = computed(() => {
    const user = this.auth.user();
    if (!user) return 'Admin';    
    const firstName = user.firstName?.trim() || '';
    const lastName = user.lastName?.trim() || '';
    
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName || lastName) return (firstName || lastName);
    
    // Fallback to email-based name
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Admin';
  });

  userMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.userMenuItems = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/admin/profile'])
      },
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        styleClass: 'menu-logout',
        command: () => this.handleLogout()
      }
    ];
  }

  // ─── On input change — just update local signal ───────
  onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }

  // ─── On Enter — fire the search ───────────────────────
  onSearchEnter(): void {
    this.searchService.setSearch(this.searchTerm());
  }

  // ─── Clear search when value is empty ─────────────────
  onSearchClear(value: string): void {
    if (value === '') {
      this.searchService.clearSearch();
    }
  }

  private handleLogout(): void {
    this.auth.logout();
  }
}