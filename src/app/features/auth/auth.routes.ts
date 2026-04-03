import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [

  {
    path: 'login-admin',
    loadComponent: () =>
      import('./login/login').then(c => c.LoginComponent),
    title: 'Admin — Login — CoachHub',
    // isAdmin:true
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(c => c.LoginComponent),
    title: 'Login — CoachHub',
    // isAdmin:false
  }
  // {
  //   path: 'signup',
  //   loadComponent: () =>
  //     import('./signup/signup.component').then(c => c.SignupComponent),
  //   title: 'Create Account — CoachHub'
  // },
  // {
  //   path: 'forgot-password',
  //   loadComponent: () =>
  //     import('./forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
  //   title: 'Forgot Password — CoachHub'
  // }
];