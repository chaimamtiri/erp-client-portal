import { Injectable, signal, computed } from '@angular/core';
import { payments, Reglement } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private paymentsData = signal(payments);

  readonly payments$ = this.paymentsData.asReadonly();
  readonly payments = computed(() => this.paymentsData());

  getPayments() {
    return this.paymentsData();
  }

  getPaymentById(id: number): Reglement | undefined {
    return this.paymentsData().find(pay => pay.id === id);
  }

  getPaymentsByClient(clientId: number): Reglement[] {
    return this.paymentsData().filter(pay => pay.client_id === clientId);
  }

  getTotalPaid(): number {
    return this.paymentsData().reduce((sum, pay) => sum + (pay.montant_regle || 0), 0);
  }
}
