import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
      },
      {
        path: 'commerce',
        loadChildren: () => import('./features/commerce/commerce.routes').then((m) => m.COMMERCE_ROUTES)
      },
      {
        path: 'account',
        loadChildren: () => import('./features/account/account.routes').then((m) => m.ACCOUNT_ROUTES)
      },
      {
        path: 'support',
        loadChildren: () => import('./features/support/support.routes').then((m) => m.SUPPORT_ROUTES)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      },
      {
        path: 'activity',
        loadComponent: () => import('./features/activity/activity.component').then((m) => m.ActivityComponent)
      },
      { path: 'products', redirectTo: 'commerce/products' },
      { path: 'cart', redirectTo: 'commerce/cart' },
      { path: 'orders', redirectTo: 'commerce/orders' },
      { path: 'orders/detail', redirectTo: 'commerce/orders/detail' },
      { path: 'invoices', redirectTo: 'commerce/invoices' },
      { path: 'invoices/detail', redirectTo: 'commerce/invoices/detail' },
      { path: 'payments', redirectTo: 'commerce/payments' },
      { path: 'deliveries', redirectTo: 'commerce/deliveries' },
      { path: 'documents', redirectTo: 'account/documents' },
      { path: 'notifications', redirectTo: 'account/notifications' },
      { path: 'profile', redirectTo: 'account/profile' },
      { path: 'settings', redirectTo: 'account/settings' },
      { path: 'support/detail', redirectTo: 'support/ticket-detail' }
    ]
  },
  { path: '**', redirectTo: '' }
];

