import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SupportService } from '../../core/services/support.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, BreadcrumbComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailComponent implements OnInit {
  protected readonly supportService: SupportService = inject(SupportService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  ticket: any;

  ngOnInit(): void {
    const ticketId = this.route.snapshot.queryParamMap.get('ticketId');
    if (ticketId) {
      this.ticket = this.supportService.getTicketById(Number(ticketId));
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

