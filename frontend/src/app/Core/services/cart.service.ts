import { Injectable, signal } from '@angular/core';
import { Article } from '../models/mock-data';

export interface CartItem extends Article {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private orders = signal<any[]>([]);

  readonly cartItems$ = this.cartItems.asReadonly();
  readonly orders$ = this.orders.asReadonly();

  addToCart(product: Article): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getSubtotal(): number {
    return this.cartItems().reduce(
      (sum, item) => sum + (item.prix_vente_ht || 0) * item.quantity,
      0
    );
  }

  getTVA(): number {
    return this.cartItems().reduce(
      (sum, item) => {
        const ht = (item.prix_vente_ht || 0) * item.quantity;
        const ttc = (item.prix_vente_ttc || 0) * item.quantity;
        return sum + (ttc - ht);
      },
      0
    );
  }

  getShippingCost(): number {
    return this.cartItems().length > 0 ? 24 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTVA() + this.getShippingCost();
  }

  getCartCount(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  placeOrder(): any {
    const order = {
      id: this.orders().length + 1,
      numero: `ORD-${1024 + this.orders().length}`,
      date_commande: new Date(),
      total_ht: this.getSubtotal(),
      total_tva: this.getTVA(),
      total_ttc: this.getTotal(),
      est_valider: false,
      est_solder: false,
      montant_regle: 0,
      solde_du: this.getTotal(),
      est_supprime: false,
      client_id: 1,
      statusLibelle: 'Confirmée',
      items: [...this.cartItems()]
    };

    this.orders.update(orders => [...orders, order]);
    this.clearCart();

    return order;
  }

  getOrders(): any[] {
    return this.orders();
  }
}
