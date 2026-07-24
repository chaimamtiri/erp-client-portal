import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CartService } from '../../Core/services/cart.service';

@Component({
  selector: 'app-order-detail',
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly cartService: CartService = inject(CartService);

  order: any;

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
