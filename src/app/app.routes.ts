import { Routes } from '@angular/router';
import { adminGuard, authGuard, coachGuard, guestGuard } from './core/guards/auth-guard';
import { NotFoundComponent } from './core/components/not-found/not-found.comppment';
import path from 'path';
import { ForbiddenComponent } from './core/components/forbidden/forbidden.component';

/**
 * Main Application Routes
 * 
 * Route Priority:
 * 1. Feature routes with guards (auth, admin)
 * 2. Root redirect
 * 3. Wildcard 404 (MUST BE LAST)
 */
export const routes: Routes = [
  // ============================================
  // Auth Routes
  // ============================================
  {
    path: 'auth',
    // canActivateChild: [guestGuard], // Only accessible to guests (not authenticated)
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // ============================================
  // Admin Routes
  // ============================================
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // Must be authenticated AND have admin role
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },


// ============================================
  // Admin Routes
  // ============================================
  {
    path:'coach',
    canActivate: [authGuard,coachGuard],
    loadChildren: () =>
      import('./features/coach/coach.routes').then(m => m.COACH_ROUTES),
    
  },
  {
    path: 'coachee',
    loadChildren: () =>
      import('./features/user/user.routes').then(m => m.USER_ROUTES),
  },
{

  path:'forbidden',
  component:ForbiddenComponent
},
  
  // ============================================
  // Root Redirect
  // ============================================
  /**
   * Redirect empty path to login
   * This handles the base URL redirect
   */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  // ============================================
  // 404 Not Found (MUST BE LAST!)
  // ============================================
  /**
   * Catch-all route for unmatched paths
   * CRITICAL: This MUST be the last route
   */
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  //   data: { title: 'Page Not Found - CoachHub' },
  // },
];