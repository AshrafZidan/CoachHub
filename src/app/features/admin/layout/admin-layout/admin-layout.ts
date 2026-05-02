import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Topbar, CommonModule],
  template: `
    <div class="admin-shell">

      <!-- Sidebar gets a template ref so topbar can toggle it -->
      <app-sidebar #sidebar />

      <!-- Mobile overlay backdrop -->
      <div class="mobile-overlay" *ngIf="!sidebar.isCollapsed()" (click)="sidebar.close()"></div>

      <div class="admin-main">
        <!-- Pass sidebar ref to topbar for hamburger toggle -->
        <app-topbar [sidebar]="sidebar" />
        <main class="admin-content">
          <router-outlet />
        </main>
      </div>

    </div>
  `,
  styles: [`
    .admin-shell {
      display: flex;
      min-height: 100vh;
      background: #f5f6fa;
      position: relative;
    }

    .mobile-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 298;
      cursor: pointer;
      animation: fadeIn 0.25s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .mobile-overlay {
        display: block;
        /* Only cover the content area on the right, not the sidebar */
        left: 240px;
      }
    }

    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;

      /* Desktop: push content right of fixed sidebar */
      
    }

    .admin-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      margin-left: 240px;
      transition: margin-left 0.25s ease;
      background-color: #fff;

      @media (min-width: 769px) and (max-width: 1024px) {
        margin-left: 72px;
      }

      @media (max-width: 768px) {
        margin-left: 0;
      }
      @media (max-width: 768px) { padding: 16px; }
      @media (max-width: 480px) { padding: 12px; }
    }
  `]
})
export class AdminLayout {}