import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/auth-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login').then(c => c.LoginComponent),
    title: 'Login — CoachHub'
  },
  {
    path: 'login-admin',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login').then(c => c.LoginComponent),
    title: 'Admin Login — CoachHub'
  }
];