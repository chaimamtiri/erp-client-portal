import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { notifications } from '../../models/mock-data';

@Component({
  selector: 'app-notifications',
  imports: [MatCardModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Notifications']" />
    <mat-card class="notifications-card">
      <h2>Notifications</h2>
      <div class="notification-list">
        @for (notification of notificationList; track notification.title) {
          <div class="notification-item" [class.unread]="!notification.read">
            <div>
              <strong>{{ notification.title }}</strong>
              <p>{{ notification.detail }}</p>
            </div>
            <span>{{ notification.time }}</span>
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.notifications-card { border-radius: 20px; padding: 1rem; }`,
    `.notification-list { display: flex; flex-direction: column; gap: 0.75rem; }`,
    `.notification-item { display: flex; justify-content: space-between; gap: 1rem; align-items: center; padding: 0.9rem 1rem; border-radius: 16px; background: #f8fafc; }`,
    `.notification-item.unread { border-left: 3px solid #2563eb; background: #eff6ff; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  protected readonly notificationList = notifications;
}

