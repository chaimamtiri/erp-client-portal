import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { documents } from '../../models/mock-data';

@Component({
  selector: 'app-documents',
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Documents']" />
    <mat-card class="documents-card">
      <h2>Documents</h2>
      <div class="documents-list">
        @for (document of documentList; track document.name) {
          <div class="document-item">
            <div class="document-item__icon"><mat-icon>description</mat-icon></div>
            <div>
              <strong>{{ document.name }}</strong>
              <p>{{ document.type }} • {{ document.size }}</p>
            </div>
            <span>{{ document.updated }}</span>
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [
    `:host { display: block; }`,
    `.documents-card { border-radius: 20px; padding: 1rem; }`,
    `.documents-list { display: flex; flex-direction: column; gap: 0.75rem; }`,
    `.document-item { display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: 16px; background: #f8fafc; }`,
    `.document-item__icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: #eff6ff; color: #2563eb; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent {
  protected readonly documentList = documents;
}

