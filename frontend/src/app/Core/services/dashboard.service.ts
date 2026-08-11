import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { ProfileService, UserProfile } from './profile.service';

export interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: string;
  tone: 'accent' | 'success' | 'warning' | 'neutral';
}

export interface Order {
  id: number;
  numero: string;
  clientNom: string;
  date_commande: Date;
  statusLibelle: string;
  totalTTC: number;
}

export interface Invoice {
  id: number;
  numero: string;
  date_facture: Date;
  total_ttc: number;
  est_solder: boolean;
}

export interface Delivery {
  id: number;
  numero: string;
  date_livraison: Date;
  status?: string;
}

export interface ClientInfo {
  id: number;
  nom: string;
  email: string;
  company?: string;
  solde: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly profileService = inject(ProfileService);

  readonly stats = signal<StatItem[]>([]);
  readonly latestOrders = signal<Order[]>([]);
  readonly latestInvoices = signal<Invoice[]>([]);
  readonly latestDeliveries = signal<Delivery[]>([]);
  readonly client = signal<ClientInfo | null>(null);

  loadDashboardData(): void {
    this.profileService.loadCurrentUser().pipe(
      switchMap((profile: UserProfile) => {
        if (!profile.clientId) {
          return of(null);
        }
        return this.http.get<any>(this.apiConfig.getApiUrl(`/dashboard/${profile.clientId}`)).pipe(
          tap((data: any) => {
            this.stats.set(data?.stats ?? []);
            this.latestOrders.set(data?.latestOrders ?? []);
            this.latestInvoices.set(data?.latestInvoices ?? []);
            this.latestDeliveries.set(data?.latestDeliveries ?? []);
            this.client.set(data?.client ?? null);
          })
        );
      })
    ).subscribe();
  }

  loadDashboard(): Observable<any> {
    return this.profileService.loadCurrentUser().pipe(
      switchMap((profile: UserProfile) => {
        if (!profile.clientId) {
          return of(null);
        }
        return this.http.get<any>(this.apiConfig.getApiUrl(`/dashboard/${profile.clientId}`));
      })
    );
  }
}
