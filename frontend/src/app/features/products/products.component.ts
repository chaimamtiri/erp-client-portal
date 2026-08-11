// Composant de la liste des produits - Finalisation Task #14
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { products } from '../../core/models/mock-data';
import { CartService } from '../../core/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  imports: [MatCardModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  protected productList = products;
  private readonly allProducts = products;
  protected sortField: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';
  private currentSearchTerm: string = '';
  private currentCategory: string = '';

  private cartService: CartService = inject(CartService);
  private router: Router = inject(Router);

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    this.currentSearchTerm = searchTerm;
    this.applyFilters();
  }

  onFilterCategory(category: string) {
    this.currentCategory = category;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.allProducts];

    // Apply search filter
    if (this.currentSearchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(this.currentSearchTerm) ||
        product.category?.toLowerCase().includes(this.currentSearchTerm) ||
        product.nom?.toLowerCase().includes(this.currentSearchTerm)
      );
    }

    // Apply category filter
    if (this.currentCategory) {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === this.currentCategory.toLowerCase()
      );
    }

    this.productList = filtered;
    this.applySort();
  }

  sortByPrice() {
    this.sortField = 'price';
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applySort();
  }

  sortByName() {
    this.sortField = 'name';
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applySort();
  }

  sortByRating() {
    this.sortField = 'rating';
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applySort();
  }

  private applySort() {
    if (!this.sortField) return;

    const sorted = [...this.productList];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (this.sortField) {
        case 'price':
          comparison = (a.prix_vente_ht || 0) - (b.prix_vente_ht || 0);
          break;
        case 'name':
          comparison = (a.nom || '').localeCompare(b.nom || '');
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    this.productList = sorted;
  }

  resetFilters() {
    this.currentSearchTerm = '';
    this.currentCategory = '';
    this.sortField = '';
    this.sortDirection = 'asc';
    this.productList = [...this.allProducts];
  }

  viewProductDetails(product: any): void {
    // Navigate to product details page (to be implemented)
    console.log('View product details:', product);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}

