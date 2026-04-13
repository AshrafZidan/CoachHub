// app.routes.ts

import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [guestGuard], // ✅ مهم جدًا بدل canActivate
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  }
];