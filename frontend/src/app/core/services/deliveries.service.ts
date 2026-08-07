import { Injectable, signal, computed } from '@angular/core';
import { deliveries, BonLivraison } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {
  private deliveriesData = signal(deliveries);

  readonly deliveries$ = this.deliveriesData.asReadonly();
  readonly deliveries = computed(() => this.deliveriesData());

  getDeliveries() {
    return this.deliveriesData();
  }

  getDeliveryById(id: number): BonLivraison | undefined {
    return this.deliveriesData().find(del => del.id === id);
  }

  getDeliveriesByTier(tierId: number): BonLivraison[] {
    return this.deliveriesData().filter(del => del.tier_id === tierId);
  }

  getPendingDeliveries(): BonLivraison[] {
    return this.deliveriesData().filter(del => !del.est_valider);
  }
}
