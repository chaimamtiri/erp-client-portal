import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ActivityService } from '../../core/services/activity.service';

@Component({
  selector: 'app-activity',
  imports: [MatCardModule, BreadcrumbComponent],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent {
  protected readonly activityService: ActivityService = inject(ActivityService);

  protected readonly activityList = this.activityService.activity;
}

