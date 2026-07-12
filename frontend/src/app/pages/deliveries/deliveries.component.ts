import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { deliveries } from '../../models/mock-data';

@Component({
  selector: 'app-deliveries',
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Livraisons']" />
    <mat-card class="deliveries-card">
      <h2>Bons de livraison</h2>
      <table mat-table [dataSource]="dataSource" class="deliveries-table">
        <ng-container matColumnDef="numero">
          <th mat-header-cell *matHeaderCellDef>N° BL</th>
          <td mat-cell *matCellDef="let element">{{ element.numero }}</td>
        </ng-container>
        <ng-container matColumnDef="order">
          <th mat-header-cell *matHeaderCellDef>Commande</th>
          <td mat-cell *matCellDef="let element">{{ element.order }}</td>
        </ng-container>
        <ng-container matColumnDef="date_livraison">
          <th mat-header-cell *matHeaderCellDef>Date livraison</th>
          <td mat-cell *matCellDef="let element">{{ element.date_livraison | date: 'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="transporteur">
          <th mat-header-cell *matHeaderCellDef>Transporteur</th>
          <td mat-cell *matCellDef="let element">{{ element.transporteur }}</td>
        </ng-container>
        <ng-container matColumnDef="numero_suivi">
          <th mat-header-cell *matHeaderCellDef>N° Suivi</th>
          <td mat-cell *matCellDef="let element">{{ element.numero_suivi }}</td>
        </ng-container>
        <ng-container matColumnDef="adresse_livraison">
          <th mat-header-cell *matHeaderCellDef>Adresse</th>
          <td mat-cell *matCellDef="let element">{{ element.adresse_livraison }}</td>
        </ng-container>
        <ng-container matColumnDef="est_valider">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.delivered]="element.est_valider">
              {{ element.est_valider ? 'Validé' : 'En préparation' }}
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
    `.deliveries-card { border-radius: 20px; padding: 1rem; }`,
    `.deliveries-table { width: 100%; }`,
    `mat-chip { font-size: 0.8rem; }`,
    `mat-chip.delivered { background: #dcfce7; color: #15803d; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveriesComponent {
  protected readonly displayedColumns = ['numero', 'order', 'date_livraison', 'transporteur', 'numero_suivi', 'adresse_livraison', 'est_valider'];
  protected readonly dataSource = deliveries;
}
