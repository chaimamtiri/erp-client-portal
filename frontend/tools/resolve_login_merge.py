from pathlib import Path

files = {
    'src/app/app.routes.ts': """import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, noAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [noAuthGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent) },
      { path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent) },
      { path: 'orders/detail', loadComponent: () => import('./pages/order-detail/order-detail.component').then((m) => m.OrderDetailComponent) },
      { path: 'invoices', loadComponent: () => import('./pages/invoices/invoices.component').then((m) => m.InvoicesComponent) },
      { path: 'invoices/detail', loadComponent: () => import('./pages/invoice-detail/invoice-detail.component').then((m) => m.InvoiceDetailComponent) },
      { path: 'payments', loadComponent: () => import('./pages/payments/payments.component').then((m) => m.PaymentsComponent) },
      { path: 'deliveries', loadComponent: () => import('./pages/deliveries/deliveries.component').then((m) => m.DeliveriesComponent) },
      { path: 'documents', loadComponent: () => import('./pages/documents/documents.component').then((m) => m.DocumentsComponent) },
      { path: 'support', loadComponent: () => import('./pages/support/support.component').then((m) => m.SupportComponent) },
      { path: 'support/detail', loadComponent: () => import('./pages/ticket-detail/ticket-detail.component').then((m) => m.TicketDetailComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
      { path: 'addresses', redirectTo: 'profile' },
      { path: 'activity', loadComponent: () => import('./pages/activity/activity.component').then((m) => m.ActivityComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
""",

    'src/app/core/services/auth.service.ts': """import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  validatePasswordBackend(password: string): string[] {
    const errors: string[] = [];

    if (password.length !== 12) {
      errors.push('Le mot de passe doit faire exactement 12 caractères.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre.');
    }

    return errors;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const validationErrors = this.validatePasswordBackend(password);

    if (validationErrors.length > 0) {
      return throwError(() => ({
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: 'Erreur de validation du mot de passe (Serveur)',
          errors: validationErrors
        }
      })).pipe(delay(500));
    }

    return of({
      success: true,
      message: 'Connexion réussie !',
      token: 'mock-jwt-token-xyz',
      user: {
        name: 'Claire Martin',
        email
      }
    }).pipe(
      delay(500),
      tap((res) => {
        if (res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        }
      })
    );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const validationErrors = this.validatePasswordBackend(password);

    if (validationErrors.length > 0) {
      return throwError(() => ({
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: 'Erreur de validation du mot de passe (Serveur)',
          errors: validationErrors
        }
      })).pipe(delay(500));
    }

    return of({
      success: true,
      message: 'Inscription réussie !',
      token: 'mock-jwt-token-new',
      user: {
        name,
        email
      }
    }).pipe(
      delay(500),
      tap((res) => {
        if (res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
""",

    'src/app/pages/login/login.component.ts': """import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { passwordStrengthValidator } from '../../shared/validators/password.validator';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  protected readonly languageService: LanguageService = inject(LanguageService);

  currentLanguage = signal(this.languageService.currentLanguage());
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

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

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

  setLanguage(languageCode: 'fr' | 'en' | 'ar'): void {
    this.languageService.setLanguage(languageCode);
    this.currentLanguage.set(languageCode);
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
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/dashboard']);
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
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/dashboard']);
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

  openPrototype(): void {
    this.router.navigate(['/dashboard'], { queryParams: { preview: true } });
  }
}
""",

    'src/app/pages/login/login.component.html': """<div class=\"login-shell\">
  <div class=\"login-language-switcher\">
    <button
      mat-stroked-button
      type=\"button\"
      class=\"login-language-switcher__trigger\"
      [matMenuTriggerFor]=\"languageMenu\"
      [attr.aria-label]=\"'LANGUAGE.SWITCHER_ARIA' | translate\"
    >
      <mat-icon>language</mat-icon>
      <span class=\"login-language-switcher__code\">{{ currentLanguage().toUpperCase() }}</span>
      <mat-icon class=\"login-language-switcher__chevron\">expand_more</mat-icon>
    </button>

    <mat-menu #languageMenu=\"matMenu\" class=\"login-language-switcher__menu\">
      @for (language of languageService.languages; track language.code) {
        <button mat-menu-item type=\"button\" (click)=\"setLanguage(language.code)\" [class.is-active]=\"currentLanguage() === language.code\">
          <span class=\"login-language-switcher__option-code\">{{ language.code.toUpperCase() }}</span>
          <span class=\"login-language-switcher__option-label\">{{ language.labelKey | translate }}</span>
        </button>
      }
    </mat-menu>
  </div>

  <div class=\"login-card\">
    <div class=\"auth-tabs\">
      <button type=\"button\" class=\"auth-tab\" [class.active]=\"mode() === 'login'\" (click)=\"setMode('login')\">
        <span>{{ 'LOGIN.TAB_LOGIN' | translate }}</span>
      </button>
      <button type=\"button\" class=\"auth-tab\" [class.active]=\"mode() === 'register'\" (click)=\"setMode('register')\">
        <span>{{ 'LOGIN.TAB_REGISTER' | translate }}</span>
      </button>
    </div>

    @if (backendErrors()) {
      <div class=\"backend-error-alert animate-shake\">
        <div class=\"alert-icon\">
          <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">
            <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>
            <line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line>
            <line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line>
          </svg>
        </div>
        <div class=\"alert-content\">
          <strong>{{ 'LOGIN.ERRORS.TITLE' | translate }}</strong>
          <ul>
            @for (error of backendErrors(); track error) {
              <li>{{ error }}</li>
            }
          </ul>
        </div>
      </div>
    }

    <form class=\"form-body\" [formGroup]=\"loginForm\" (ngSubmit)=\"onSubmit()\">
      @if (mode() === 'register') {
        <div class=\"form-group animate-fade-in\">
          <label class=\"sr-only\" for=\"name\">{{ 'LOGIN.NAME_PLACEHOLDER' | translate }}</label>
          <input id=\"name\" type=\"text\" formControlName=\"name\" class=\"form-input\" placeholder=\"{{ 'LOGIN.NAME_PLACEHOLDER' | translate }}\" />
          @if (isFieldInvalid('name')) {
            <span class=\"error-message\">{{ 'LOGIN.ERRORS.NAME_REQUIRED' | translate }}</span>
          }
        </div>
      }

      <div class=\"form-group\">
        <label class=\"sr-only\" for=\"email\">{{ 'LOGIN.EMAIL_PLACEHOLDER' | translate }}</label>
        <input id=\"email\" type=\"email\" formControlName=\"email\" class=\"form-input\" placeholder=\"{{ 'LOGIN.EMAIL_PLACEHOLDER' | translate }}\" required />
        @if (isFieldInvalid('email')) {
          <span class=\"error-message\">
            @if (loginForm.get('email')?.errors?.['required']) {
              {{ 'LOGIN.ERRORS.EMAIL_REQUIRED' | translate }}
            } @else if (loginForm.get('email')?.errors?.['email']) {
              {{ 'LOGIN.ERRORS.EMAIL_INVALID' | translate }}
            }
          </span>
        }
      </div>

      <div class=\"form-group\">
        <label class=\"sr-only\" for=\"password\">{{ 'LOGIN.PASSWORD_PLACEHOLDER' | translate }}</label>
        <input [type]=\"showPassword() ? 'text' : 'password'\" id=\"password\" formControlName=\"password\" class=\"form-input\" placeholder=\"{{ 'LOGIN.PASSWORD_PLACEHOLDER' | translate }}\" required />
        <button type=\"button\" class=\"password-toggle\" (click)=\"togglePasswordVisibility()\" [attr.aria-label]=\"'LOGIN.PASSWORD_TOGGLE_ARIA' | translate\">
          <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        @if (isFieldInvalid('password')) {
          <span class=\"error-message\">{{ 'LOGIN.ERRORS.PASSWORD_REQUIRED' | translate }}</span>
        }
      </div>

      @if (mode() === 'register') {
        <div class=\"form-group\">
          <label class=\"sr-only\" for=\"confirmPassword\">{{ 'LOGIN.CONFIRM_PASSWORD_PLACEHOLDER' | translate }}</label>
          <input [type]=\"showConfirmPassword() ? 'text' : 'password'\" id=\"confirmPassword\" formControlName=\"confirmPassword\" class=\"form-input\" placeholder=\"{{ 'LOGIN.CONFIRM_PASSWORD_PLACEHOLDER' | translate }}\" required />
          <button type=\"button\" class=\"password-toggle\" (click)=\"toggleConfirmPasswordVisibility()\" [attr.aria-label]=\"'LOGIN.PASSWORD_TOGGLE_ARIA' | translate\">
            <mat-icon>{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (isFieldInvalid('confirmPassword')) {
            <span class=\"error-message\">{{ 'LOGIN.ERRORS.CONFIRM_PASSWORD_REQUIRED' | translate }}</span>
          }
        </div>
      }

      <button type=\"submit\" mat-flat-button color=\"primary\" class=\"submit-button\" [disabled]=\"isLoading()\">
        {{ mode() === 'login' ? ('LOGIN.BUTTON_LOGIN' | translate) : ('LOGIN.BUTTON_REGISTER' | translate) }}
      </button>
    </form>
  </div>
</div>
"""
}

for relative_path, content in files.items():
    path = Path(relative_path)
    path.write_text(content, encoding='utf-8')
    print(f'WROTE {relative_path}')
