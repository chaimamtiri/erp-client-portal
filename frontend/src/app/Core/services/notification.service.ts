import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { ProfileService, UserProfile } from './profile.service';

export interface NotificationItem {
  id: number;
  titre: string;
  message: string;
  est_lu: boolean;
  date_creation: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly profileService = inject(ProfileService);

  readonly notifications = signal<NotificationItem[]>([]);
  readonly unreadCount = signal(0);

  loadNotifications(): Observable<NotificationItem[]> {
    return this.profileService.loadCurrentUser().pipe(
      switchMap((profile: UserProfile) => {
        if (!profile.clientId) {
          return of([]);
        }
        return this.http.get<NotificationItem[]>(
          this.apiConfig.getApiUrl(`/notifications/${profile.clientId}`)
        ).pipe(
          tap((items: NotificationItem[]) => {
            this.notifications.set(items);
            this.unreadCount.set(items.filter(i => !i.est_lu).length);
          })
        );
      })
    );
  }

  toggleReadStatus(index: number): void {
    this.notifications.update(list => {
      const updated = [...list];
      if (updated[index]) {
        updated[index] = { ...updated[index], est_lu: !updated[index].est_lu };
      }
      this.unreadCount.set(updated.filter(i => !i.est_lu).length);
      return updated;
    });
  }

  markAllAsRead(): void {
    this.notifications.update(list => list.map(item => ({ ...item, est_lu: true })));
    this.unreadCount.set(0);
  }

  deleteNotification(index: number): void {
    this.notifications.update(list => {
      const updated = list.filter((_, i) => i !== index);
      this.unreadCount.set(updated.filter(i => !i.est_lu).length);
      return updated;
    });
  }
}
