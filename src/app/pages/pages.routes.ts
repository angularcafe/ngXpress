import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'auth',
    loadComponent: () => import('@layouts/auth.layout').then((m) => m.AuthLayout),
    canActivate: [guestGuard],
    loadChildren: () => import('@pages/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'admin',
    loadComponent: () => import('@layouts/admin.layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    loadChildren: () => import('@pages/admin/admin.routes').then((m) => m.routes),
  },
  {
    path: 'error',
    loadChildren: () => import('@pages/errors/errors.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '/error/404',
  },
];
