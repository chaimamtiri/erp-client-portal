import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { CartService } from '../../core/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  private readonly cartService: CartService = inject(CartService);
  private readonly router: Router = inject(Router);

  protected cartItems = this.cartService.cartItems$;
  protected subtotal = computed(() => this.cartService.getSubtotal());
  protected shippingCost = computed(() => this.cartService.getShippingCost());
  protected total = computed(() => this.cartService.getTotal());

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
