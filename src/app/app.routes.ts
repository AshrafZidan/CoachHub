import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
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
    path: '**',
    redirectTo: 'auth/login'
  }
];