import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, MatIconModule],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (item of items(); track item; let last = $last) {
        <span class="breadcrumb__item">
          <a [routerLink]="item === 'Accueil' ? '/dashboard' : '/'">{{ item }}</a>
          @if (!last) {
            <mat-icon>chevron_right</mat-icon>
          }
        </span>
      }
    </nav>
  `,
  styles: [
    `:host { display: block; margin-bottom: 1rem; }`,
    `.breadcrumb { display: flex; flex-wrap: wrap; gap: 0.25rem; align-items: center; color: #64748b; }`,
    `.breadcrumb__item { display: inline-flex; align-items: center; gap: 0.25rem; }`,
    `.breadcrumb__item a { text-decoration: none; color: inherit; font-weight: 600; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  items = input.required<string[]>();
}

