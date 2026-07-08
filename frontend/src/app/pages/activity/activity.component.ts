import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { activity } from '../../models/mock-data';

@Component({
  selector: 'app-activity',
  imports: [MatCardModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Activité']" />
    <mat-card class="activity-card">
      <h2>Journal d’activité</h2>
      <div class="activity-list">
        @for (item of activityList; track item.title) {
          <div class="activity-item">
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.detail }}</p>
            </div>
            <span>{{ item.time }}</span>
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.activity-card { border-radius: 20px; padding: 1rem; }`,
    `.activity-list { display: flex; flex-direction: column; gap: 0.75rem; }`,
    `.activity-item { display: flex; justify-content: space-between; gap: 1rem; align-items: center; padding: 0.8rem 0.9rem; border-radius: 16px; background: #f8fafc; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent {
  protected readonly activityList = activity;
}

