import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'find-coach',
    loadComponent: () =>
      import('./find-coach/find-coach.component').then(m => m.FindCoachComponent)
  },
  {
    path: '',
    redirectTo: 'find-coach',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
