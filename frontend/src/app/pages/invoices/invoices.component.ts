import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { invoices } from '../../models/mock-data';

@Component({
  selector: 'app-invoices',
  imports: [MatCardModule, MatIconModule, MatTableModule, BreadcrumbComponent],
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
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Facture</th>
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
        <ng-container matColumnDef="issued">
          <th mat-header-cell *matHeaderCellDef>Émise</th>
          <td mat-cell *matCellDef="let element">{{ element.issued }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">{{ element.status }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.invoices-card { border-radius: 20px; padding: 1rem; }`,
    `.invoices-table { width: 100%; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
  protected readonly displayedColumns = ['id', 'customer', 'amount', 'issued', 'status'];
  protected readonly dataSource = invoices;
}

