import { Injectable, inject, signal } from '@angular/core';
import { CrudBaseService } from './crud-base.service';
import { Article } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends CrudBaseService<Article> {
  protected override endpoint = 'articles';

  private readonly _products = signal<Article[]>([]);
  private readonly _loadError = signal(false);

  readonly products = this._products.asReadonly();
  readonly hasError = this._loadError.asReadonly();

  constructor() {
    super();
    this.loadProducts();
  }

  loadProducts(): void {
    this._loadError.set(false);
    this.getAll().subscribe({
      next: (articles) => this._products.set(articles),
      error: () => {
        this._loadError.set(true);
        this._products.set([]);
      }
    });
  }

  getProductById(id: number): Article | undefined {
    return this._products().find((p: any) => p.id === id);
  }

  // Fallback for deep-links / cache misses — same gap that was flagged
  // in invoices.service.ts's getInvoiceById(). Use this when a product
  // isn't found in the already-loaded signal.
  fetchProductById(id: number) {
    return this.getById(id);
  }
}
