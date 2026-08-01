import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { stats, orders, invoices, deliveries } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/dashboard';

  private statsData = signal(stats);
  private ordersData = signal(orders);
  private invoicesData = signal(invoices);
  private deliveriesData = signal(deliveries);

  readonly stats = computed(() => this.statsData());
  readonly latestOrders = computed(() => this.ordersData().slice(0, 3));
  readonly latestInvoices = computed(() => this.invoicesData().slice(0, 3));
  readonly latestDeliveries = computed(() => this.deliveriesData().slice(0, 3));

  loadDashboardData(): void {
    this.http.get<any[]>(`${this.apiUrl}/stats`)
      .pipe(catchError(() => of(stats)))
      .subscribe(data => this.statsData.set(data));

    this.http.get<any[]>(`${this.apiUrl}/orders/latest`)
      .pipe(catchError(() => of(orders)))
      .subscribe(data => this.ordersData.set(data));

    this.http.get<any[]>(`${this.apiUrl}/invoices/latest`)
      .pipe(catchError(() => of(invoices)))
      .subscribe(data => this.invoicesData.set(data));

    this.http.get<any[]>(`${this.apiUrl}/deliveries/latest`)
      .pipe(catchError(() => of(deliveries)))
      .subscribe(data => this.deliveriesData.set(data));
  }
}
