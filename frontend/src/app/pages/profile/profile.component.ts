import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, MatButtonModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Profil']" />
    <mat-card class="profile-card">
      <div class="profile-card__header">
        <div>
          <h2>Profil utilisateur</h2>
          <p>Claire Martin • Administrateur</p>
        </div>
        <button mat-flat-button color="primary">Modifier</button>
      </div>
      <div class="profile-card__body">
        <p>Email : claire.martin@acme.com</p>
        <p>Entreprise : Acme SAS</p>
        <p>Rôle : Responsable achats</p>
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.profile-card { border-radius: 20px; padding: 1rem; }`,
    `.profile-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }`,
    `.profile-card__body { display: flex; flex-direction: column; gap: 0.35rem; color: #475569; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {}

