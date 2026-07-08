import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { deliveries } from '../../models/mock-data';

@Component({
  selector: 'app-deliveries',
  imports: [MatCardModule, MatTableModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Livraisons']" />
    <mat-card class="deliveries-card">
      <h2>Livraisons</h2>
      <table mat-table [dataSource]="dataSource" class="deliveries-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>
        <ng-container matColumnDef="order">
          <th mat-header-cell *matHeaderCellDef>Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.order }}</td>
        </ng-container>
        <ng-container matColumnDef="eta">
          <th mat-header-cell *matHeaderCellDef>ETA</th>
          <td mat-cell *matCellDef="let element">{{ element.eta }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">{{ element.status }}</td>
        </ng-container>
        <ng-container matColumnDef="address">
          <th mat-header-cell *matHeaderCellDef>Adresse</th>
          <td mat-cell *matCellDef="let element">{{ element.address }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.deliveries-card { border-radius: 20px; padding: 1rem; }`,
    `.deliveries-table { width: 100%; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveriesComponent {
  protected readonly displayedColumns = ['id', 'order', 'eta', 'status', 'address'];
  protected readonly dataSource = deliveries;
}

