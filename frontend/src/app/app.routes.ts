import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, noAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [noAuthGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent) },
      { path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent) },
      { path: 'orders/detail', loadComponent: () => import('./pages/order-detail/order-detail.component').then((m) => m.OrderDetailComponent) },
      { path: 'invoices', loadComponent: () => import('./pages/invoices/invoices.component').then((m) => m.InvoicesComponent) },
      { path: 'invoices/detail', loadComponent: () => import('./pages/invoice-detail/invoice-detail.component').then((m) => m.InvoiceDetailComponent) },
      { path: 'payments', loadComponent: () => import('./pages/payments/payments.component').then((m) => m.PaymentsComponent) },
      { path: 'deliveries', loadComponent: () => import('./pages/deliveries/deliveries.component').then((m) => m.DeliveriesComponent) },
      { path: 'documents', loadComponent: () => import('./pages/documents/documents.component').then((m) => m.DocumentsComponent) },
      { path: 'support', loadComponent: () => import('./pages/support/support.component').then((m) => m.SupportComponent) },
      { path: 'support/detail', loadComponent: () => import('./pages/ticket-detail/ticket-detail.component').then((m) => m.TicketDetailComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
      { path: 'addresses', redirectTo: 'profile' },
      { path: 'activity', loadComponent: () => import('./pages/activity/activity.component').then((m) => m.ActivityComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
