import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { tickets } from '../../models/mock-data';

@Component({
  selector: 'app-support',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Support Ticket']" />
    <mat-card class="support-card">
      <div class="support-card__header">
        <div>
          <h2>Tickets support</h2>
          <p>Suivez l'état de vos requêtes.</p>
        </div>
        <button mat-flat-button color="primary">Nouveau ticket</button>
      </div>
      <div class="ticket-list">
        @for (ticket of ticketList; track ticket.id) {
          <div class="ticket-item">
            <div class="ticket-item__meta">
              <strong>{{ ticket.sujet }}</strong>
              <p>{{ ticket.categorie }} • {{ ticket.numero }}</p>
            </div>
            <div class="ticket-item__chips">
              <mat-chip [class]="'prio-' + ticket.priorite">{{ ticket.priorite }}</mat-chip>
              <mat-chip [class]="'status-' + ticket.status">{{ statusLabel(ticket.status) }}</mat-chip>
            </div>
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.support-card { border-radius: 20px; padding: 1rem; }`,
    `.support-card__header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }`,
    `.ticket-list { display: flex; flex-direction: column; gap: 0.75rem; }`,
    `.ticket-item { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1rem; background: #f8fafc; border-radius: 16px; gap: 1rem; flex-wrap: wrap; }`,
    `.ticket-item__meta strong { display: block; font-weight: 600; color: #1e293b; }`,
    `.ticket-item__meta p { margin: 0.2rem 0 0; font-size: 0.85rem; color: #64748b; }`,
    `.ticket-item__chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }`,
    `mat-chip { font-size: 0.78rem; }`,
    `.prio-haute, .prio-urgente { background: #fee2e2; color: #dc2626; }`,
    `.prio-normale { background: #fef3c7; color: #d97706; }`,
    `.prio-basse { background: #f0fdf4; color: #16a34a; }`,
    `.status-ouvert { background: #dbeafe; color: #1d4ed8; }`,
    `.status-en_cours { background: #fef9c3; color: #a16207; }`,
    `.status-resolu, .status-ferme { background: #dcfce7; color: #15803d; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent {
  protected readonly ticketList = tickets;

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ouvert: 'Ouvert',
      en_cours: 'En cours',
      resolu: 'Résolu',
      ferme: 'Fermé'
    };
    return map[status] ?? status;
  }
}
