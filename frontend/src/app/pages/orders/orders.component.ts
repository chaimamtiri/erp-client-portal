import { ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTableModule, MatChipsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, FormsModule, BreadcrumbComponent],
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
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="order-row" (click)="selectOrder(row)" [class.selected]="selectedOrder()?.numero === row.numero"></tr>
      </table>

      @if (selectedOrder(); as order) {
        <div class="tracking-panel">
          <div class="tracking-card">
            <div class="tracking-card__header">
              <div>
                <p class="tracking-card__eyebrow">Suivi de commande</p>
                <h3>{{ order.numero }}</h3>
              </div>
              <div class="tracking-card__actions">
                <button matButton="filled" class="tracking-card__button" (click)="copyTrackingNumber(order)">
                  <mat-icon>content_copy</mat-icon>
                  <span>{{ copiedTracking() ? 'Copié' : 'Copier' }}</span>
                </button>
                <mat-chip class="tracking-chip">{{ currentStatusLabel() }}</mat-chip>
              </div>
            </div>

            <div class="tracking-card__summary">
              <div class="summary-item">
                <span class="summary-item__label">Client</span>
                <strong>{{ order.clientNom }}</strong>
              </div>
              <div class="summary-item">
                <span class="summary-item__label">Date</span>
                <strong>{{ order.date_commande | date: 'dd/MM/yyyy' }}</strong>
              </div>
              <div class="summary-item">
                <span class="summary-item__label">Montant TTC</span>
                <strong>{{ order.total_ttc | currency: 'EUR': 'symbol': '1.2-2' }}</strong>
              </div>
              <div class="summary-item">
                <span class="summary-item__label">Statut</span>
                <strong>{{ order.statusLibelle }}</strong>
              </div>
            </div>

            <div class="tracking-progress">
              <div class="tracking-progress__meta">
                <span>Progression de la commande</span>
                <strong>{{ trackingProgress() | number: '1.0-0' }}%</strong>
              </div>
              <mat-progress-bar mode="determinate" [value]="trackingProgress()"></mat-progress-bar>
            </div>

            <div class="timeline-progress" role="list" aria-label="Progression de la commande">
              @for (step of trackingSteps(); track step.title; let isLast = $last) {
                <div class="timeline-progress__item">
                  <div class="timeline-progress__marker" [class.completed]="step.status === 'completed'" [class.current]="step.status === 'current'" [class.pending]="step.status === 'pending'">
                    @if (step.status === 'completed') {
                      <mat-icon>check</mat-icon>
                    } @else if (step.status === 'current') {
                      <span class="timeline-progress__pulse"></span>
                    } @else {
                      <span class="timeline-progress__dot"></span>
                    }
                  </div>
                  @if (!isLast) {
                    <div class="timeline-progress__line" [class.active]="step.status !== 'pending'"></div>
                  }
                  <span class="timeline-progress__label">{{ step.shortTitle }}</span>
                </div>
              }
            </div>

            <div class="timeline">
              @for (step of trackingSteps(); track step.title) {
                <div class="timeline-step" [class.completed]="step.status === 'completed'" [class.current]="step.status === 'current'" [class.pending]="step.status === 'pending'">
                  <div class="timeline-step__icon" aria-hidden="true">
                    @if (step.status === 'completed') {
                      <mat-icon>check</mat-icon>
                    } @else if (step.status === 'current') {
                      <mat-icon>{{ step.icon }}</mat-icon>
                    } @else {
                      <mat-icon>{{ step.icon }}</mat-icon>
                    }
                  </div>
                  <div class="timeline-step__content">
                    <div class="timeline-step__header">
                      <h4>{{ step.title }}</h4>
                    </div>
                    <p>{{ step.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

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
    `.order-row { cursor: pointer; transition: background-color 160ms ease; }`,
    `.order-row:hover { background-color: rgba(37, 99, 235, 0.06); }`,
    `.selected { background-color: #f1f5f9; }`,
    `.tracking-panel { margin: 1rem 0 0.5rem; animation: fade-slide-up 350ms ease both; }`,
    `.tracking-card { border-radius: 24px; padding: 1.25rem; background: #ffffff; border: 1px solid rgba(148, 163, 184, 0.22); box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08); }`,
    `.tracking-card__header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1rem; }`,
    `.tracking-card__eyebrow { margin: 0 0 0.25rem; font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase; color: #6366f1; font-weight: 700; }`,
    `.tracking-card__header h3 { margin: 0; font-size: 1.15rem; color: #0f172a; }`,
    `.tracking-card__actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }`,
    `.tracking-card__button { border-radius: 999px; }`,
    `.tracking-chip { background: #dbeafe; color: #1d4ed8; }`,
    `.tracking-card__summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0; }`,
    `.summary-item { background: #f8fafc; border-radius: 16px; padding: 0.8rem 0.9rem; display: flex; flex-direction: column; gap: 0.2rem; }`,
    `.summary-item__label { font-size: 0.74rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; }`,
    `.tracking-progress { margin: 1rem 0 1.25rem; }`,
    `.tracking-progress__meta { display: flex; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem; color: #334155; font-size: 0.92rem; }`,
    `.timeline-progress { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0.5rem; align-items: start; margin: 1rem 0 1.2rem; }`,
    `.timeline-progress__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.45rem; text-align: center; }`,
    `.timeline-progress__marker { width: 2.25rem; height: 2.25rem; border-radius: 999px; display: grid; place-items: center; background: #e2e8f0; color: #64748b; border: 2px solid #e2e8f0; z-index: 1; transition: all 180ms ease; }`,
    `.timeline-progress__marker.completed { background: #dcfce7; color: #15803d; border-color: #86efac; }`,
    `.timeline-progress__marker.current { background: #dbeafe; color: #2563eb; border-color: #93c5fd; box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.2); animation: pulse 1.6s infinite; }`,
    `.timeline-progress__marker.pending { background: #f8fafc; color: #94a3b8; border-color: #cbd5e1; }`,
    `.timeline-progress__line { position: absolute; top: 1.1rem; left: calc(50% + 0.9rem); right: calc(-50% + 0.9rem); height: 2px; background: #e2e8f0; }`,
    `.timeline-progress__line.active { background: linear-gradient(90deg, #86efac 0%, #60a5fa 100%); }`,
    `.timeline-progress__pulse { width: 0.8rem; height: 0.8rem; border-radius: 50%; background: currentColor; display: block; animation: pulse-dot 1.2s ease infinite; }`,
    `.timeline-progress__dot { width: 0.7rem; height: 0.7rem; border-radius: 50%; border: 2px solid currentColor; display: block; }`,
    `.timeline-progress__label { font-size: 0.74rem; font-weight: 700; color: #334155; letter-spacing: 0.02em; }`,
    `.timeline { position: relative; display: flex; flex-direction: column; gap: 0.75rem; }`,
    `.timeline::before { content: ''; position: absolute; left: 1.1rem; top: 0.95rem; bottom: 0.95rem; width: 2px; background: linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 100%); }`,
    `.timeline-step { position: relative; display: flex; align-items: flex-start; gap: 0.9rem; padding: 0.75rem 0.25rem 0.75rem 0; }`,
    `.timeline-step__icon { width: 2.35rem; height: 2.35rem; border-radius: 50%; display: grid; place-items: center; background: #e2e8f0; color: #64748b; flex-shrink: 0; z-index: 1; transition: all 180ms ease; }`,
    `.timeline-step.completed .timeline-step__icon { background: #dcfce7; color: #15803d; }`,
    `.timeline-step.current .timeline-step__icon { background: #dbeafe; color: #2563eb; box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.2); animation: pulse 1.6s infinite; }`,
    `.timeline-step.pending .timeline-step__icon { background: #f1f5f9; color: #64748b; }`,
    `.timeline-step__content { flex: 1; padding: 0.15rem 0 0; }`,
    `.timeline-step__header h4 { margin: 0 0 0.2rem; font-size: 0.98rem; color: #0f172a; }`,
    `.timeline-step__content p { margin: 0; color: #475569; font-size: 0.9rem; }`,
    `@keyframes fade-slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`,
    `@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.25); } 70% { box-shadow: 0 0 0 12px rgba(37, 99, 235, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); } }`,
    `@keyframes pulse-dot { 0%, 100% { transform: scale(0.9); opacity: 0.85; } 50% { transform: scale(1.1); opacity: 1; } }`,
    `@media (max-width: 900px) { .tracking-card__summary { grid-template-columns: 1fr 1fr; } .tracking-card__header { flex-direction: column; align-items: flex-start; } }`,
    `@media (max-width: 640px) { .tracking-card__summary { grid-template-columns: 1fr; } .timeline-progress { grid-template-columns: 1fr; gap: 0.75rem; } .timeline-progress__item { flex-direction: row; justify-content: flex-start; align-items: center; text-align: left; } .timeline-progress__line { display: none; } .timeline::before { left: 1rem; } .timeline-step { padding-left: 0.1rem; } }`,

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
  protected readonly displayedColumns = ['numero', 'clientNom', 'date_commande', 'total_ttc', 'est_valider', 'est_solder', 'statusLibelle'];

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

  protected readonly copiedTracking = signal(false);
  protected readonly trackingSteps = computed(() => {
    const order = this.selectedOrder();
    if (!order) {
      return [];
    }

    const statusLabel = order.statusLibelle ?? '';
    const validated = order.est_valider;
    const prepared = validated && (statusLabel === 'En cours' || statusLabel === 'Confirmée' || statusLabel === 'Expédiée');
    const shipped = statusLabel === 'Expédiée';

    return [
      {
        title: 'Commande reçue',
        shortTitle: 'Order',
        status: 'completed',
        icon: 'shopping_cart',
        description: 'Votre commande a bien été enregistrée.'
      },
      {
        title: 'Commande validée',
        shortTitle: 'Payment',
        status: validated ? 'completed' : 'current',
        icon: 'payments',
        description: validated ? 'La commande a été validée.' : 'Validation en cours.'
      },
      {
        title: 'Préparation',
        shortTitle: 'Shipped',
        status: prepared ? 'completed' : validated ? 'current' : 'pending',
        icon: 'inventory',
        description: prepared ? 'Le colis est en préparation.' : 'Préparation à venir.'
      },
      {
        title: 'Expédiée',
        shortTitle: 'Transit',
        status: shipped ? 'completed' : prepared ? 'current' : 'pending',
        icon: 'local_shipping',
        description: shipped ? 'Le colis a été expédié.' : 'Expédition en attente.'
      },
      {
        title: 'Livraison',
        shortTitle: 'Delivery',
        status: shipped ? 'current' : 'pending',
        icon: 'delivery_dining',
        description: shipped ? 'Le colis est en cours de livraison.' : 'Livraison à venir.'
      },
      {
        title: 'Livré',
        shortTitle: 'Delivered',
        status: 'pending',
        icon: 'home',
        description: 'La livraison sera finalisée prochainement.'
      }
    ];
  });

  protected readonly trackingProgress = computed(() => {
    const steps = this.trackingSteps();
    if (steps.length === 0) {
      return 0;
    }

    const completed = steps.filter((step) => step.status === 'completed').length;
    const currentIndex = steps.findIndex((step) => step.status === 'current');

    if (currentIndex === -1) {
      return (completed / steps.length) * 100;
    }

    return ((completed + 0.5) / steps.length) * 100;
  });

  protected readonly currentStatusLabel = computed(() => {
    const order = this.selectedOrder();
    if (!order) {
      return 'En attente';
    }

    return order.statusLibelle ?? 'En attente';
  });

  protected selectOrder(order: Commande): void {
    this.selectedOrder.set(order);
    this.copiedTracking.set(false);
  }

  protected async copyTrackingNumber(order: Commande): Promise<void> {
    try {
      await navigator.clipboard.writeText(order.numero);
      this.copiedTracking.set(true);
      window.setTimeout(() => this.copiedTracking.set(false), 1400);
    } catch {
      this.copiedTracking.set(true);
      window.setTimeout(() => this.copiedTracking.set(false), 1400);
    }
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