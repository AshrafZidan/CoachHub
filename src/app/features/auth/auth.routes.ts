import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/auth-guard';

/**
 * Authentication Feature Routes
 * 
 * All routes are protected by guestGuard
 * Only unauthenticated users can access auth routes
 */
export const AUTH_ROUTES: Routes = [
  // ============================================
  // Root Redirect
  // ============================================
  /**
   * Redirect empty path to login
   */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  // ============================================
  // Login Route
  // ============================================
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login').then(c => c.LoginComponent),
    data: {
      websiteView: true,
    },
    title: 'Login — CoachHub',
  },

  // ============================================
  // Admin Login Route
  // ============================================
  /**
   * Admin-specific login page
   * Note: Still protected by guestGuard
   * Admin role check happens in admin routes
   */
  {
    path: 'login-admin',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login').then(c => c.LoginComponent),
    data: {
      websiteView: false,
    },
    title: 'Admin Login — CoachHub',
  },

  // ============================================
  // Register Route
  // ============================================
  {
    path: 'register',
    loadComponent: () =>
    import('./signup/signup').then(c => c.Signup),
    title: 'Signup — CoachHub',
  },

  // ============================================
  // Forgot Password Route
  // ============================================
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forget-password/forget-password').then(c => c.ForgetPassword),
    title: 'Forgot Password — CoachHub',
  },
];