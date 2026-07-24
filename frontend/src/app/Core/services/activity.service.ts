import { Injectable, signal, computed } from '@angular/core';
import { activity, ActivityItem } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activityData = signal(activity);

  readonly activity$ = this.activityData.asReadonly();
  readonly activity = computed(() => this.activityData());

  getActivity() {
    return this.activityData();
  }

  getRecentActivity(count: number = 10): ActivityItem[] {
    return this.activityData().slice(0, count);
  }

  addActivity(activityItem: ActivityItem): void {
    this.activityData.update(activities => [activityItem, ...activities]);
  }
}
