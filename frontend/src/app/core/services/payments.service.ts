import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Payment {
  id: number;
  numero: string;
  date_paiement: string | null;
  reference: string;
  montant_regle: number;
  est_encaisser: boolean;
  client_id: number;
  method: string;
  amount: number;
  date: string | null;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  private readonly _payments = signal<Payment[]>([]);
  readonly payments = this._payments.asReadonly();

  constructor() {
    this.loadPayments();
  }

  loadPayments(clientId?: number): void {
    const url = clientId ? `${this.baseUrl}?client_id=${clientId}` : this.baseUrl;
    this.http.get<Payment[]>(url).subscribe({
      next: (payments) => this._payments.set(payments),
      error: () => this._payments.set([])
    });
  }
}
