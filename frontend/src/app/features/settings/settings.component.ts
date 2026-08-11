import { ChangeDetectionStrategy, Component, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    BreadcrumbComponent,
    TranslatePipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  protected readonly theme: ThemeService = inject(ThemeService);
  protected readonly languageService: LanguageService = inject(LanguageService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly translate: TranslateService = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  // Form Controls
  languageControl = this.fb.control(this.languageService.currentLanguage());
  emailOrderControl = this.fb.control(true);
  emailInvoiceControl = this.fb.control(true);

  securityForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  private readonly syncLanguageControl = effect(() => {
    this.languageControl.setValue(this.languageService.currentLanguage(), { emitEvent: false });
  });

  ngOnInit(): void {
    this.languageControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        if (lang) {
          this.languageService.setLanguage(lang);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  savePassword(): void {
    if (this.securityForm.valid) {
      alert(this.translate.instant('SETTINGS.SECURITY.SUCCESS_MESSAGE'));
      this.securityForm.reset();
    }
  }
}
