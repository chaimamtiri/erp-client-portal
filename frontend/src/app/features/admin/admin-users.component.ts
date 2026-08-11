import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService, RegisterRequest } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-users',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  readonly isSubmitting = signal(false);
  readonly feedbackMessage = signal<string | null>(null);
  readonly feedbackType = signal<'success' | 'error'>('success');

  readonly accountForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    nom: ['', [Validators.required]],
    role: ['ROLE_USER', [Validators.required]]
  });

  submit(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.feedbackMessage.set(null);

    const payload: RegisterRequest = {
      email: this.accountForm.value.email.trim().toLowerCase(),
      password: this.accountForm.value.password,
      nom: this.accountForm.value.nom.trim(),
      roles: this.accountForm.value.role
    };

    this.authService.register(payload).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response) => {
        this.feedbackType.set('success');
        this.feedbackMessage.set(response.message ?? this.translate.instant('ADMIN.USERS.SUCCESS'));
        this.accountForm.reset({ email: '', password: '', nom: '', role: 'ROLE_USER' });
      },
      error: (error) => {
        this.feedbackType.set('error');
        this.feedbackMessage.set(error?.error?.error ?? this.translate.instant('ADMIN.USERS.ERROR'));
      }
    });
  }
}
