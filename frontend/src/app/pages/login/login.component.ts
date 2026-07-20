import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  showPassword = signal(false);
  formSubmitted = false;

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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.touched || this.formSubmitted);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      console.log('Connexion réussie ! Saisie :', this.loginForm.value);
      // Simulation d'une redirection après connexion réussie
      this.router.navigateByUrl('/dashboard');
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
