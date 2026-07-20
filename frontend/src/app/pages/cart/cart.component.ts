import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, MatButtonModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Panier']" />
    <div class="cart-grid">
      <mat-card class="cart-list">
        <h2>Votre panier</h2>
        @if (cartItems().length === 0) {
          <p class="empty-cart">Votre panier est vide</p>
        } @else {
          @for (item of cartItems(); track item.id) {
            <div class="cart-item">
              <div class="cart-item__icon">{{ item.image }}</div>
              <div>
                <strong>{{ item.nom }}</strong>
                <div class="muted">{{ item.category }}</div>
              </div>
              <div class="cart-item__quantity">
                <button mat-icon-button (click)="updateQuantity(item.id, item.quantity - 1)">
                  <mat-icon>remove</mat-icon>
                </button>
                <span>{{ item.quantity }}</span>
                <button mat-icon-button (click)="updateQuantity(item.id, item.quantity + 1)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <div class="cart-item__price">€{{ (item.prix_vente_ht || 0) * item.quantity }}</div>
              <button mat-icon-button color="warn" (click)="removeFromCart(item.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        }
      </mat-card>
      <mat-card class="summary-card">
        <h3>Résumé</h3>
        <div class="summary-row"><span>Sous-total</span><span>€{{ subtotal() }}</span></div>
        <div class="summary-row"><span>Livraison</span><span>€{{ shippingCost() }}</span></div>
        <div class="summary-row total"><span>Total</span><span>€{{ total() }}</span></div>
        <button mat-flat-button color="primary" [disabled]="cartItems().length === 0" (click)="placeOrder()">Passer la commande</button>
      </mat-card>
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `.cart-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }`,
    `.cart-list, .summary-card { border-radius: 20px; padding: 1rem; }`,
    `.cart-item { display: grid; grid-template-columns: 48px 1fr auto auto auto; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; }`,
    `.cart-item__icon { font-size: 1.5rem; }`,
    `.cart-item__quantity { display: flex; align-items: center; gap: 0.5rem; }`,
    `.muted { color: #64748b; font-size: 0.9rem; }`,
    `.empty-cart { color: #64748b; text-align: center; padding: 2rem; }`,
    `.summary-row { display: flex; justify-content: space-between; padding: 0.45rem 0; color: #475569; }`,
    `.summary-row.total { font-weight: 700; color: #0f172a; }`,
    `@media (max-width: 768px) { .cart-grid { grid-template-columns: 1fr; } .cart-item { grid-template-columns: 48px 1fr auto; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  protected cartItems: any;
  protected subtotal: any;
  protected shippingCost: any;
  protected total: any;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems = this.cartService.cartItems$;
    this.subtotal = computed(() => this.cartService.getSubtotal());
    this.shippingCost = computed(() => this.cartService.getShippingCost());
    this.total = computed(() => this.cartService.getTotal());
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  placeOrder(): void {
    const order = this.cartService.placeOrder();
    this.router.navigate(['/orders/detail'], { queryParams: { orderId: order.id } });
  }
}

