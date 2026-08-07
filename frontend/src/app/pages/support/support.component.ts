import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { SupportService } from '../../core/services/support.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatChipsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent {
  protected readonly supportService: SupportService = inject(SupportService);

  protected readonly ticketList = this.supportService.tickets;

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