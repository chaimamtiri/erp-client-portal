import { ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { orders, Order } from '../../models/mock-data';



@Component({
  selector: 'app-orders',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, FormsModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Commandes']" />
    <mat-card class="orders-card">
      <div class="orders-card__header">
        <div>
          <h2>Commandes</h2>
          <p>Historique des commandes et suivi de livraison.</p>
        </div>
        <button mat-flat-button color="primary" (click)="goToProducts()">Nouvelle commande</button>
      </div>
      <div class="orders-filters">
        <mat-form-field class="filter-field">
          <mat-label>Rechercher</mat-label>
          <input matInput [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="N° commande, client...">
        </mat-form-field>
        <mat-form-field class="filter-field">
          <mat-label>Validation</mat-label>
          <mat-select [ngModel]="validationFilter()" (ngModelChange)="validationFilter.set($event)">
            <mat-option [value]="true">Validée</mat-option>
            <mat-option [value]="false">En attente</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field class="filter-field">
          <mat-label>Paiement</mat-label>
          <mat-select [ngModel]="paymentFilter()" (ngModelChange)="paymentFilter.set($event)">
            <mat-option value="">Tous</mat-option>
            <mat-option [value]="true">Soldée</mat-option>
            <mat-option [value]="false">Solde dû</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field class="filter-field">
          <mat-label>Statut</mat-label>
          <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <mat-option value="">Tous</mat-option>
            <mat-option value="Confirmée">Confirmée</mat-option>
            <mat-option value="En cours">En cours</mat-option>
            <mat-option value="Expédiée">Expédiée</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-stroked-button (click)="resetFilters()">Réinitialiser</button>
      </div>
      <div class="filter-results" *ngIf="filteredOrders().length === 0">
        <p>Aucune commande ne correspond à vos critères de filtrage.</p>
      </div>
      <table mat-table [dataSource]="filteredOrders()" class="orders-table">
        <ng-container matColumnDef="numero">
          <th mat-header-cell *matHeaderCellDef>N° Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.numero }}</td>
        </ng-container>
        <ng-container matColumnDef="clientNom">
          <th mat-header-cell *matHeaderCellDef>Client</th>
          <td mat-cell *matCellDef="let element">{{ element.clientNom }}</td>
        </ng-container>
        <ng-container matColumnDef="dateCommande">
          <th mat-header-cell *matHeaderCellDef>Date Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.dateCommande | date: 'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="totalTTC">
          <th mat-header-cell *matHeaderCellDef>Montant TTC</th>
          <td mat-cell *matCellDef="let element">{{ element.totalTTC | currency: 'EUR': 'symbol': '1.2-2' }}</td>
        </ng-container>
        <ng-container matColumnDef="estValider">
          <th mat-header-cell *matHeaderCellDef>Validation</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.validated]="element.estValider">
              {{ element.estValider ? 'Validée' : 'En attente' }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="estSolder">
          <th mat-header-cell *matHeaderCellDef>Paiement</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.paid]="element.estSolder">
              {{ element.estSolder ? 'Soldée' : 'Solde: ' + (element.soldeDu | currency: 'EUR': 'symbol': '1.2-2') }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="statusLibelle">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">{{ element.statusLibelle }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-button color="primary" (click)="openTimeline(element); $event.stopPropagation()">Voir suivi</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selectOrder(row)" [class.selected]="selectedOrder()?.numero === row.numero"></tr>
      </table>

      <!-- Dialog template for order timeline -->
      <ng-template #timelineTpl>
        <div class="timeline-dialog">
          <div class="dialog-header">
            <h3>Suivi de la commande</h3>
            <div class="dialog-actions">
              <button mat-stroked-button color="primary" (click)="printTimeline()">Imprimer</button>
            </div>
          </div>
          <div class="dialog-body">
            <div *ngIf="selectedOrder(); else noSelection">
              <div *ngFor="let step of timelineSteps()" class="timeline__item">
                <span [class.done]="step.done">{{ step.index }}</span>
                <div>
                  <strong>{{ step.title }}</strong>
                  <p *ngIf="step.subtitle">{{ step.subtitle }}</p>
                </div>
              </div>
            </div>
            <ng-template #noSelection>
              <p>Sélectionnez une commande pour voir son historique.</p>
            </ng-template>
          </div>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.orders-card { border-radius: 20px; padding: 1rem; }`,
    `.orders-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; }`,
    `.orders-filters { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: flex-end; }`,
    `.filter-field { flex: 1; min-width: 150px; }`,
    `.orders-table { width: 100%; margin-bottom: 1rem; }`,
    `.timeline { padding-top: 0.5rem; }`,
    `.timeline__item { display: flex; gap: 0.8rem; align-items: flex-start; padding: 0.6rem 0; border-bottom: 1px solid #e2e8f0; }`,
    `.timeline__item span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 999px; background: #eff6ff; color: #2563eb; font-weight: 700; }`,
    `.validated { background-color: #dcfce7; color: #166534; }`,
    `.paid { background-color: #dbeafe; color: #1e40af; }`,
    `.filter-results { padding: 1rem; text-align: center; color: #666; background-color: #f9fafb; border-radius: 8px; }`,
    `.selected { background-color: #f1f5f9; }`,
    `.timeline__item span.done { background: #dcfce7; color: #166534; }`,
    `.timeline-dialog { width: 100%; max-width: 560px; padding: 0.5rem 1rem; }`,
    `.dialog-header { display:flex; justify-content:space-between; align-items:center; gap:1rem; border-bottom:1px solid #eef2f7; padding-bottom:0.5rem; margin-bottom:0.5rem }`,
    `.dialog-actions { display:flex; gap:0.5rem }`,
    `.dialog-body { max-height: 60vh; overflow:auto; padding-right:0.5rem }`,
    `.timeline-dialog h3 { margin:0 }`,
    `.timeline-dialog .timeline__item { padding:0.4rem 0 }`,
    `.timeline-dialog .timeline__item span { width:28px; height:28px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  protected readonly displayedColumns = ['numero', 'clientNom', 'dateCommande', 'totalTTC', 'estValider', 'estSolder', 'statusLibelle', 'actions'];

  // State management with signals
  protected readonly allOrders = signal<Order[]>(orders);
  protected searchTerm = signal('');
  protected validationFilter = signal<boolean | ''>('');
  protected paymentFilter = signal<boolean | ''>('');
  protected statusFilter = signal('');

  // Computed filtered data
  protected readonly filteredOrders = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const validation = this.validationFilter();
    const payment = this.paymentFilter();
    const status = this.statusFilter();

    return this.allOrders().filter(order => {
      // Search filter
      if (search && !order.numero.toLowerCase().includes(search) && !order.clientNom.toLowerCase().includes(search)) {
        return false;
      }

      // Validation filter
      if (validation !== '' && order.estValider !== validation) {
        return false;
      }

      // Payment filter
      if (payment !== '' && order.estSolder !== payment) {
        return false;
      }

      // Status filter
      if (status && order.statusLibelle !== status) {
        return false;
      }

      return true;
    });
  });

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.validationFilter.set('');
    this.paymentFilter.set('');
    this.statusFilter.set('');
  }

  // Navigation
  private readonly router = inject(Router);
  // Dialog
  private readonly dialog = inject(MatDialog);
  @ViewChild('timelineTpl') private readonly timelineTpl!: TemplateRef<any>;

  protected goToProducts(): void {
    this.router.navigate(['/products']);
  }

  // Selection + timeline
  protected selectedOrder = signal<Order | null>(null);

  protected selectOrder(order: Order): void {
    this.selectedOrder.set(order);
  }

  protected openTimeline(order: Order): void {
    this.selectedOrder.set(order);
    const ref = this.dialog.open(this.timelineTpl, { width: '480px' });
    ref.afterClosed().subscribe(() => this.selectedOrder.set(null));
  }

  protected printTimeline(): void {
    const order = this.selectedOrder();
    if (!order) return;

    const steps = this.timelineSteps();
    const printedAt = new Date().toLocaleString();

    const html = `
      <html>
      <head>
        <title>Suivi ${order.numero}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111 }
          h1 { font-size: 18px; margin-bottom: 6px }
          .meta { color: #555; margin-bottom: 12px }
          .step { margin: 8px 0; display:flex; gap:12px; align-items:flex-start }
          .bubble { width:28px; height:28px; display:inline-grid; place-items:center; border-radius:50%; background:#eff6ff; font-weight:700 }
          .done { background:#dcfce7 }
        </style>
      </head>
      <body>
        <h1>Suivi commande ${order.numero}</h1>
        <div class="meta">Client: ${order.clientNom} — Imprimé: ${printedAt}</div>
        ${steps.map(s => `
          <div class="step">
            <div class="bubble ${s.done ? 'done' : ''}">${s.index}</div>
            <div>
              <div><strong>${s.title}</strong></div>
              ${s.subtitle ? `<div>${s.subtitle}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Give browser a moment to render then print
    setTimeout(() => {
      w.focus();
      w.print();
      // keep window open so user can see print dialog; optionally close after
      setTimeout(() => w.close());
    }, 300);
  }

  protected readonly timelineSteps = computed(() => {
    const order = this.selectedOrder();
    if (!order) return [] as Array<{ index: number; title: string; subtitle?: string; done: boolean }>;

    const steps: Array<{ index: number; title: string; subtitle?: string; done: boolean }> = [];
    // 1. Commande reçue
    steps.push({ index: 1, title: 'Commande reçue', subtitle: order.numero, done: true });
    // 2. Validée
    steps.push({ index: 2, title: 'Commande validée', subtitle: order.estValider ? 'Validée' : 'En attente de validation', done: !!order.estValider });
    // 3. Préparation
    const prepping = order.statusLibelle === 'En cours' || order.statusLibelle === 'Confirmée';
    steps.push({ index: 3, title: 'Préparation', subtitle: prepping ? 'Articles préparés' : 'En attente', done: prepping });
    // 4. Expédition
    const shipped = order.statusLibelle === 'Expédiée';
    steps.push({ index: 4, title: 'Expédiée', subtitle: shipped ? 'Expédiée au client' : '', done: shipped });
    // 5. Paiement
    steps.push({ index: 5, title: 'Paiement', subtitle: order.estSolder ? 'Soldée' : 'Solde: ' + order.soldeDu, done: !!order.estSolder });

    return steps;
  });
}

