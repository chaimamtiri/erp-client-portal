import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="login-shell">
      <mat-card class="login-card">
        <div class="login-card__illustration">
          <div class="illustration__badge">Portail client ERP</div>
          <div class="illustration__panel">
            <mat-icon>dashboard_customize</mat-icon>
            <h2>Suivi en temps réel</h2>
            <p>Accédez à vos commandes, factures et livraisons depuis un espace unique.</p>
          </div>
        </div>
        <div class="login-card__form">
          <h1>Bienvenue</h1>
          <p>Connectez-vous à votre espace client.</p>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput placeholder="prenom@entreprise.com" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Mot de passe</mat-label>
            <input matInput type="password" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="goToDashboard()">Connexion</button>
          <div class="login-card__links">
            <a routerLink="/">Mot de passe oublié ?</a>
            <span>•</span>
            <a routerLink="/dashboard">Voir le prototype</a>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `:host { display: block; min-height: 100vh; }`,
    `.login-shell { min-height: 100vh; display: grid; place-items: center; padding: 1rem; background: linear-gradient(135deg, #eff6ff, #eef2ff); }`,
    `.login-card { display: grid; grid-template-columns: 1.1fr 0.9fr; width: 100%; max-width: 1000px; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(15,23,42,0.12); }`,
    `.login-card__illustration { padding: 2rem; background: linear-gradient(135deg, #172554, #2563eb); color: #fff; display: flex; flex-direction: column; justify-content: space-between; }`,
    `.illustration__badge { align-self: flex-start; padding: 0.5rem 0.8rem; border-radius: 999px; background: rgba(255,255,255,0.16); font-size: 0.8rem; }`,
    `.illustration__panel { background: rgba(255,255,255,0.18); padding: 1.2rem; border-radius: 20px; }`,
    `.illustration__panel h2 { margin: 0.5rem 0; }`,
    `.login-card__form { padding: 2rem; display: flex; flex-direction: column; gap: 0.9rem; background: #fff; }`,
    `.login-card__form h1 { margin: 0; font-size: 1.8rem; }`,
    `.login-card__links { display: flex; gap: 0.6rem; font-size: 0.9rem; color: #64748b; }`,
    `@media (max-width: 768px) { .login-card { grid-template-columns: 1fr; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly router = inject(Router);

  goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }
}

