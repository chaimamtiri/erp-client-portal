import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { NotificationService } from '../../Core/services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, MatCardModule, MatButtonModule, MatIconModule, BreadcrumbComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  protected readonly notificationService: NotificationService = inject(NotificationService);

  getIcon(titre: string): string {
    const t = titre.toLowerCase();
    if (t.includes('paiement') || t.includes('reçu')) return 'payments';
    if (t.includes('livraison') || t.includes('commande')) return 'local_shipping';
    if (t.includes('mise à jour') || t.includes('portail')) return 'system_update';
    return 'notifications';
  }

  toggleRead(index: number): void {
    this.notificationService.toggleReadStatus(index);
  }

  deleteNotif(index: number): void {
    this.notificationService.deleteNotification(index);
  }
}
