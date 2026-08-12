import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderListItem {
  id: number;
  numero: string;
  date_commande: string | null;
  total_ht: number;
  total_ttc: number;
  est_valider: boolean;
  est_solder: boolean;
  solde_du: number;
}

export interface OrderArticle {
  id: number;
  nom_article: string;
  reference: string;
  quantite: number;
  prix_ht: number;
  prix_ttc: number;
  total_prix_ht: number;
  total_prix_ttc: number;
  taux_tva: number;
  taux_remise: number;
}

export interface OrderDetail {
  id: number;
  numero: string;
  date_commande: string | null;
  date_piece: string | null;
  date_echeance: string | null;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  est_valider: boolean;
  est_solder: boolean;
  solde_du: number;
  client_id: number;
  articles: OrderArticle[];
}

export interface OrderTrackingEvent {
  id: number;
  ancien_status_id: number | null;
  nouveau_status_id: number | null;
  commentaire: string | null;
  date_changement: string | null;
}

export interface OrderListResponse {
  items: OrderListItem[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

export interface OrderListFilters {
  page?: number;
  per_page?: number;
  numero?: string;
  date_debut?: string;
  date_fin?: string;
  est_valider?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  // commande_bp requires client_id and returns a paginated envelope
  // ({items, total, pages, ...}), not a bare array — so this can't
  // extend CrudBaseService the way most other entities do.
  listOrders(clientId: number, filters: OrderListFilters = {}): Observable<OrderListResponse> {
    let params = new URLSearchParams({ client_id: String(clientId) });

    if (filters.page) params.set('page', String(filters.page));
    if (filters.per_page) params.set('per_page', String(filters.per_page));
    if (filters.numero) params.set('numero', filters.numero);
    if (filters.date_debut) params.set('date_debut', filters.date_debut);
    if (filters.date_fin) params.set('date_fin', filters.date_fin);
    if (filters.est_valider !== undefined) params.set('est_valider', String(filters.est_valider));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_order) params.set('sort_order', filters.sort_order);

    return this.http.get<OrderListResponse>(`${this.baseUrl}?${params.toString()}`);
  }

  getOrderById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.baseUrl}/${id}`);
  }

  // Real status-history data from HistoriqueStatutCommande, exposed via the
  // new GET /<id>/tracking route. No label mapping exists for status IDs yet
  // (no Statut lookup table found in the backend models) — returns raw
  // transitions with timestamps/comments, not named pipeline stages.
  getOrderTracking(id: number): Observable<OrderTrackingEvent[]> {
    return this.http.get<OrderTrackingEvent[]>(`${this.baseUrl}/${id}/tracking`);
  }

  // NOTE: commande_bp is GET-only on the backend right now — there is no
  // POST route to create an order. Placing an order therefore CANNOT be
  // made real yet. cart.service.ts's placeOrder() stays local-only/mock
  // until a POST /api/v1/orders (or similar) route is added server-side.
  // This method is intentionally not implemented — do not fake a POST call
  // against an endpoint that doesn't exist.
}
