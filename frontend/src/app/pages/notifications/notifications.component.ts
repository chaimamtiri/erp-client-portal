import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, MatCardModule, MatButtonModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Notifications']" />
    
    <mat-card class="notifications-card">
      <div class="notifications-header">
        <div>
          <h2>Centre de notifications</h2>
          <p>Gérez vos alertes de commandes, facturations et nouveautés du portail.</p>
        </div>
        <div class="action-buttons">
          @if (notifications.unreadCount() > 0) {
            <button mat-stroked-button color="primary" (click)="notifications.markAllAsRead()">
              <mat-icon>done_all</mat-icon>
              Tout marquer comme lu
            </button>
          }
          @if (notifications.notifications().length > 0) {
            <button mat-stroked-button color="warn" (click)="notifications.clearAll()">
              <mat-icon>delete_sweep</mat-icon>
              Tout vider
            </button>
          }
        </div>
      </div>

      <div class="notification-list">
        @for (notification of notifications.notifications(); track notification.titre; let idx = $index) {
          <div class="notification-item" [class.unread]="!notification.est_lu">
            <div class="notification-item__icon" [class.unread]="!notification.est_lu">
              <mat-icon>{{ getIcon(notification.titre) }}</mat-icon>
            </div>
            
            <div class="notification-item__content">
              <div class="title-row">
                <strong>{{ notification.titre }}</strong>
                <span class="time">{{ notification.date_creation | date: 'dd/MM HH:mm' }}</span>
              </div>
              <p class="detail">{{ notification.message }}</p>
              
              <div class="actions-row">
                <button mat-button class="action-btn" (click)="toggleRead(idx)">
                  {{ notification.est_lu ? 'Marquer comme non lu' : 'Marquer comme lu' }}
                </button>
                <button mat-icon-button color="warn" class="delete-btn" (click)="deleteNotif(idx)" aria-label="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <mat-icon>notifications_off</mat-icon>
            <h3>Aucune notification</h3>
            <p>Vous êtes à jour ! Toutes les notifications lues ou effacées n'apparaissent plus ici.</p>
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.notifications-card { border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important; border: 1px solid #f1f5f9; background: white; }`,
    `.notifications-header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }`,
    `.notifications-header h2 { margin: 0 0 0.2rem 0; font-size: 1.2rem; font-weight: 700; color: #1e293b; }`,
    `.notifications-header p { margin: 0; font-size: 0.88rem; color: #64748b; }`,
    `.action-buttons { display: flex; gap: 0.75rem; }`,
    `.action-buttons button mat-icon { font-size: 18px; width: 18px; height: 18px; margin-right: 0.35rem; }`,
    
    `.notification-list { display: flex; flex-direction: column; gap: 1rem; }`,
    `.notification-item { display: flex; gap: 1.2rem; padding: 1.2rem; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; transition: all 0.2s ease; }`,
    `.notification-item.unread { border-left: 4px solid #2563eb; background: #eff6ff; border-color: #bfdbfe; }`,
    
    `.notification-item__icon { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: #e2e8f0; color: #64748b; flex-shrink: 0; }`,
    `.notification-item__icon.unread { background: #dbeafe; color: #2563eb; }`,
    `.notification-item__icon mat-icon { font-size: 20px; width: 20px; height: 20px; }`,
    
    `.notification-item__content { flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }`,
    `.title-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }`,
    `.title-row strong { font-size: 0.95rem; color: #1e293b; font-weight: 700; }`,
    `.title-row .time { font-size: 0.78rem; color: #94a3b8; }`,
    `.detail { margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.4; }`,
    
    `.actions-row { display: flex; gap: 1rem; align-items: center; margin-top: 0.5rem; border-top: 1px solid rgba(226, 232, 240, 0.4); padding-top: 0.5rem; }`,
    `.action-btn { font-size: 0.8rem; font-weight: 600; color: #2563eb; height: auto; padding: 0; min-width: auto; }`,
    `.delete-btn { margin-left: auto; width: 32px; height: 32px; display: grid; place-items: center; }`,
    `.delete-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }`,
    
    `.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; color: #94a3b8; gap: 0.8rem; text-align: center; }`,
    `.empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; }`,
    `.empty-state h3 { margin: 0; font-size: 1.15rem; color: #64748b; font-weight: 700; }`,
    `.empty-state p { margin: 0; font-size: 0.88rem; max-width: 320px; line-height: 1.4; }`,

    `/* Dark Mode overrides */
    .dark-theme .notifications-card { background: #1e293b; border-color: #334155; }`,
    `.dark-theme .notifications-header { border-bottom-color: #334155; }`,
    `.dark-theme .notifications-header h2 { color: #f8fafc; }`,
    `.dark-theme .notifications-header p { color: #94a3b8; }`,
    `.dark-theme .notification-item { background: #0f172a; border-color: #334155; }`,
    `.dark-theme .notification-item.unread { border-left-color: #2563eb; background: rgba(37,99,235,0.1); border-color: #1e3a8a; }`,
    `.dark-theme .title-row strong { color: #f8fafc; }`,
    `.dark-theme .detail { color: #cbd5e1; }`,
    `.dark-theme .notification-item__icon { background: #1e293b; color: #94a3b8; }`,
    `.dark-theme .notification-item__icon.unread { background: rgba(37,99,235,0.2); color: #60a5fa; }`,
    `.dark-theme .action-btn { color: #60a5fa; }`,
    `.dark-theme .empty-state h3 { color: #94a3b8; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  protected readonly notifications = inject(NotificationService);

  getIcon(titre: string): string {
    const t = titre.toLowerCase();
    if (t.includes('paiement') || t.includes('reçu')) return 'payments';
    if (t.includes('livraison') || t.includes('commande')) return 'local_shipping';
    if (t.includes('mise à jour') || t.includes('portail')) return 'system_update';
    return 'notifications';
  }

  toggleRead(index: number): void {
    this.notifications.toggleReadStatus(index);
  }

  deleteNotif(index: number): void {
    this.notifications.deleteNotification(index);
  }
}
