import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/layout/shared-layout/shared-layout.component').then(m => m.SharedLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'bookings',
        pathMatch: 'full'
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./booking/booking.component').then(m => m.BookingComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./booking/coach-add-appointment.component').then(m => m.CoachAddAppointmentComponent)
      },
      {
        path: 'todo',
        loadComponent: () =>
          import('./todo/todo.component').then(m => m.TodoComponent)
      },
        {
        path: 'todo/add',
        loadComponent: () =>
          import('./todo/add-task.component').then(m => m.AddTaskComponent)
      },

      {
          path: 'task-details/:assignmentId',
        loadComponent: () =>
    import('./todo/task-details.component')
      .then(m => m.TaskDetailsComponent)
},
      
      
      {
        path: 'Coachees',
        loadComponent: () =>
          import('./coachees/coach-coachees.component').then(m => m.CoachCoacheesComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/coach-profile.component').then(m => m.CoachProfileComponent)
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class COACH_ROUTES {}
