import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from '../../Core/services/language.service';
import { AuthService } from '../../Core/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  protected readonly languageService: LanguageService = inject(LanguageService);

  currentLanguage = signal(this.languageService.currentLanguage());

  showPassword = signal(false);
  formSubmitted = false;
  loginError = signal('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Getters simples pour faciliter l'accès dans le template HTML
  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  setLanguage(languageCode: 'fr' | 'en' | 'ar'): void {
    this.languageService.setLanguage(languageCode);
    this.currentLanguage.set(languageCode);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.touched || this.formSubmitted);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.loginError.set('');

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: () => this.loginError.set('Identifiants invalides ou service indisponible.')
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  openPrototype(): void {
    this.router.navigate(['/dashboard'], { queryParams: { preview: true } });
  }
}
