import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { invoices } from '../../models/mock-data';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatChipsModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Factures']" />
    <mat-card class="invoices-card">
      <div class="invoices-card__header">
        <div>
          <h2>Factures</h2>
          <p>Consultez vos factures et leur statut.</p>
        </div>
      </div>
      <table mat-table [dataSource]="dataSource" class="invoices-table">
        <ng-container matColumnDef="numero">
          <th mat-header-cell *matHeaderCellDef>N° Facture</th>
          <td mat-cell *matCellDef="let element">{{ element.numero }}</td>
        </ng-container>
        <ng-container matColumnDef="customer">
          <th mat-header-cell *matHeaderCellDef>Client</th>
          <td mat-cell *matCellDef="let element">{{ element.customer }}</td>
        </ng-container>
        <ng-container matColumnDef="total_ttc">
          <th mat-header-cell *matHeaderCellDef>Montant TTC</th>
          <td mat-cell *matCellDef="let element">{{ element.total_ttc | currency: 'EUR':'symbol':'1.2-2' }}</td>
        </ng-container>
        <ng-container matColumnDef="date_facture">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let element">{{ element.date_facture | date: 'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="est_solder">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.paid]="element.est_solder">
              {{ element.est_solder ? 'Payée' : (element.solde_du > 0 ? 'Solde dû: ' + element.solde_du + '€' : 'En attente') }}
            </mat-chip>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.invoices-card { border-radius: 20px; padding: 1rem; }`,
    `.invoices-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }`,
    `.invoices-table { width: 100%; }`,
    `mat-chip { font-size: 0.8rem; }`,
    `mat-chip.paid { background: #dcfce7; color: #15803d; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
  protected readonly displayedColumns = ['numero', 'customer', 'total_ttc', 'date_facture', 'est_solder'];
  protected readonly dataSource = invoices;
}
