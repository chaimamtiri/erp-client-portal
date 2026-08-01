import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<string>();
  change = input.required<string>();
  icon = input.required<string>();
  tone = input.required<'accent' | 'success' | 'warning' | 'neutral'>();
}
