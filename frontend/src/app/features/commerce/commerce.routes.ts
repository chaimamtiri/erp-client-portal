import { Routes } from '@angular/router';

export const COMMERCE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },
  {
    path: 'products',
    loadComponent: () => import('../products/products.component').then((m) => m.ProductsComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('../cart/cart.component').then((m) => m.CartComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('../orders/orders.component').then((m) => m.OrdersComponent)
  },
  {
    path: 'orders/detail',
    loadComponent: () => import('../order-detail/order-detail.component').then((m) => m.OrderDetailComponent)
  },
  {
    path: 'invoices',
    loadComponent: () => import('../invoices/invoices.component').then((m) => m.InvoicesComponent)
  },
  {
    path: 'invoices/detail',
    loadComponent: () => import('../invoice-detail/invoice-detail.component').then((m) => m.InvoiceDetailComponent)
  },
  {
    path: 'payments',
    loadComponent: () => import('../payments/payments.component').then((m) => m.PaymentsComponent)
  },
  {
    path: 'deliveries',
    loadComponent: () => import('../deliveries/deliveries.component').then((m) => m.DeliveriesComponent)
  }
];
