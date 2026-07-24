import { Injectable, signal, computed } from '@angular/core';
import { tickets, Ticket } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private ticketsData = signal(tickets);

  readonly tickets$ = this.ticketsData.asReadonly();
  readonly tickets = computed(() => this.ticketsData());

  getTickets() {
    return this.ticketsData();
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

  addTicket(ticket: Omit<Ticket, 'id'>): void {
    const newTicket: Ticket = {
      ...ticket,
      id: this.ticketsData().length + 1,
      est_supprime: false
    };
    this.ticketsData.update(tickets => [...tickets, newTicket] as Ticket[]);
  }

  updateTicketStatus(id: number, status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'): void {
    this.ticketsData.update(tickets =>
      tickets.map(ticket =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  }
}
