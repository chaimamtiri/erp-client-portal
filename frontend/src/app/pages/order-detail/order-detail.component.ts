import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { CartService } from '../../core/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly cartService: CartService = inject(CartService);
  private readonly translate: TranslateService = inject(TranslateService);

  order: any;

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      const orders = this.cartService.getOrders();
      this.order = orders.find(o => o.id === Number(orderId));
    }
  }

  formatDate(date: Date): string {
    const currentLang = this.translate.currentLang;
    const lang = typeof currentLang === 'function' ? currentLang() : currentLang;
    const locale = lang === 'ar' ? 'ar' : lang === 'en' ? 'en-US' : 'fr-FR';
    return new Date(date).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}