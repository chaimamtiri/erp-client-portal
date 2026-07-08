import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-invoice-detail',
  imports: [MatCardModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Factures', 'Détail']" />
    <mat-card class="invoice-card">
      <h2>Facture INV-2048</h2>
      <p>Émise le 05 juillet 2026</p>
      <div class="invoice-card__body">
        <div>
          <h3>Client</h3>
          <p>Acme SAS</p>
        </div>
        <div>
          <h3>Montant</h3>
          <p>€2,450.00</p>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.invoice-card { padding: 1rem; border-radius: 20px; }`,
    `.invoice-card__body { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent {}

