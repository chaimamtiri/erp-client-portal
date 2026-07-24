import { Injectable, signal, computed } from '@angular/core';
import { stats, orders, invoices, notifications, deliveries } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private statsData = signal(stats);
  private ordersData = signal(orders);
  private invoicesData = signal(invoices);
  private notificationsData = signal(notifications);
  private deliveriesData = signal(deliveries);

  readonly stats$ = this.statsData.asReadonly();
  readonly orders$ = this.ordersData.asReadonly();
  readonly invoices$ = this.invoicesData.asReadonly();
  readonly notifications$ = this.notificationsData.asReadonly();
  readonly deliveries$ = this.deliveriesData.asReadonly();

  readonly stats = computed(() => this.statsData());
  readonly latestOrders = computed(() => this.ordersData().slice(0, 3));
  readonly latestInvoices = computed(() => this.invoicesData().slice(0, 3));
  readonly latestNotifications = computed(() => this.notificationsData().slice(0, 3));
  readonly latestDeliveries = computed(() => this.deliveriesData().slice(0, 3));

  getStats() {
    return this.statsData();
  }

  getLatestOrders(count: number = 3) {
    return this.ordersData().slice(0, count);
  }

  getLatestInvoices(count: number = 3) {
    return this.invoicesData().slice(0, count);
  }

  getLatestNotifications(count: number = 3) {
    return this.notificationsData().slice(0, count);
  }

  getLatestDeliveries(count: number = 3) {
    return this.deliveriesData().slice(0, count);
  }
}
