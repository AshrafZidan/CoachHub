import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/coach-layout/coach-layout').then(m => m.CoachLayout),
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
        path: 'contact-us',
        loadComponent: () =>
          import('./contact-us/coach-contact-us.component').then(m => m.CoachContactUsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/coach-profile.component').then(m => m.CoachProfileComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class COACH_ROUTES {}
