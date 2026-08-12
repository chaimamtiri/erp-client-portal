import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { ActivityItem } from './api-config.service';
import { ApiConfigService } from './api-config.service';

interface ActivityApiItem {
  title: string;
  detail: string | Record<string, unknown> | null;
  time: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  private activityData = signal<ActivityItem[]>([]);
  private loadError = signal(false);

  readonly activity = computed(() => this.activityData());
  readonly hasError = computed(() => this.loadError());

  loadActivity(): void {
    this.loadError.set(false);

    this.http.get<ActivityApiItem[]>(this.apiConfig.getApiUrl('/activity')).pipe(
      map((items) => items.map((item) => ({
        title: item.title,
        detail: this.formatDetail(item.detail),
        time: item.time
          ? new Date(item.time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
          : '-'
      }))),
      catchError(() => {
        this.loadError.set(true);
        return of(null);
      })
    ).subscribe((result) => {
      this.activityData.set(result ? (result as ActivityItem[]) : []);
    });
  }

  getActivity(): ActivityItem[] {
    return this.activityData();
  }

  getRecentActivity(count: number = 10): ActivityItem[] {
    return this.activityData().slice(0, count);
  }

  addActivity(activityItem: ActivityItem): void {
    this.activityData.update((activities) => [activityItem, ...activities]);
  }

  private formatDetail(detail: string | Record<string, unknown> | null): string {
    if (typeof detail === 'string') return detail;
    if (detail && Object.keys(detail).length > 0) return JSON.stringify(detail);
    return '-';
  }
}
