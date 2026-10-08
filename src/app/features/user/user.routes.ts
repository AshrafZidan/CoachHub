import { Routes } from '@angular/router';
import { authGuard, coachGuard } from '../../core/guards/auth-guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/layout/shared-layout/shared-layout.component').then(m => m.SharedLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'find-coach',
        pathMatch: 'full'
      },
      {
        path: 'find-coach',
        loadComponent: () =>
          import('./find-coach/find-coach.component').then(m => m.FindCoachComponent)
      },
      {
        path: 'coache-details',
        loadComponent: () =>
          import('./coache-details/coache-details.component').then(m => m.CoacheDetailsComponent)
      },
      {
      path: 'bookings',
      // canActivate: [coachGuard],
      loadComponent: () =>
        import('./../../shared/bookings/booking.component').then(m => m.BookingComponent)
      },
      {
      path: 'todo',
        loadComponent: () =>
        import('./../../shared/todo/todo.component').then(m => m.TodoComponent)
      },
      
      {
      path: 'task-details/:assignmentId',
        loadComponent: () =>
        import('./../../shared/todo/task-details/task-details.component')
      .then(m => m.TaskDetailsComponent)
      },
       {
      path: 'session/:bookingId',
      loadComponent: () =>
        import('./../../shared/session/session.component')
          .then(m => m.SessionComponent)
    }
    
    ]
  }
];
