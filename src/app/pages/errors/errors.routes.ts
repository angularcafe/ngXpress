import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '403',
    loadComponent: () => import('./forbidden.page').then((m) => m.ForbiddenPage),
  },
  {
    path: '404',
    loadComponent: () => import('./not-found.page').then((m) => m.NotFoundPage),
  },
  {
    path: '500',
    loadComponent: () => import('./server-error.page').then((m) => m.ServerErrorPage),
  },
  {
    path: '503',
    loadComponent: () => import('./maintenance.page').then((m) => m.MaintenancePage),
  },
  {
    path: '',
    redirectTo: '404',
    pathMatch: 'full',
  },
];
