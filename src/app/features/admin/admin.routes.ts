import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(c => c.DashboardComponent),
      title: 'Dashboard — Admin — CoachHub',
  }

];