import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Ticket } from './api-config.service';
import { environment } from '../../../environments/environment';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfileService);
  private readonly baseUrl = `${environment.apiUrl}/tickets`;

  private readonly ticketsData = signal<Ticket[]>([]);
  readonly tickets = computed(() => this.ticketsData());

  loadTickets(clientId?: number): Observable<Ticket[]> {
    const url = clientId ? `${this.baseUrl}?client_id=${clientId}` : this.baseUrl;
    return this.http.get<Ticket[]>(url).pipe(
      tap(list => this.ticketsData.set(list)),
      catchError(() => {
        this.ticketsData.set([]);
        return of([]);
      })
    );
  }

  getTicketById(id: number): Ticket | undefined {
    return this.ticketsData().find(ticket => ticket.id === id);
  }

  getTicketsByStatus(status: string): Ticket[] {
    return this.ticketsData().filter(ticket => ticket.status === status);
  }

  getTicketsByPriority(priority: string): Ticket[] {
    return this.ticketsData().filter(ticket => ticket.priority === priority);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      ouvert: 'Ouvert',
      en_cours: 'En cours',
      resolu: 'Résolu',
      ferme: 'Fermé'
    };
    return map[status] ?? status;
  }

  // Backend requires client_id and utilisateur_id — pulled from the
  // logged-in profile rather than trusting the caller to supply them.
  addTicket(ticket: Pick<Ticket, 'sujet' | 'description' | 'categorie' | 'priorite'>): Observable<Ticket> {
    const profile = this.profileService.profile();
    const payload = {
      ...ticket,
      client_id: profile?.client_id,
      utilisateur_id: profile?.id
    };
    return this.http.post<Ticket>(this.baseUrl, payload).pipe(
      tap(newTicket => this.ticketsData.update(list => [...list, newTicket]))
    );
  }

  // NOTE: ticket_bp has no PATCH/PUT route — status updates stay
  // local-only until the backend supports it.
  updateTicketStatus(id: number, status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'): void {
    this.ticketsData.update(list =>
      list.map(ticket => ticket.id === id ? { ...ticket, status } : ticket)
    );
  }
}
