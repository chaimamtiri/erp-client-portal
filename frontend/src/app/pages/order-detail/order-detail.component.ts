import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-order-detail',
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Commandes', 'Détail']" />
    <mat-card class="detail-card">
      <div class="detail-card__header">
        <div>
          <h2>Commande ORD-1024</h2>
          <p>Expédiée • 05 Juillet 2026</p>
        </div>
        <span class="pill">Expédiée</span>
      </div>
      <div class="detail-grid">
        <div>
          <h3>Informations client</h3>
          <p>Claire Martin</p>
          <p>claire@acme.com</p>
        </div>
        <div>
          <h3>Adresse</h3>
          <p>12 Rue de l’Innovation</p>
          <p>69002 Lyon</p>
        </div>
      </div>
      <div class="items-list">
        <div class="items-list__row"><span>ERP Pro Suite</span><span>€980</span></div>
        <div class="items-list__row"><span>Terminal Mobile</span><span>€640</span></div>
        <div class="items-list__row total"><span>Total</span><span>€1,620</span></div>
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.detail-card { padding: 1rem; border-radius: 20px; }`,
    `.detail-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }`,
    `.pill { padding: 0.45rem 0.75rem; border-radius: 999px; background: #dcfce7; color: #15803d; font-weight: 600; }`,
    `.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1rem; }`,
    `.items-list__row { display: flex; justify-content: space-between; padding: 0.55rem 0; border-bottom: 1px solid #e2e8f0; }`,
    `.items-list__row.total { font-weight: 700; }`,
    `@media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent {}

