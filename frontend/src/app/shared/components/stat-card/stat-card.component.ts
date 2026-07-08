import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card">
      <div class="stat-card__header">
        <div class="stat-card__icon" [class]="tone()">
          <mat-icon>{{ icon() }}</mat-icon>
        </div>
        <span class="stat-card__change" [class]="tone()">{{ change() }}</span>
      </div>
      <div class="stat-card__value">{{ value() }}</div>
      <div class="stat-card__title">{{ title() }}</div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.stat-card { padding: 1rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(244,247,255,0.92)); box-shadow: 0 12px 32px rgba(15,23,42,0.08); height: auto; min-height: 100%; overflow: visible; }`,
    `.stat-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 0.75rem; flex-wrap: wrap; }`,
    `.stat-card__icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; color: #fff; flex-shrink: 0; }`,
    `.stat-card__icon.accent { background: linear-gradient(135deg, #2563eb, #4f46e5); }`,
    `.stat-card__icon.success { background: linear-gradient(135deg, #16a34a, #10b981); }`,
    `.stat-card__icon.warning { background: linear-gradient(135deg, #ea580c, #f59e0b); }`,
    `.stat-card__icon.neutral { background: linear-gradient(135deg, #64748b, #475569); }`,
    `.stat-card__change { font-size: 0.8rem; font-weight: 600; }`,
    `.stat-card__change.accent { color: #2563eb; }`,
    `.stat-card__change.success { color: #16a34a; }`,
    `.stat-card__change.warning { color: #ea580c; }`,
    `.stat-card__change.neutral { color: #475569; }`,
    `.stat-card__value { font-size: 1.4rem; font-weight: 700; color: #0f172a; }`,
    `.stat-card__title { margin-top: 0.25rem; color: #64748b; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<string>();
  change = input.required<string>();
  icon = input.required<string>();
  tone = input.required<'accent' | 'success' | 'warning' | 'neutral'>();
}

