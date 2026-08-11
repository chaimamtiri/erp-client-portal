import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile'
  },
  {
    path: 'profile',
    loadComponent: () => import('../profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('../settings/settings.component').then((m) => m.SettingsComponent)
  },
  {
    path: 'documents',
    loadComponent: () => import('../documents/documents.component').then((m) => m.DocumentsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('../notifications/notifications.component').then((m) => m.NotificationsComponent)
  }
];
