import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { products } from '../../models/mock-data';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, MatButtonModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Panier']" />
    <div class="cart-grid">
      <mat-card class="cart-list">
        <h2>Votre panier</h2>
        @for (product of cartItems; track product.id) {
          <div class="cart-item">
            <div class="cart-item__icon">{{ product.image }}</div>
            <div>
              <strong>{{ product.nom }}</strong>
              <div class="muted">{{ product.category }}</div>
            </div>
            <div class="cart-item__price">€{{ product.prix_vente_ht }}</div>
          </div>
        }
      </mat-card>
      <mat-card class="summary-card">
        <h3>Résumé</h3>
        <div class="summary-row"><span>Sous-total</span><span>€2,480</span></div>
        <div class="summary-row"><span>Livraison</span><span>€24</span></div>
        <div class="summary-row total"><span>Total</span><span>€2,504</span></div>
        <button mat-flat-button color="primary">Passer la commande</button>
      </mat-card>
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `.cart-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }`,
    `.cart-list, .summary-card { border-radius: 20px; padding: 1rem; }`,
    `.cart-item { display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; }`,
    `.cart-item__icon { font-size: 1.5rem; }`,
    `.muted { color: #64748b; font-size: 0.9rem; }`,
    `.summary-row { display: flex; justify-content: space-between; padding: 0.45rem 0; color: #475569; }`,
    `.summary-row.total { font-weight: 700; color: #0f172a; }`,
    `@media (max-width: 768px) { .cart-grid { grid-template-columns: 1fr; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  protected readonly cartItems = products.slice(0, 2);
}

