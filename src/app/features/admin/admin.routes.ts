import { Routes } from '@angular/router';
import { adminGuard, authGuard } from '../../core/guards/auth-guard';
import { permissionGuard } from '../../core/guards/permission.guard';
import { ForbiddenComponent } from '../../core/components/forbidden/forbidden.component';
import {Permissions} from './../../core/services/permission.service'
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then(c => c.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'coaches',
        pathMatch: 'full'
      },
      {
        path: 'coaches',
        loadComponent: () =>
          import('./coaches-management/coaches-management').then(c => c.CoachesManagement),
        title: 'coaches — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Coaches])]
      },
      {
        path: 'coaches/edit-coach/:id',
        loadComponent: () =>
          import('./coaches-management/edit-coach/edit-coach').then(c => c.EditCoachComponent),
        title: 'Edit Coache — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Coaches])]

      },

      {
        path: 'booking',
        loadComponent: () =>
          import('./bookings-management/bookings-management').then(c => c.BookingsManagement),
        title: 'Bookings — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Booking])]

      },
      {
        path: 'coupons',
        loadComponent: () =>
          import('./coupons-management/coupones-management').then(c => c.CouponsManagement),
        title: 'Coupons — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Coupons])]


      },
      {
        path: 'coupons/create',
        loadComponent: () =>
          import('./coupons-management/create-coupon/create-coupon/create-coupon.component').then(c => c.CreateCouponComponent),
        title: 'Create Coupon — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Coupons])]

      },
      {
        path: 'admins-list',
        loadComponent: () =>
          import('./admins-management/admins-management').then(c => c.AdminsManagement),
        title: 'Admins  List — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Admins])]

      },
      {
        path: 'admins-List/create',
        loadComponent: () =>
          import('./admins-management/create-admin/create-admin.component').then(c => c.CreateAdminComponent),
        title: 'Create Admin — CoachHub Admin',
        canActivate: [permissionGuard([Permissions.Admins])]

      },
        {
        path: 'forbidden',
        component: ForbiddenComponent,
      },

      // {
      //   path: 'reports',
      //   loadComponent: () =>
      //     import('./reports/reports.component').then(c => c.ReportsComponent),
      //   title: 'Reports — CoachHub Admin'
      // },
      // {
      //   path: 'gateways',
      //   loadComponent: () =>
      //     import('./gateways/gateways.component').then(c => c.GatewaysComponent),
      //   title: 'Gateways — CoachHub Admin'
      // },
      // {
      //   path: 'transactions',
      //   loadComponent: () =>
      //     import('./transactions/transactions.component').then(c => c.TransactionsComponent),
      //   title: 'Transactions — CoachHub Admin'
      // },
      // {
      //   path: 'help-center',
      //   loadComponent: () =>
      //     import('./help-center/help-center.component').then(c => c.HelpCenterComponent),
      //   title: 'Help Center — CoachHub Admin'
      // }
    ]
  }
];