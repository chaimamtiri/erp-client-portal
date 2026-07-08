import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-ticket-detail',
  imports: [MatCardModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Support', 'Détail']" />
    <mat-card class="ticket-card">
      <h2>Ticket TKT-118</h2>
      <p>Accès au portail • Priorité élevée</p>
      <div class="ticket-card__body">
        <p>Une mise à jour d’accès est nécessaire pour l’utilisateur Claire Martin.</p>
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.ticket-card { padding: 1rem; border-radius: 20px; }`,
    `.ticket-card__body { margin-top: 1rem; color: #475569; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailComponent {}

