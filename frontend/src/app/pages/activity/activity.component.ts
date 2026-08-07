import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { ActivityService } from '../../core/services/activity.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [MatCardModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent {
  protected readonly activityService: ActivityService = inject(ActivityService);

  protected readonly activityList = this.activityService.activity;
}
