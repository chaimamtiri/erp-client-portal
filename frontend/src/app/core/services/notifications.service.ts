import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppNotification {
  id: number;
  client_id: number;
  titre: string;
  message: string;
  type: string;
  est_lu: boolean;
  date_creation: string | null;
  title: string;
  detail: string;
  time: string | null;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  private readonly _notifications = signal<AppNotification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  // Templates (TopbarComponent, NotificationsComponent) call this as unreadCount() —
  // it was referenced but never defined anywhere in this file. Added as a computed
  // signal so it stays in sync with _notifications automatically.
  readonly unreadCount = computed(() =>
    this._notifications().filter(n => !n.read && !n.est_lu).length
  );

  loadNotifications(clientId?: number): Observable<AppNotification[]> {
    const url = clientId ? `${this.baseUrl}?client_id=${clientId}` : this.baseUrl;
    return this.http.get<AppNotification[]>(url).pipe(
      tap(list => this._notifications.set(list)),
      catchError(() => {
        this._notifications.set([]);
        return of([]);
      })
    );
  }

  // NOTE: notification_bp is list-only on the backend — no PUT/DELETE
  // route exists yet. These stay local-only and will not persist past
  // a reload or sync elsewhere.
  toggleReadStatus(index: number): void {
    this._notifications.update(list =>
      list.map((n, i) => i === index ? { ...n, read: !n.read, est_lu: !n.est_lu } : n)
    );
  }

  deleteNotification(index: number): void {
    this._notifications.update(list => list.filter((_, i) => i !== index));
  }
}
