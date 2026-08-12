import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudBaseService } from './crud-base.service';
import { Facture } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService extends CrudBaseService<Facture> {
  protected override endpoint = 'factures';
  private readonly httpClient = inject(HttpClient);

  private invoicesData = signal<Facture[]>([]);
  private loadingState = signal(false);

  readonly invoices$ = this.invoicesData.asReadonly();
  readonly invoices = computed(() => this.invoicesData());
  readonly isLoading = computed(() => this.loadingState());

  /** Fetches the invoice list from the API, optionally scoped to a client. */
  loadInvoices(clientId?: number): void {
    this.loadingState.set(true);
    const params = clientId ? { client_id: clientId } : undefined;
    this.getAll(params).subscribe({
      next: (data) => {
        this.invoicesData.set(data);
        this.loadingState.set(false);
      },
      error: (err) => {
        console.error('Failed to load invoices', err);
        this.loadingState.set(false);
      }
    });
  }

  getInvoices(): Facture[] {
    return this.invoicesData();
  }

  /** Sync lookup against whatever's already loaded — may be undefined on deep link. */
  getInvoiceById(id: number): Facture | undefined {
    return this.invoicesData().find(inv => inv.id === id);
  }

  /** Real backend fetch for a single invoice — use this on the detail page so deep links/refreshes work. */
  fetchInvoiceById(id: number): Observable<Facture> {
    return this.httpClient.get<Facture>(`${environment.apiUrl}/factures/${id}`);
  }

  getInvoicesByCustomer(customerId: number): Facture[] {
    return this.invoicesData().filter(inv => inv.client_id === customerId);
  }
}
