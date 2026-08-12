import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { SupportService } from '../../core/services/support.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-detail',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailComponent implements OnInit {
  protected readonly supportService: SupportService = inject(SupportService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  ticket: any;
  loading = true;

  ngOnInit(): void {
    const ticketId = this.route.snapshot.queryParamMap.get('ticketId');
    if (!ticketId) {
      this.loading = false;
      return;
    }
    const id = Number(ticketId);

    // Cache first for instant render, then load the full list if it's empty
    // (covers deep-link/refresh where nothing has populated the signal yet).
    this.ticket = this.supportService.getTicketById(id);
    if (this.ticket) {
      this.loading = false;
    } else {
      this.supportService.loadTickets().subscribe({
        next: () => {
          this.ticket = this.supportService.getTicketById(id);
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
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

  updateStatus(newStatus: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'): void {
    if (this.ticket) {
      this.supportService.updateTicketStatus(this.ticket.id, newStatus);
      this.ticket.status = newStatus;
    }
  }

  addMessage(message: string): void {
    // TODO: Implement message functionality
    console.log('Adding message:', message);
  }
}
