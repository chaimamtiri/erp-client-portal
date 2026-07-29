import { Injectable, signal, computed } from '@angular/core';
import { tickets, Ticket, TicketMessage } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private ticketsData = signal(tickets);
  private ticketMessagesData = signal<TicketMessage[]>([]);

  readonly tickets$ = this.ticketsData.asReadonly();
  readonly tickets = computed(() => this.ticketsData());
  readonly ticketMessages = computed(() => this.ticketMessagesData());

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
    return this.ticketsData().filter(ticket => ticket.priorite === priority);
  }

  getTicketsByCategory(category: string): Ticket[] {
    return this.ticketsData().filter(ticket => ticket.categorie === category);
  }

  getMessagesByTicketId(ticketId: number): TicketMessage[] {
    return this.ticketMessagesData().filter(msg => msg.ticket_id === ticketId);
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

  getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
      basse: 'Basse',
      normale: 'Normale',
      haute: 'Haute',
      urgente: 'Urgente'
    };
    return map[priority] ?? priority;
  }

  addTicket(ticket: Omit<Ticket, 'id' | 'numero' | 'date_creation' | 'date_modification'>): Ticket {
    const newTicket: Ticket = {
      ...ticket,
      id: this.ticketsData().length + 1,
      numero: `TKT-${100 + this.ticketsData().length + 1}`,
      date_creation: new Date(),
      date_modification: new Date(),
      est_supprime: false
    };
    this.ticketsData.update(tickets => [...tickets, newTicket] as Ticket[]);
    return newTicket;
  }

  updateTicket(id: number, updates: Partial<Omit<Ticket, 'id' | 'numero'>>): void {
    this.ticketsData.update(tickets =>
      tickets.map(ticket =>
        ticket.id === id
          ? { ...ticket, ...updates, date_modification: new Date() }
          : ticket
      )
    );
  }

  updateTicketStatus(id: number, status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'): void {
    this.updateTicket(id, { status });
  }

  updateTicketPriority(id: number, priority:Ticket['priorite']): void {
    this.updateTicket(id, { priorite: priority });
  }

  deleteTicket(id: number): void {
    this.ticketsData.update(tickets =>
      tickets.map(ticket =>
        ticket.id === id ? { ...ticket, est_supprime: true } : ticket
      )
    );
  }

  addMessage(message: Omit<TicketMessage, 'id' | 'date_creation'>): TicketMessage {
    const newMessage: TicketMessage = {
      ...message,
      id: this.ticketMessagesData().length + 1,
      date_creation: new Date(),
      est_supprime: false
    };
    this.ticketMessagesData.update(messages => [...messages, newMessage]);
    
    // Update ticket modification date
    this.updateTicket(message.ticket_id, { date_modification: new Date() });
    
    return newMessage;
  }

  deleteMessage(messageId: number): void {
    this.ticketMessagesData.update(messages =>
      messages.map(msg =>
        msg.id === messageId ? { ...msg, est_supprime: true } : msg
      )
    );
  }

  // Backend integration methods (to be replaced with HTTP calls)
  async loadTicketsFromBackend(): Promise<void> {
    // TODO: Replace with actual HTTP call
    // const tickets = await this.http.get<Ticket[]>('/api/tickets').toPromise();
    // this.ticketsData.set(tickets);
  }

  async loadMessagesFromBackend(ticketId: number): Promise<void> {
    // TODO: Replace with actual HTTP call
    // const messages = await this.http.get<TicketMessage[]>(`/api/tickets/${ticketId}/messages`).toPromise();
    // this.ticketMessagesData.update(current => 
    //   [...current.filter(m => m.ticket_id !== ticketId), ...messages]
    // );
  }

  async createTicketOnBackend(ticket: Omit<Ticket, 'id' | 'numero' | 'date_creation' | 'date_modification'>): Promise<Ticket> {
    // TODO: Replace with actual HTTP call
    // const newTicket = await this.http.post<Ticket>('/api/tickets', ticket).toPromise();
    // this.ticketsData.update(tickets => [...tickets, newTicket]);
    // return newTicket;
    return this.addTicket(ticket);
  }

  async updateTicketOnBackend(id: number, updates: Partial<Ticket>): Promise<void> {
    // TODO: Replace with actual HTTP call
    // await this.http.put(`/api/tickets/${id}`, updates).toPromise();
    this.updateTicket(id, updates);
  }

  async deleteTicketOnBackend(id: number): Promise<void> {
    // TODO: Replace with actual HTTP call
    // await this.http.delete(`/api/tickets/${id}`).toPromise();
    this.deleteTicket(id);
  }

  async sendMessageOnBackend(message: Omit<TicketMessage, 'id' | 'date_creation'>): Promise<TicketMessage> {
    // TODO: Replace with actual HTTP call
    // const newMessage = await this.http.post<TicketMessage>(`/api/tickets/${message.ticket_id}/messages`, message).toPromise();
    // this.ticketMessagesData.update(messages => [...messages, newMessage]);
    // return newMessage;
    return this.addMessage(message);
  }
}
