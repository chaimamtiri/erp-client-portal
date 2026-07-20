// Composant de la liste des produits - Finalisation Task #14
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { products } from '../../models/mock-data';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  imports: [MatCardModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Catalogue']" />

    <div class="catalog-header">
      <div class="catalog-header__info">
        <h2>Catalogue produits</h2>
        <p>Recherchez, filtrez et ajoutez des produits à votre panier.</p>
      </div>
      <div class="catalog-header__actions">
        <mat-form-field appearance="outline" class="search-bar">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput (input)="onSearch($event)" placeholder="Rechercher un produit..." />
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-bar">
          <mat-select (selectionChange)="onFilterCategory($event.value)" placeholder="Catégorie">
            <mat-option value="">Toutes les catégories</mat-option>
            <mat-option value="Logiciels">Logiciels</mat-option>
            <mat-option value="Matériel">Matériel</mat-option>
            <mat-option value="Services">Services</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <div class="filters-row">
      <button mat-stroked-button (click)="sortByPrice()" [color]="sortField === 'price' ? 'primary' : ''">
        <mat-icon>sort</mat-icon> Prix
      </button>
      <button mat-stroked-button (click)="sortByName()" [color]="sortField === 'name' ? 'primary' : ''">
        <mat-icon>sort_by_alpha</mat-icon> Nom
      </button>
      <button mat-stroked-button (click)="sortByRating()" [color]="sortField === 'rating' ? 'primary' : ''">
        <mat-icon>star</mat-icon> Note
      </button>
      <button mat-stroked-button (click)="resetFilters()">
        <mat-icon>refresh</mat-icon> Réinitialiser
      </button>
    </div>

    @if (productList.length === 0) {
      <div class="empty-state">
        <mat-icon class="empty-state__icon">search_off</mat-icon>
        <h3>Aucun produit trouvé</h3>
        <p>Essayez de modifier vos critères de recherche ou de filtre.</p>
      </div>
    } @else {
      <div class="products-grid">
        @for (product of productList; track product.id) {
          <mat-card class="product-card" (click)="viewProductDetails(product)">
            <div class="product-card__emoji">{{ product.image }}</div>
            <div class="product-card__category">{{ product.category }}</div>
            <div class="product-card__name">{{ product.nom }}</div>
            <div class="product-card__description">{{ product.description }}</div>
            <div class="product-card__meta">
              <span class="product-card__stock" [class.low-stock]="product.stock_disponible < 10">
                {{ product.stock_disponible }} en stock
              </span>
              <span class="product-card__rating">★ {{ product.rating }}</span>
            </div>
            <div class="product-card__footer">
              <div class="product-card__price">€{{ product.prix_vente_ht?.toFixed(2) }}</div>
              <button mat-flat-button color="primary" (click)="addToCart(product); $event.stopPropagation()">
                <mat-icon>add_shopping_cart</mat-icon>
                Ajouter
              </button>
            </div>
          </mat-card>
        }
      </div>
    }
  `,
  styles: [
    `:host { display: block; }`,
    `.catalog-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }`,
    `.catalog-header__info { flex: 1; min-width: 250px; }`,
    `.catalog-header__info h2 { margin: 0 0 0.5rem 0; }`,
    `.catalog-header__info p { color: #64748b; margin: 0; }`,
    `.catalog-header__actions { display: flex; gap: 1rem; flex-wrap: wrap; }`,
    `.search-bar { min-width: 250px; }`,
    `.filter-bar { min-width: 200px; }`,
    `.filters-row { display: flex; gap: 0.6rem; margin-bottom: 1.5rem; flex-wrap: wrap; }`,
    `.filters-row button { display: flex; align-items: center; gap: 0.5rem; }`,
    `.empty-state { text-align: center; padding: 4rem 2rem; }`,
    `.empty-state__icon { font-size: 4rem; color: #94a3b8; margin-bottom: 1rem; }`,
    `.empty-state h3 { margin: 0 0 0.5rem 0; color: #475569; }`,
    `.empty-state p { color: #64748b; margin: 0; }`,
    `.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }`,
    `.product-card { padding: 1.25rem; border-radius: 16px; display: flex; flex-direction: column; gap: 0.75rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }`,
    `.product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }`,
    `.product-card__emoji { font-size: 2.5rem; text-align: center; margin-bottom: 0.25rem; }`,
    `.product-card__category { color: #2563eb; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.5px; }`,
    `.product-card__name { font-size: 1.125rem; font-weight: 700; color: #1e293b; line-height: 1.4; }`,
    `.product-card__description { color: #64748b; font-size: 0.875rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }`,
    `.product-card__meta { display: flex; justify-content: space-between; align-items: center; color: #64748b; font-size: 0.875rem; }`,
    `.product-card__stock.low-stock { color: #dc2626; font-weight: 600; }`,
    `.product-card__rating { color: #f59e0b; font-weight: 600; }`,
    `.product-card__footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid #e2e8f0; }`,
    `.product-card__price { font-size: 1.25rem; font-weight: 700; color: #1e293b; }`,
    `.product-card__footer button { display: flex; align-items: center; gap: 0.5rem; }`,
    `@media (max-width: 768px) { .catalog-header { flex-direction: column; } .catalog-header__actions { width: 100%; } .search-bar, .filter-bar { flex: 1; } .products-grid { grid-template-columns: 1fr; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  protected productList = products;
  private readonly allProducts = products;
  protected sortField: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';
  private currentSearchTerm: string = '';
  private currentCategory: string = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

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

