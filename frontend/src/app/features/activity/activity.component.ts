import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { ActivityService } from '../../core/services/activity.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-activity',
  imports: [MatCardModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent implements OnInit {
  protected readonly activityService: ActivityService = inject(ActivityService);

  protected readonly activityList = this.activityService.activity;

  ngOnInit(): void {
    this.activityService.loadActivity();
  }
}
