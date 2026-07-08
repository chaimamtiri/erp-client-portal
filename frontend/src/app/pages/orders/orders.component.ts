import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { orders } from '../../models/mock-data';

@Component({
  selector: 'app-orders',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTableModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Commandes']" />
    <mat-card class="orders-card">
      <div class="orders-card__header">
        <div>
          <h2>Commandes</h2>
          <p>Historique des commandes et suivi de livraison.</p>
        </div>
        <button mat-flat-button color="primary">Nouvelle commande</button>
      </div>
      <table mat-table [dataSource]="dataSource" class="orders-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>
        <ng-container matColumnDef="customer">
          <th mat-header-cell *matHeaderCellDef>Client</th>
          <td mat-cell *matCellDef="let element">{{ element.customer }}</td>
        </ng-container>
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Montant</th>
          <td mat-cell *matCellDef="let element">{{ element.amount }}</td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let element">{{ element.date }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">{{ element.status }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="timeline">
        <h3>Timeline de suivi</h3>
        <div class="timeline__item"><span>01</span><div><strong>Commande confirmée</strong><p>05 Jul • Traitement en cours</p></div></div>
        <div class="timeline__item"><span>02</span><div><strong>Préparation</strong><p>05 Jul • Colis prêt pour l’expédition</p></div></div>
        <div class="timeline__item"><span>03</span><div><strong>Expédiée</strong><p>06 Jul • En transit vers le client</p></div></div>
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.orders-card { border-radius: 20px; padding: 1rem; }`,
    `.orders-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; }`,
    `.orders-table { width: 100%; margin-bottom: 1rem; }`,
    `.timeline { padding-top: 0.5rem; }`,
    `.timeline__item { display: flex; gap: 0.8rem; align-items: flex-start; padding: 0.6rem 0; border-bottom: 1px solid #e2e8f0; }`,
    `.timeline__item span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 999px; background: #eff6ff; color: #2563eb; font-weight: 700; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  protected readonly displayedColumns = ['id', 'customer', 'amount', 'date', 'status'];
  protected readonly dataSource = orders;
}

