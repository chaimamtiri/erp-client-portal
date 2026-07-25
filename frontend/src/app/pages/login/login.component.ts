import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordStrengthValidator } from '../../shared/validators/password.validator';
import { AuthService } from '../../services/auth.service';

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
  private readonly authService = inject(AuthService);

  mode = signal<'login' | 'register'>('login');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  formSubmitted = false;
  isLoading = signal(false);
  backendErrors = signal<string[] | null>(null);

  loginForm: FormGroup = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ['']
  }, {
    validators: (group: AbstractControl): ValidationErrors | null => {
      if (this.mode() === 'register') {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
      }
      return null;
    }
  });

  // Getters simples pour faciliter l'accès dans le template HTML
  get name(): AbstractControl | null {
    return this.loginForm.get('name');
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.loginForm.get('confirmPassword');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }

  setMode(newMode: 'login' | 'register'): void {
    this.mode.set(newMode);
    this.formSubmitted = false;
    this.backendErrors.set(null);
    this.loginForm.reset({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const nameControl = this.loginForm.get('name');
    const confirmPasswordControl = this.loginForm.get('confirmPassword');

    if (newMode === 'register') {
      nameControl?.setValidators([Validators.required]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      nameControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
    }

    nameControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
    this.loginForm.updateValueAndValidity();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    const isMismatch = fieldName === 'confirmPassword' && this.loginForm.errors?.['passwordMismatch'];
    return (!!field && field.invalid && (field.touched || this.formSubmitted)) || (!!isMismatch && (field?.touched || this.formSubmitted));
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.backendErrors.set(null);

    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.loginForm.value;

      if (this.mode() === 'login') {
        this.authService.login(email, password).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            console.log('Connexion réussie ! Saisie :', res);
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.isLoading.set(false);
            if (err.error?.errors) {
              this.backendErrors.set(err.error.errors);
            } else {
              this.backendErrors.set(['Une erreur inconnue est survenue lors de la connexion.']);
            }
          }
        });
      } else {
        this.authService.register(name, email, password).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            console.log('Inscription réussie ! Saisie :', res);
            // Simulation d'une connexion automatique après inscription
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.isLoading.set(false);
            if (err.error?.errors) {
              this.backendErrors.set(err.error.errors);
            } else {
              this.backendErrors.set(['Une erreur inconnue est survenue lors de l\'inscription.']);
            }
          }
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

