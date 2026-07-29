import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SupportService } from '../../Core/services/support.service';
import { Ticket, TicketMessage } from '../../Core/models/mock-data';

@Component({
  selector: 'app-ticket-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    BreadcrumbComponent
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailComponent implements OnInit {
  protected readonly supportService: SupportService = inject(SupportService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  protected ticket: Ticket | null = null;
  protected messages = signal<TicketMessage[]>([]);
  protected newMessage = signal<string>('');
  protected isInternalMessage = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  ngOnInit(): void {
    const ticketId = this.route.snapshot.queryParamMap.get('ticketId');
    if (ticketId) {
      const ticket = this.supportService.getTicketById(Number(ticketId));
      this.ticket = ticket ?? null;
      if (this.ticket) {
        this.loadMessages(this.ticket.id);
      }
    }
  }

  private loadMessages(ticketId: number): void {
    this.messages.set(this.supportService.getMessagesByTicketId(ticketId));
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      basse: '#10b981',
      normale: '#3b82f6',
      haute: '#f59e0b',
      urgente: '#ef4444'
    };
    return colors[priority] || '#6b7280';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      ouvert: '#3b82f6',
      en_cours: '#f59e0b',
      resolu: '#10b981',
      ferme: '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  protected getStatusLabel(status: string): string {
    return this.supportService.getStatusLabel(status);
  }

  protected getPriorityLabel(priority: string): string {
    return this.supportService.getPriorityLabel(priority);
  }

  protected updateStatus(newStatus: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'): void {
    if (this.ticket) {
      this.supportService.updateTicketStatus(this.ticket.id, newStatus);
      this.ticket.status = newStatus;
    }
  }

  protected updatePriority(newPriority: Ticket['priorite']): void {
    if (this.ticket) {
      this.supportService.updateTicketPriority(this.ticket.id, newPriority);
      this.ticket.priorite = newPriority;
    }
  }

  protected sendMessage(): void {
    if (!this.ticket || !this.newMessage().trim() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const message: Omit<TicketMessage, 'id' | 'date_creation'> = {
      ticket_id: this.ticket.id,
      utilisateur_id: 1, // TODO: Get from auth service
      message: this.newMessage().trim(),
      est_interne: this.isInternalMessage(),
      est_supprime: false
    };

    this.supportService.addMessage(message);
    this.loadMessages(this.ticket.id);
    this.newMessage.set('');
    this.isInternalMessage.set(false);
    this.isSubmitting.set(false);
  }

  protected deleteMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.supportService.deleteMessage(messageId);
      if (this.ticket) {
        this.loadMessages(this.ticket.id);
      }
    }
  }

  protected formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected canEditTicket(): boolean {
    // TODO: Add permission check based on user role
    return this.ticket?.status !== 'ferme';
  }

  protected canDeleteTicket(): boolean {
    // TODO: Add permission check based on user role
    return true;
  }

  protected deleteTicket(): void {
    if (this.ticket && confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      this.supportService.deleteTicket(this.ticket.id);
      // Navigate back to support list
      window.history.back();
    }
  }

  protected getAvailableStatuses(): Array<{ value: string; label: string }> {
    return [
      { value: 'ouvert', label: 'Ouvert' },
      { value: 'en_cours', label: 'En cours' },
      { value: 'resolu', label: 'Résolu' },
      { value: 'ferme', label: 'Fermé' }
    ];
  }

  protected getAvailablePriorities(): Array<{ value: string; label: string }> {
    return [
      { value: 'basse', label: 'Basse' },
      { value: 'normale', label: 'Normale' },
      { value: 'haute', label: 'Haute' },
      { value: 'urgente', label: 'Urgente' }
    ];
  }
}

