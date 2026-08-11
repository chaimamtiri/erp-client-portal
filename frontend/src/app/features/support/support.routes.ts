import { Routes } from '@angular/router';

export const SUPPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../support/support.component').then((m) => m.SupportComponent)
  },
  {
    path: 'ticket-detail',
    loadComponent: () => import('../ticket-detail/ticket-detail.component').then((m) => m.TicketDetailComponent)
  }
];
