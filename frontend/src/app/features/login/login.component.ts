import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService, LanguageCode } from '../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly languageService = inject(LanguageService);
  get currentLanguage() {
  return this.languageService.currentLanguage;
}

  loading = signal(false);
  loginError = signal<string | null>(null);
  showPassword = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['admin@erp.local', [Validators.required, Validators.email]],
    password: ['Admin123456789', [Validators.required, Validators.minLength(8)]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  setLanguage(lang: LanguageCode): void {
    this.languageService.setLanguage(lang);
  }

  openPrototype(): void {
    // Replace with your actual prototype link or modal
    window.open('https://www.figma.com', '_blank');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.loginError.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.loading.set(false);
        console.log('Logged in as', res.user.nom);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.loginError.set(err.error?.msg || err.error?.error || 'Login failed');
      }
    });
  }
}
