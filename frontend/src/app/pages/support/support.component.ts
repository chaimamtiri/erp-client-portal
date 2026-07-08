import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { tickets } from '../../models/mock-data';

@Component({
  selector: 'app-support',
  imports: [MatCardModule, MatButtonModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Support']" />
    <mat-card class="support-card">
      <div class="support-card__header">
        <div>
          <h2>Tickets support</h2>
          <p>Suivez l’état de vos requêtes.</p>
        </div>
        <button mat-flat-button color="primary">Nouveau ticket</button>
      </div>
      <div class="ticket-list">
        @for (ticket of ticketList; track ticket.id) {
          <div class="ticket-item">
            <div>
              <strong>{{ ticket.title }}</strong>
              <p>{{ ticket.category }} • {{ ticket.priority }}</p>
            </div>
            <span>{{ ticket.status }}</span>
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
    `.ticket-item { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1rem; background: #f8fafc; border-radius: 16px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent {
  protected readonly ticketList = tickets;
}

