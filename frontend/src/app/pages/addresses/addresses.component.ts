import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { addresses } from '../../models/mock-data';

@Component({
  selector: 'app-addresses',
  imports: [MatCardModule, MatButtonModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Adresses']" />
    <mat-card class="addresses-card">
      <div class="addresses-card__header">
        <div>
          <h2>Gestion des adresses</h2>
          <p>Gérez vos adresses de livraison et de facturation.</p>
        </div>
        <button mat-flat-button color="primary">Ajouter</button>
      </div>
      <div class="addresses-list">
        @for (address of addressList; track address.title) {
          <div class="address-item">
            <strong>{{ address.title }}</strong>
            <p>{{ address.line }}</p>
            <p>{{ address.city }}</p>
            @if (address.default) {
              <span class="default-tag">Par défaut</span>
            }
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.addresses-card { border-radius: 20px; padding: 1rem; }`,
    `.addresses-card__header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1rem; }`,
    `.addresses-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }`,
    `.address-item { padding: 1rem; border-radius: 16px; background: #f8fafc; }`,
    `.default-tag { display: inline-block; margin-top: 0.5rem; padding: 0.3rem 0.6rem; border-radius: 999px; background: #dcfce7; color: #15803d; font-size: 0.8rem; }`,
    `@media (max-width: 768px) { .addresses-list { grid-template-columns: 1fr; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesComponent {
  protected readonly addressList = addresses;
}

