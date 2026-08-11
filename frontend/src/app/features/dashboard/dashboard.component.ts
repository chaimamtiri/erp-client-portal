import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { SectionCardComponent } from '../../ui/section-card/section-card.component';
import { StatCardComponent } from '../../ui/stat-card/stat-card.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    BreadcrumbComponent,
    SectionCardComponent,
    StatCardComponent,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly dashboardService: DashboardService = inject(DashboardService);
  private readonly translate: TranslateService = inject(TranslateService);

  protected readonly statsList = this.dashboardService.stats;
  protected readonly latestOrders = this.dashboardService.latestOrders;
  protected readonly latestInvoices = this.dashboardService.latestInvoices;
  protected readonly deliveryList = this.dashboardService.latestDeliveries;
  protected readonly client = this.dashboardService.client;

  ngOnInit(): void {
    this.dashboardService.loadDashboardData();
  }

  protected formatCurrency(amount: number | undefined | null): string {
    if (amount === undefined || amount === null) return '€0,00';
    return formatCurrency(amount, this.currentLocale(), '€', 'EUR', '1.2-2');
  }

  protected formatInvoiceAmount(amount: number): string {
    return this.formatCurrency(amount);
  }

  protected formatDeliveryDate(value: Date): string {
    return formatDate(value, 'dd/MM/yyyy', this.currentLocale());
  }

  protected statusKey(status: string): string {
    const map: Record<string, string> = {
      'confirmée': 'COMMON.STATUS.CONFIRMED',
      'confirm': 'COMMON.STATUS.CONFIRMED',
      'en cours': 'COMMON.STATUS.IN_PROGRESS',
      'in progress': 'COMMON.STATUS.IN_PROGRESS',
      'expédiée': 'COMMON.STATUS.SHIPPED',
      'shipped': 'COMMON.STATUS.SHIPPED',
      'annulée': 'COMMON.STATUS.CANCELED',
      'canceled': 'COMMON.STATUS.CANCELED',
      'payée': 'COMMON.STATUS.PAID',
      'paid': 'COMMON.STATUS.PAID',
      'en attente': 'COMMON.STATUS.PENDING',
      'pending': 'COMMON.STATUS.PENDING'
    };

    return map[(status || '').toLowerCase()] ?? status;
  }

 private currentLocale(): string {
    const lang = this.translate.currentLang();
    if (lang === 'en') return 'en-US';
    if (lang === 'ar') return 'ar';
    return 'fr-FR';
  }
}

