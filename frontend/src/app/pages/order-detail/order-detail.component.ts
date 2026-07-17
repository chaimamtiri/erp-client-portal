import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-detail',
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Commandes', 'Détail']" />
    @if (order) {
      <mat-card class="detail-card">
      <div class="detail-card__header">
        <div>
          <h2>Commande {{ order.numero }}</h2>
          <p>{{ order.statusLibelle }} • {{ formatDate(order.date_commande) }}</p>
        </div>
        <span class="pill">{{ order.statusLibelle }}</span>
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
        @for (item of order.items; track item.id) {
          <div class="items-list__row">
            <span>{{ item.nom }} (x{{ item.quantity }})</span>
            <span>€{{ (item.prix_vente_ht || 0) * item.quantity }}</span>
          </div>
        }
        <div class="items-list__row"><span>Sous-total</span><span>€{{ order.total_ht }}</span></div>
        <div class="items-list__row"><span>TVA</span><span>€{{ order.total_tva }}</span></div>
        <div class="items-list__row total"><span>Total</span><span>€{{ order.total_ttc }}</span></div>
      </div>
    </mat-card>
    } @else {
      <mat-card class="detail-card">
        <p>Commande non trouvée</p>
      </mat-card>
    }
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
export class OrderDetailComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      const orders = this.cartService.getOrders();
      this.order = orders.find(o => o.id === Number(orderId));
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
