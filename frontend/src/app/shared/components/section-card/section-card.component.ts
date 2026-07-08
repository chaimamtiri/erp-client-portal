import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-card',
  imports: [MatCardModule, MatIconModule, RouterLink],
  template: `
    <mat-card class="section-card">
      <div class="section-card__header">
        <div>
          <div class="section-card__title">{{ title() }}</div>
          <div class="section-card__subtitle">{{ subtitle() }}</div>
        </div>
        @if (actionLabel()) {
          <a [routerLink]="actionLink()" class="section-card__action">
            {{ actionLabel() }}
            <mat-icon>arrow_forward</mat-icon>
          </a>
        }
      </div>
      <ng-content />
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.section-card { border-radius: 1.25rem; padding: 1.25rem; box-shadow: 0 20px 48px rgba(15,23,42,0.06); background: rgba(255,255,255,0.9); overflow: visible; }`,
    `.section-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; gap: 0.75rem; flex-wrap: wrap; }`,
    `.section-card__title { font-weight: 700; color: #0f172a; }`,
    `.section-card__subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.15rem; }`,
    `.section-card__action { display: inline-flex; align-items: center; gap: 0.3rem; color: #2563eb; font-weight: 600; text-decoration: none; flex-wrap: wrap; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionCardComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  actionLabel = input<string>('');
  actionLink = input<string>('/');
}

