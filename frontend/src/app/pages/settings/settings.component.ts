import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    BreadcrumbComponent
  ],
  template: `
    <app-breadcrumb [items]="['Accueil', 'Paramètres']" />

    <div class="settings-layout">
      <!-- General Settings Card -->
      <mat-card class="settings-card">
        <div class="settings-card__header">
          <mat-icon>settings</mat-icon>
          <div>
            <h2>Préférences de l'application</h2>
            <p>Gérez l'apparence de votre portail et vos préférences linguistiques.</p>
          </div>
        </div>
        <div class="settings-card__body">
          <div class="setting-row">
            <div class="setting-info">
              <strong>Mode Sombre</strong>
              <p>Activer l'affichage en mode sombre pour reposer vos yeux.</p>
            </div>
            <mat-slide-toggle [checked]="theme.darkMode()" (change)="theme.toggleTheme()"></mat-slide-toggle>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <strong>Langue du portail</strong>
              <p>Sélectionnez la langue d'affichage de l'interface.</p>
            </div>
            <mat-form-field appearance="outline" class="select-field">
              <mat-select [formControl]="languageControl">
                <mat-option value="fr">Français (FR)</mat-option>
                <mat-option value="en">English (EN)</mat-option>
                <mat-option value="es">Español (ES)</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-card>

      <!-- Email Notifications Preferences -->
      <mat-card class="settings-card">
        <div class="settings-card__header">
          <mat-icon>mail</mat-icon>
          <div>
            <h2>Préférences de notification email</h2>
            <p>Choisissez les alertes que vous souhaitez recevoir par e-mail.</p>
          </div>
        </div>
        <div class="settings-card__body">
          <div class="setting-row">
            <div class="setting-info">
              <strong>Nouveaux bons de commande</strong>
              <p>Recevoir un email de confirmation lorsqu'une commande est validée.</p>
            </div>
            <mat-slide-toggle [formControl]="emailOrderControl"></mat-slide-toggle>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <strong>Facturation & Paiements</strong>
              <p>Être notifié par mail lors de l'émission d'une facture ou de la réception d'un paiement.</p>
            </div>
            <mat-slide-toggle [formControl]="emailInvoiceControl"></mat-slide-toggle>
          </div>
        </div>
      </mat-card>

      <!-- Security Card -->
      <mat-card class="settings-card">
        <div class="settings-card__header">
          <mat-icon>security</mat-icon>
          <div>
            <h2>Sécurité du compte</h2>
            <p>Mettez à jour votre mot de passe pour sécuriser vos accès.</p>
          </div>
        </div>
        <div class="settings-card__body">
          <form [formGroup]="securityForm" (submit)="savePassword()" class="security-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Mot de passe actuel</mat-label>
                <input matInput formControlName="currentPassword" type="password" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nouveau mot de passe</mat-label>
                <input matInput formControlName="newPassword" type="password" />
              </mat-form-field>
            </div>
            <div class="action-row">
              <button mat-flat-button color="primary" type="submit" [disabled]="securityForm.invalid">
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `.settings-layout { display: flex; flex-direction: column; gap: 1.5rem; }`,
    `.settings-card { border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important; border: 1px solid #f1f5f9; background: white; }`,
    `.settings-card__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }`,
    `.settings-card__header mat-icon { font-size: 28px; width: 28px; height: 28px; color: #2563eb; }`,
    `.settings-card__header h2 { margin: 0 0 0.2rem 0; font-size: 1.15rem; font-weight: 700; color: #1e293b; }`,
    `.settings-card__header p { margin: 0; font-size: 0.85rem; color: #64748b; }`,
    
    `.settings-card__body { display: flex; flex-direction: column; gap: 1.25rem; }`,
    `.setting-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px dotted #f1f5f9; }`,
    `.setting-row:last-child { border-bottom: none; padding-bottom: 0; }`,
    `.setting-info strong { display: block; font-size: 0.92rem; color: #1e293b; font-weight: 600; }`,
    `.setting-info p { margin: 0.15rem 0 0 0; font-size: 0.82rem; color: #64748b; }`,
    `.select-field { width: 180px; }`,
    `.select-field ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }`,
    
    `.security-form { display: flex; flex-direction: column; gap: 1rem; }`,
    `.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }`,
    `@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }`,
    `.action-row { display: flex; justify-content: flex-start; }`,

    `/* Dark Mode overrides */
    .dark-theme .settings-card { background: #1e293b; border-color: #334155; }`,
    `.dark-theme .settings-card__header { border-bottom-color: #334155; }`,
    `.dark-theme .settings-card__header h2 { color: #f8fafc; }`,
    `.dark-theme .settings-card__header p { color: #94a3b8; }`,
    `.dark-theme .settings-card__header mat-icon { color: #60a5fa; }`,
    `.dark-theme .setting-info strong { color: #f8fafc; }`,
    `.dark-theme .setting-info p { color: #cbd5e1; }`,
    `.dark-theme .setting-row { border-bottom-color: #334155; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  protected readonly theme = inject(ThemeService);
  private readonly fb = inject(FormBuilder);

  // Form Controls
  languageControl = this.fb.control('fr');
  emailOrderControl = this.fb.control(true);
  emailInvoiceControl = this.fb.control(true);

  securityForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  savePassword(): void {
    if (this.securityForm.valid) {
      alert('Mot de passe mis à jour avec succès (simulation).');
      this.securityForm.reset();
    }
  }
}
