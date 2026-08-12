import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Ticket {
  id: number;
  numero: string;
  client_id: number;
  utilisateur_id: number;
  sujet: string;
  description: string;
  categorie: string;
  priorite: string;
  status: string;
  title: string;
  category: string;
  priority: string;
  updated: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tickets`;

  // Backend supports GET and POST only — no PUT/DELETE routes yet.
  getAll(clientId?: number): Observable<Ticket[]> {
    const url = clientId ? `${this.baseUrl}?client_id=${clientId}` : this.baseUrl;
    return this.http.get<Ticket[]>(url);
  }

  create(payload: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, payload);
  }
}
