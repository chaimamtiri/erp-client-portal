import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { activity, deliveries, invoices, notifications, orders, stats } from '../../models/mock-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatListModule, BreadcrumbComponent, SectionCardComponent, StatCardComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Dashboard']" />

    <div class="dashboard-hero">
      <div>
        <p class="eyebrow">Vue d’ensemble</p>
        <h2>Tableau de bord</h2>
        <p>Bienvenue dans votre espace client ERP. Suivez les performances, les commandes et les paiements en quelques clics.</p>
      </div>
      <button mat-flat-button color="primary">Voir les commandes</button>
    </div>

    <section class="stats-grid">
      <app-stat-card *ngFor="let item of statsList; trackBy: trackByTitle" [title]="item.title" [value]="item.value" [change]="item.change" [icon]="item.icon" [tone]="item.tone"></app-stat-card>
    </section>

    <section class="content-grid">
      <app-section-card title="Dernières commandes" subtitle="Suivi en temps réel" actionLabel="Voir tout" actionLink="/orders" class="full-width">
        <mat-list>
          <mat-list-item *ngFor="let order of latestOrders; trackBy: trackById">
            <div class="row-item">
              <span>{{ order.id }}</span>
              <span>{{ order.customer }}</span>
              <span>{{ order.amount }}</span>
              <span>{{ order.status }}</span>
            </div>
          </mat-list-item>
        </mat-list>
      </app-section-card>

      <app-section-card title="Dernières factures" subtitle="État de paiement" actionLabel="Consulter" actionLink="/invoices">
        <mat-list>
          <mat-list-item *ngFor="let invoice of latestInvoices; trackBy: trackById">
            <div class="row-item">
              <span>{{ invoice.id }}</span>
              <span>{{ invoice.amount }}</span>
              <span>{{ invoice.status }}</span>
            </div>
          </mat-list-item>
        </mat-list>
      </app-section-card>

      <app-section-card title="Notifications" subtitle="Alertes récentes" actionLabel="Voir tout" actionLink="/notifications">
        <mat-list>
          <mat-list-item *ngFor="let notification of notificationList; trackBy: trackByTitle">
            <div class="notification-item">
              <strong>{{ notification.title }}</strong>
              <span>{{ notification.detail }}</span>
            </div>
          </mat-list-item>
        </mat-list>
      </app-section-card>

      <app-section-card title="Solde du compte" subtitle="Disponibilité" actionLabel="Paiements" actionLink="/payments">
        <div class="balance-card">
          <div class="balance-card__amount">€48 250.00</div>
          <div class="balance-card__meta">Disponible immédiatement</div>
          <div class="balance-card__chips">
            <span>Virement</span>
            <span>Carte</span>
            <span>PayPal</span>
          </div>
        </div>
      </app-section-card>

      <app-section-card title="Livraisons à venir" subtitle="Planning de la semaine" actionLabel="Voir" actionLink="/deliveries">
        <mat-list>
          <mat-list-item *ngFor="let delivery of deliveryList; trackBy: trackById">
            <div class="delivery-item">
              <strong>{{ delivery.order }}</strong>
              <span>{{ delivery.eta }}</span>
            </div>
          </mat-list-item>
        </mat-list>
      </app-section-card>
    </section>
  `,
  styles: [
    `:host { display: block; }`,
    `.dashboard-hero { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.4rem 1.6rem; border-radius: 24px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #fff; margin-bottom: 1rem; }`,
    `.dashboard-hero .eyebrow { text-transform: uppercase; opacity: 0.8; letter-spacing: 0.18em; font-size: 0.8rem; margin: 0 0 0.4rem; }`,
    `.dashboard-hero h2 { margin: 0; font-size: 1.7rem; }`,
    `.dashboard-hero p { margin: 0.6rem 0 0; color: rgba(255,255,255,0.85); max-width: 48rem; }`,
    `.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1rem; }`,
    `.content-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }`,
    `.full-width { grid-column: 1 / -1; }`,
    `.row-item, .notification-item, .delivery-item { display: flex; justify-content: space-between; gap: 1rem; width: 100%; flex-wrap: wrap; }`,
    `.balance-card { padding: 0.6rem 0; }`,
    `.balance-card__amount { font-size: 1.7rem; font-weight: 700; }`,
    `.balance-card__meta { color: #64748b; margin: 0.4rem 0 0.8rem; }`,
    `.balance-card__chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }`,
    `.balance-card__chips span { padding: 0.35rem 0.7rem; border-radius: 999px; background: #eff6ff; color: #2563eb; font-size: 0.82rem; }`,
    `.delivery-item strong { font-weight: 600; }`,
    `.content-grid app-section-card { min-height: 250px; }`,
    `@media (max-width: 900px) { .stats-grid, .content-grid { grid-template-columns: 1fr; } .dashboard-hero { flex-direction: column; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly statsList = stats;
  protected readonly latestOrders = orders.slice(0, 3);
  protected readonly latestInvoices = invoices.slice(0, 3);
  protected readonly notificationList = notifications.slice(0, 3);
  protected readonly deliveryList = deliveries.slice(0, 3);

  protected trackById(_: number, item: { id: string }) {
    return item.id;
  }

  protected trackByTitle(_: number, item: { title: string }) {
    return item.title;
  }
}
