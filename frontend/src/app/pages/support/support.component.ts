import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SupportService } from '../../Core/services/support.service';
import { Ticket } from '../../Core/models/mock-data';

@Component({
  selector: 'app-support',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatDialogModule, BreadcrumbComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent {
  protected readonly supportService: SupportService = inject(SupportService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly router: Router = inject(Router);

  protected readonly ticketList = this.supportService.tickets;

  // Filters
  protected statusFilter = signal<string>('');
  protected priorityFilter = signal<string>('');
  protected categoryFilter = signal<string>('');
  protected searchTerm = signal<string>('');

  // Computed filtered tickets
  protected readonly filteredTickets = signal<Ticket[]>([]);

  constructor() {
    this.applyFilters();
  }

  statusLabel(status: string): string {
    return this.supportService.getStatusLabel(status);
  }

  priorityLabel(priority: string): string {
    return this.supportService.getPriorityLabel(priority);
  }

  protected applyFilters(): void {
    let filtered = this.supportService.getTickets();

    // Apply status filter
    if (this.statusFilter()) {
      filtered = filtered.filter(ticket => ticket.status === this.statusFilter());
    }

    // Apply priority filter
    if (this.priorityFilter()) {
      filtered = filtered.filter(ticket => ticket.priorite === this.priorityFilter());
    }

    // Apply category filter
    if (this.categoryFilter()) {
      filtered = filtered.filter(ticket => ticket.categorie === this.categoryFilter());
    }

    // Apply search filter
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.sujet.toLowerCase().includes(search) ||
        ticket.numero.toLowerCase().includes(search) ||
        (ticket.description && ticket.description.toLowerCase().includes(search))
      );
    }

    this.filteredTickets.set(filtered);
  }

  protected onStatusFilterChange(status: string): void {
    this.statusFilter.set(status);
    this.applyFilters();
  }

  protected onPriorityFilterChange(priority: string): void {
    this.priorityFilter.set(priority);
    this.applyFilters();
  }

  protected onCategoryFilterChange(category: string): void {
    this.categoryFilter.set(category);
    this.applyFilters();
  }

  protected onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.applyFilters();
  }

  protected resetFilters(): void {
    this.statusFilter.set('');
    this.priorityFilter.set('');
    this.categoryFilter.set('');
    this.searchTerm.set('');
    this.applyFilters();
  }

  protected viewTicketDetail(ticketId: number): void {
    this.router.navigate(['/support/ticket-detail'], { queryParams: { ticketId } });
  }

  protected createNewTicket(): void {
    this.router.navigate(['/support/create']);
  }

  protected deleteTicket(ticketId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      this.supportService.deleteTicket(ticketId);
      this.applyFilters();
    }
  }

  protected getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      basse: '#10b981',
      normale: '#3b82f6',
      haute: '#f59e0b',
      urgente: '#ef4444'
    };
    return colors[priority] || '#6b7280';
  }

  protected getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      ouvert: '#3b82f6',
      en_cours: '#f59e0b',
      resolu: '#10b981',
      ferme: '#6b7280'
    };
    return colors[status] || '#6b7280';
  }

  protected getUniqueCategories(): string[] {
    const categories = this.supportService.getTickets()
      .map(ticket => ticket.categorie)
      .filter((cat): cat is string => cat !== undefined);
    return [...new Set(categories)];
  }
}
