import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { payments } from '../../models/mock-data';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Paiements']" />
    <mat-card class="payments-card">
      <h2>Paiements</h2>
      <table mat-table [dataSource]="dataSource" class="payments-table">
        <ng-container matColumnDef="numero">
          <th mat-header-cell *matHeaderCellDef>N° Règlement</th>
          <td mat-cell *matCellDef="let element">{{ element.numero }}</td>
        </ng-container>
        <ng-container matColumnDef="reference">
          <th mat-header-cell *matHeaderCellDef>Moyen</th>
          <td mat-cell *matCellDef="let element">{{ element.reference }}</td>
        </ng-container>
        <ng-container matColumnDef="montant_regle">
          <th mat-header-cell *matHeaderCellDef>Montant</th>
          <td mat-cell *matCellDef="let element">{{ element.montant_regle | currency: 'EUR':'symbol':'1.2-2' }}</td>
        </ng-container>
        <ng-container matColumnDef="date_paiement">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let element">{{ element.date_paiement | date: 'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="est_encaisser">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let element">
            <mat-chip [class.encaisse]="element.est_encaisser">
              {{ element.est_encaisser ? 'Encaissé' : 'En cours' }}
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
    `.payments-card { border-radius: 20px; padding: 1rem; }`,
    `.payments-table { width: 100%; }`,
    `mat-chip { font-size: 0.8rem; }`,
    `mat-chip.encaisse { background: #dcfce7; color: #15803d; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {
  protected readonly displayedColumns = ['numero', 'reference', 'montant_regle', 'date_paiement', 'est_encaisser'];
  protected readonly dataSource = payments;
}
