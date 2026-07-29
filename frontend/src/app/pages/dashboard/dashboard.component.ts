import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule, BreadcrumbComponent, SectionCardComponent, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly dashboardService: DashboardService = inject(DashboardService);

  protected readonly statsList = this.dashboardService.stats;
  protected readonly latestOrders = this.dashboardService.latestOrders;
  protected readonly latestInvoices = this.dashboardService.latestInvoices;
  protected readonly deliveryList = this.dashboardService.latestDeliveries;

  ngOnInit(): void {
    this.dashboardService.loadDashboardData();
  }
}