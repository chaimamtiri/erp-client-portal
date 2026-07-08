import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-settings',
  imports: [MatCardModule, MatButtonModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Paramètres']" />
    <mat-card class="settings-card">
      <h2>Paramètres</h2>
      <div class="settings-card__body">
        <p>Préférences du portail</p>
        <button mat-stroked-button>Activer les notifications</button>
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.settings-card { border-radius: 20px; padding: 1rem; }`,
    `.settings-card__body { display: flex; flex-direction: column; gap: 0.8rem; color: #475569; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}

