import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { products } from '../../models/mock-data';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Catalogue']" />

    <div class="catalog-toolbar">
      <div>
        <h2>Catalogue produits</h2>
        <p>Recherchez, filtrez et ajoutez des produits à votre panier.</p>
      </div>
      <mat-form-field appearance="outline" class="catalog-toolbar__search">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Rechercher un produit" />
      </mat-form-field>
    </div>

    <div class="filters-row">
      <button mat-stroked-button><mat-icon>filter_list</mat-icon> Filtres</button>
      <button mat-stroked-button><mat-icon>category</mat-icon> Catégories</button>
      <button mat-stroked-button><mat-icon>sort</mat-icon> Triage</button>
    </div>

    <div class="products-grid">
      @for (product of productList; track product.id) {
        <mat-card class="product-card">
          <div class="product-card__emoji">{{ product.image }}</div>
          <div class="product-card__category">{{ product.category }}</div>
          <div class="product-card__name">{{ product.nom }}</div>
          <div class="product-card__meta">
            <span>{{ product.stock_disponible }} en stock</span>
            <span>★ {{ product.rating }}</span>
          </div>
          <div class="product-card__footer">
            <div class="product-card__price">€{{ product.prix_vente_ht }}</div>
            <button mat-flat-button color="primary" (click)="addToCart(product)">Ajouter au panier</button>
          </div>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `.catalog-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }`,
    `.catalog-toolbar h2 { margin: 0; }`,
    `.catalog-toolbar p { color: #64748b; margin-top: 0.2rem; }`,
    `.catalog-toolbar__search { min-width: 280px; }`,
    `.filters-row { display: flex; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }`,
    `.products-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }`,
    `.product-card { padding: 1rem; border-radius: 20px; display: flex; flex-direction: column; gap: 0.75rem; }`,
    `.product-card__emoji { font-size: 2rem; }`,
    `.product-card__category { color: #2563eb; font-weight: 600; }`,
    `.product-card__name { font-size: 1.1rem; font-weight: 700; }`,
    `.product-card__meta { display: flex; justify-content: space-between; color: #64748b; }`,
    `.product-card__footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }`,
    `.product-card__price { font-size: 1.1rem; font-weight: 700; }`,
    `@media (max-width: 768px) { .products-grid { grid-template-columns: 1fr; } .catalog-toolbar { flex-direction: column; align-items: stretch; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  protected readonly productList = products;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}

