import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { payments } from '../../models/mock-data';

@Component({
  selector: 'app-payments',
  imports: [MatCardModule, MatTableModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Paiements']" />
    <mat-card class="payments-card">
      <h2>Paiements</h2>
      <table mat-table [dataSource]="dataSource" class="payments-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>
        <ng-container matColumnDef="method">
          <th mat-header-cell *matHeaderCellDef>Moyen</th>
          <td mat-cell *matCellDef="let element">{{ element.method }}</td>
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
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.payments-card { border-radius: 20px; padding: 1rem; }`,
    `.payments-table { width: 100%; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {
  protected readonly displayedColumns = ['id', 'method', 'amount', 'date', 'status'];
  protected readonly dataSource = payments;
}

