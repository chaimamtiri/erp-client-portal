import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { SupportService } from '../../core/services/support.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  imports: [
    MatCardModule, MatButtonModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule,
    BreadcrumbComponent, TranslatePipe
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent implements OnInit {
  protected readonly supportService: SupportService = inject(SupportService);
  private readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);

  protected readonly ticketList = this.supportService.tickets;
  protected readonly showForm = signal(false);
  protected readonly submitting = signal(false);

  protected readonly ticketForm = this.fb.group({
    sujet: ['', Validators.required],
    description: [''],
    categorie: [''],
    priorite: ['normale', Validators.required]
  });

  ngOnInit(): void {
    const clientId = this.profileService.profile()?.client_id ?? undefined;
    this.supportService.loadTickets(clientId ?? undefined).subscribe();
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  submitTicket(): void {
    if (this.ticketForm.invalid) return;
    this.submitting.set(true);
    this.supportService.addTicket(this.ticketForm.getRawValue() as any).subscribe({
      next: () => {
        this.ticketForm.reset({ priorite: 'normale' });
        this.showForm.set(false);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ouvert: 'SUPPORT.STATUS.OPEN',
      en_cours: 'SUPPORT.STATUS.IN_PROGRESS',
      resolu: 'SUPPORT.STATUS.RESOLVED',
      ferme: 'SUPPORT.STATUS.CLOSED'
    };
    return map[status] ?? this.supportService.getStatusLabel(status);
  }

  priorityKey(priority: string): string {
    const map: Record<string, string> = {
      basse: 'SUPPORT.PRIORITY.LOW',
      normale: 'SUPPORT.PRIORITY.NORMAL',
      haute: 'SUPPORT.PRIORITY.HIGH',
      urgente: 'SUPPORT.PRIORITY.URGENT'
    };
    return map[priority] ?? priority;
  }
}
