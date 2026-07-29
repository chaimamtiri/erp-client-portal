import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SupportService } from '../../Core/services/support.service';
import { Ticket, ticketCategories, ticketPriorities } from '../../Core/models/mock-data';

@Component({
  selector: 'app-ticket-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BreadcrumbComponent
  ],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketCreateComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly supportService: SupportService = inject(SupportService);

  protected ticketForm: FormGroup = this.fb.group({
    sujet: ['', [Validators.required, Validators.minLength(3)]],
    categorie: ['', Validators.required],
    priorite: ['normale', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  protected isSubmitting = signal<boolean>(false);

  protected readonly categories = ticketCategories;
  protected readonly priorities = ticketPriorities;

  protected onSubmit(): void {
    if (this.ticketForm.invalid || this.isSubmitting()) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.ticketForm.value;

    const newTicket: Omit<Ticket, 'id' | 'numero' | 'date_creation' | 'date_modification'> = {
      client_id: 1,
      utilisateur_id: 1,
      sujet: formValue.sujet,
      categorie: formValue.categorie,
      priorite: formValue.priorite,
      description: formValue.description,
      status: 'ouvert',
      est_supprime: false
    };

    this.supportService.addTicket(newTicket);
    this.isSubmitting.set(false);
    this.router.navigate(['/support']);
  }

  protected onCancel(): void {
    this.router.navigate(['/support']);
  }

  protected getErrorMessage(fieldName: string): string {
    const field = this.ticketForm.get(fieldName);
    if (!field || !field.invalid || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return 'Ce champ est requis';
    }

    if (field.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `Minimum ${requiredLength} caractères requis`;
    }

    if (field.hasError('email')) {
      return 'Email invalide';
    }

    return '';
  }
}
