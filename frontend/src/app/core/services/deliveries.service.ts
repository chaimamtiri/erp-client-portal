import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BonLivraison } from './api-config.service';

export interface DeliveryLine {
  id: number;
  article_id: number;
  nom_article: string;
  code_article: string;
  quantite: number;
  quantite_transferer: number;
  prix_ht: number;
  prix_ttc: number;
  total_prix_ht: number;
  total_prix_ttc: number;
}

export interface DeliveryDetail {
  id: number;
  numero: string;
  date_livraison: string | null;
  date_piece: string | null;
  date_echeance: string | null;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  est_valider: boolean;
  tier_id: number | null;
  adresse_livraison: string;
  code_postal_livraison: string;
  societe_livraison: string;
  transporteur: string;
  numero_suivi: string;
  lignes: DeliveryLine[];
}

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/deliveries`;

  private readonly deliveriesData = signal<BonLivraison[]>([]);
  private readonly _loadError = signal(false);

  readonly deliveries$ = this.deliveriesData.asReadonly();
  readonly deliveries = computed(() => this.deliveriesData());
  readonly hasError = this._loadError.asReadonly();

  // Backend query param is client_id for consistency with every other entity,
  // even though the underlying BonLivraison column is tier_id (handled server-side).
  loadDeliveries(clientId?: number): Observable<BonLivraison[]> {
    this._loadError.set(false);
    const url = clientId ? `${this.baseUrl}?client_id=${clientId}` : this.baseUrl;
    return this.http.get<BonLivraison[]>(url).pipe(
      tap(list => this.deliveriesData.set(list)),
      catchError(() => {
        this._loadError.set(true);
        this.deliveriesData.set([]);
        return of([]);
      })
    );
  }

  getDeliveries(): BonLivraison[] {
    return this.deliveriesData();
  }

  // Sync read from the already-loaded signal — returns undefined on cache miss
  // (e.g. deep link before loadDeliveries() has run). Use fetchDeliveryById()
  // for a guaranteed real lookup including line items.
  getDeliveryById(id: number): BonLivraison | undefined {
    return this.deliveriesData().find(del => del.id === id);
  }

  // Real backend call for full delivery detail, including line items (lignes) —
  // not available on the list endpoint/signal above.
  fetchDeliveryById(id: number): Observable<DeliveryDetail> {
    return this.http.get<DeliveryDetail>(`${this.baseUrl}/${id}`);
  }

  getDeliveriesByTier(tierId: number): BonLivraison[] {
    return this.deliveriesData().filter(del => (del as any).tier_id === tierId);
  }

  getPendingDeliveries(): BonLivraison[] {
    return this.deliveriesData().filter(del => !del.est_valider);
  }
}
