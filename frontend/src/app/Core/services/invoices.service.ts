import { Injectable, signal, computed } from '@angular/core';
import { invoices, Facture } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private invoicesData = signal(invoices);

  readonly invoices$ = this.invoicesData.asReadonly();
  readonly invoices = computed(() => this.invoicesData());

  getInvoices() {
    return this.invoicesData();
  }

  getInvoiceById(id: number): Facture | undefined {
    return this.invoicesData().find(inv => inv.id === id);
  }

  getInvoicesByCustomer(customerId: number): Facture[] {
    return this.invoicesData().filter(inv => inv.client_id === customerId);
  }
}
