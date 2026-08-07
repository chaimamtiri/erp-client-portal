import { Injectable, signal, computed } from '@angular/core';
import { NotificationItem, notifications } from '../models/mock-data';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<NotificationItem[]>(notifications);

  readonly unreadCount = computed(() => {
    return this.notifications().filter((n) => !n.est_lu).length;
  });

  markAsRead(index: number): void {
    this.notifications.update((list) =>
      list.map((n, idx) => (idx === index ? { ...n, est_lu: true, read: true } : n))
    );
  }

  toggleReadStatus(index: number): void {
    this.notifications.update((list) =>
      list.map((n, idx) => (idx === index ? { ...n, est_lu: !n.est_lu, read: !n.read } : n))
    );
  }

  markAllAsRead(): void {
    this.notifications.update((list) =>
      list.map((n) => ({ ...n, est_lu: true, read: true }))
    );
  }

  deleteNotification(index: number): void {
    this.notifications.update((list) =>
      list.filter((_, idx) => idx !== index)
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}
