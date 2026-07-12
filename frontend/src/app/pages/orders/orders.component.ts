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
import { orders, Commande } from '../../models/mock-data';

type StepStatus = 'done' | 'active' | 'pending' | 'canceled';

interface TimelineStep {
  index: number;
  title: string;
  subtitle?: string;
  status: StepStatus;
}

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
            <mat-option value="Annulée">Annulée</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-stroked-button (click)="resetFilters()">Réinitialiser</button>
      </div>
      @if (filteredOrders().length === 0) {
        <div class="filter-results">
          <p>Aucune commande ne correspond à vos critères de filtrage.</p>
        </div>
      }
      <table mat-table [dataSource]="filteredOrders()" class="orders-table">
        <ng-container matColumnDef="numero">
          <th mat-header-cell *matHeaderCellDef>N° Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.numero }}</td>
        </ng-container>
        <ng-container matColumnDef="clientNom">
          <th mat-header-cell *matHeaderCellDef>Client</th>
          <td mat-cell *matCellDef="let element">{{ element.clientNom }}</td>
        </ng-container>
        <ng-container matColumnDef="date_commande">
          <th mat-header-cell *matHeaderCellDef>Date Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.date_commande | date: 'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="total_ttc">
          <th mat-header-cell *matHeaderCellDef>Montant TTC</th>
          <td mat-cell *matCellDef="let element">{{ element.total_ttc | currency: 'EUR': 'symbol': '1.2-2' }}</td>
        </ng-container>
        <ng-container matColumnDef="est_valider">
          <th mat-header-cell *matHeaderCellDef>Validation</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.validated]="element.est_valider">
              {{ element.est_valider ? 'Validée' : 'En attente' }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="est_solder">
          <th mat-header-cell *matHeaderCellDef>Paiement</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.paid]="element.est_solder">
              {{ element.est_solder ? 'Soldée' : 'Solde: ' + (element.solde_du | currency: 'EUR': 'symbol': '1.2-2') }}
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
        @if (selectedOrder(); as order) {
          <div class="timeline-dialog">
            <div class="dialog-header">
              <div class="dialog-header__title">
                <span class="dialog-header__eyebrow">Suivi de commande</span>
                <h3>{{ order.numero }}</h3>
              </div>
              <button mat-icon-button class="dialog-close" (click)="closeTimeline()" aria-label="Fermer">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="dialog-summary">
              <div class="summary-item">
                <span class="summary-label">Client</span>
                <span class="summary-value">{{ order.clientNom }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Date</span>
                <span class="summary-value">{{ order.date_commande | date: 'dd/MM/yyyy' }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Montant TTC</span>
                <span class="summary-value">{{ order.total_ttc | currency: 'EUR': 'symbol': '1.2-2' }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Statut</span>
                <mat-chip class="summary-chip" [class.validated]="order.est_valider">{{ order.statusLibelle }}</mat-chip>
              </div>
            </div>

            <div class="dialog-body">
              <div class="timeline-legend">
                <span class="legend-item"><span class="legend-dot done"></span>Terminé</span>
                <span class="legend-item"><span class="legend-dot active"></span>En cours</span>
                <span class="legend-item"><span class="legend-dot pending"></span>À venir</span>
                <span class="legend-item"><span class="legend-dot canceled"></span>Annulé</span>
              </div>

              <div class="timeline-vertical">
                @for (step of timelineSteps(); track step.index; let last = $last) {
                  <div class="timeline-row">
                    <div class="timeline-row__marker">
                      <div class="step-circle" [class]="step.status">
                        @if (step.status === 'done') {
                          <mat-icon>check</mat-icon>
                        }
                        @if (step.status === 'canceled') {
                          <mat-icon>close</mat-icon>
                        }
                        @if (step.status === 'active' || step.status === 'pending') {
                          <span class="step-number">{{ step.index }}</span>
                        }
                      </div>
                      @if (!last) {
                        <div class="step-connector" [class.done]="step.status === 'done'"></div>
                      }
                    </div>
                    <div class="timeline-row__content" [class]="step.status">
                      <strong class="step-title">{{ step.title }}</strong>
                      @if (step.subtitle) {
                        <p class="step-subtitle">{{ step.subtitle }}</p>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="timeline-dialog timeline-dialog--empty">
            <p>Sélectionnez une commande pour voir son historique.</p>
          </div>
        }
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
    `.validated { background-color: #dcfce7; color: #166534; }`,
    `.paid { background-color: #dbeafe; color: #1e40af; }`,
    `.filter-results { padding: 1rem; text-align: center; color: #666; background-color: #f9fafb; border-radius: 8px; }`,
    `.selected { background-color: #f1f5f9; }`,

    /* ---- Timeline dialog ---- */
    `.timeline-dialog { width: 100%; padding: 0; }`,
    `.timeline-dialog--empty { padding: 2rem; text-align: center; color: #666; }`,
    `.dialog-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 1.75rem 2rem 1.25rem; border-bottom: 1px solid #eef2f7; }`,
    `.dialog-header__title { display: flex; flex-direction: column; gap: 0.15rem; }`,
    `.dialog-header__eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; }`,
    `.dialog-header h3 { margin: 0; font-size: 22px; font-weight: 700; color: #0f172a; }`,
    `.dialog-close { color: #64748b; margin-top: -4px; }`,
    `.dialog-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1.25rem 2rem; background: #f8fafc; border-bottom: 1px solid #eef2f7; }`,
    `.summary-item { display: flex; flex-direction: column; gap: 0.25rem; }`,
    `.summary-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: #94a3b8; }`,
    `.summary-value { font-size: 14px; font-weight: 600; color: #1e293b; }`,
    `.summary-chip { width: fit-content; font-size: 12px; }`,
    `.dialog-body { max-height: 60vh; overflow: auto; padding: 1.5rem 2.5rem 2rem 2rem; }`,

    `.timeline-legend { display: flex; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }`,
    `.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 12px; color: #64748b; }`,
    `.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }`,
    `.legend-dot.done { background: #22c55e; }`,
    `.legend-dot.active { background: #2563eb; }`,
    `.legend-dot.pending { background: #cbd5e1; }`,
    `.legend-dot.canceled { background: #dc2626; }`,

    `.timeline-vertical { display: flex; flex-direction: column; }`,
    `.timeline-row { display: flex; align-items: stretch; gap: 1.25rem; }`,
    `.timeline-row__marker { display: flex; flex-direction: column; align-items: center; }`,

    /* step circle base */
    `.step-circle { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex-shrink: 0; border: 2px solid transparent; }`,
    /* done = green */
    `.step-circle.done { background: #dcfce7; color: #166534; border-color: #bbf7d0; }`,
    /* active/in-process = dark blue */
    `.step-circle.active { background: #2563eb; color: #ffffff; border-color: #1d4ed8; box-shadow: 0 0 0 4px rgba(37,99,235,0.15); }`,
    /* pending/not ready = grey */
    `.step-circle.pending { background: #f1f5f9; color: #94a3b8; border-color: #e2e8f0; }`,
    /* canceled = red */
    `.step-circle.canceled { background: #fee2e2; color: #dc2626; border-color: #fecaca; }`,
    `.step-circle mat-icon { font-size: 20px; width: 20px; height: 20px; }`,

    `.step-connector { width: 2px; flex: 1; min-height: 32px; background: #e2e8f0; margin: 4px 0; }`,
    `.step-connector.done { background: #bbf7d0; }`,

    `.timeline-row__content { padding: 0.35rem 0 1.75rem; flex: 1; }`,
    `.step-title { font-size: 15px; display: block; margin-bottom: 0.25rem; color: #1e293b; }`,
    `.timeline-row__content.done .step-title { color: #166534; }`,
    `.timeline-row__content.active .step-title { color: #2563eb; }`,
    `.timeline-row__content.pending .step-title { color: #94a3b8; }`,
    `.timeline-row__content.canceled .step-title { color: #dc2626; }`,
    `.step-subtitle { font-size: 13px; color: #64748b; margin: 0; }`,
    `.timeline-row__content.pending .step-subtitle { color: #94a3b8; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  protected readonly displayedColumns = ['numero', 'clientNom', 'date_commande', 'total_ttc', 'est_valider', 'est_solder', 'statusLibelle', 'actions'];

  protected readonly allOrders = signal<Commande[]>(orders);
  protected searchTerm = signal('');
  protected validationFilter = signal<boolean | ''>('');
  protected paymentFilter = signal<boolean | ''>('');
  protected statusFilter = signal('');

  protected readonly filteredOrders = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const validation = this.validationFilter();
    const payment = this.paymentFilter();
    const status = this.statusFilter();

    return this.allOrders().filter(order => {
      const clientNom = order.clientNom ?? '';
      if (search && !order.numero.toLowerCase().includes(search) && !clientNom.toLowerCase().includes(search)) {
        return false;
      }
      if (validation !== '' && order.est_valider !== validation) {
        return false;
      }
      if (payment !== '' && order.est_solder !== payment) {
        return false;
      }
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

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  @ViewChild('timelineTpl') private readonly timelineTpl!: TemplateRef<unknown>;
  private dialogRef: ReturnType<MatDialog['open']> | null = null;

  protected goToProducts(): void {
    this.router.navigate(['/products']);
  }

  protected selectedOrder = signal<Commande | null>(null);

  protected selectOrder(order: Commande): void {
    this.selectedOrder.set(order);
  }

  protected openTimeline(order: Commande): void {
    this.selectedOrder.set(order);
    this.dialogRef = this.dialog.open(this.timelineTpl, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'timeline-panel',
      autoFocus: false
    });
    this.dialogRef.afterClosed().subscribe(() => this.selectedOrder.set(null));
  }

  protected closeTimeline(): void {
    this.dialogRef?.close();
  }

  protected readonly timelineSteps = computed<TimelineStep[]>(() => {
    const order = this.selectedOrder();
    if (!order) return [];

    const isCanceled = order.statusLibelle === 'Annulée';

    // Raw completion state for each stage, in order.
    const raw = [
      { title: 'Commande reçue', subtitle: order.numero, done: true },
      { title: 'Commande validée', subtitle: order.est_valider ? 'Validée' : 'En attente de validation', done: order.est_valider },
      {
        title: 'Préparation',
        done: order.est_valider && (order.statusLibelle === 'En cours' || order.statusLibelle === 'Confirmée' || order.statusLibelle === 'Expédiée'),
        subtitle: ''
      },
      { title: 'Expédiée', done: order.est_valider && order.statusLibelle === 'Expédiée', subtitle: '' },
      { title: 'Paiement', done: order.est_valider && order.est_solder, subtitle: order.est_solder ? 'Soldée' : 'Solde dû: ' + order.solde_du }
    ];

    // Fill in subtitles that depend on done state, once computed.
    raw[2].subtitle = raw[2].done ? 'Articles préparés' : 'En attente';
    raw[3].subtitle = raw[3].done ? 'Expédiée au client' : '';

    // Find the first not-done step: that's the "active" one (in process).
    // Everything before it is "done", everything after is "pending".
    const firstNotDoneIndex = raw.findIndex(s => !s.done);

    return raw.map((s, i) => {
      let status: StepStatus;
      if (isCanceled && i >= (firstNotDoneIndex === -1 ? raw.length : firstNotDoneIndex)) {
        status = 'canceled';
      } else if (s.done) {
        status = 'done';
      } else if (i === firstNotDoneIndex) {
        status = 'active';
      } else {
        status = 'pending';
      }
      return { index: i + 1, title: s.title, subtitle: s.subtitle, status };
    });
  });
}