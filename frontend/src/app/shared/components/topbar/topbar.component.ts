import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-topbar',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <header class="topbar">
      <div class="topbar__title-block">
        <div class="topbar__eyebrow">Portail client ERP</div>
        <h1>{{ title() }}</h1>
      </div>

      <div class="topbar__actions">
        <mat-form-field appearance="outline" class="topbar__search">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput placeholder="Rechercher..." />
        </mat-form-field>

      </div>
    </header>
  `,
  styles: [
    `:host { display: block; }`,
    `.topbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 0 1.25rem; }`,
    `.topbar__title-block h1 { margin: 0; font-size: 1.3rem; color: #0f172a; }`,
    `.topbar__eyebrow { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.18em; }`,
    `.topbar__actions { display: flex; align-items: center; gap: 0.6rem; }`,
    `.topbar__search { min-width: 280px; }`,
    `.topbar__search ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  title = input.required<string>();
}

