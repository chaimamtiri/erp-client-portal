import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SupportService } from '../../Core/services/support.service';

@Component({
  selector: 'app-support',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, BreadcrumbComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent {
  protected readonly supportService: SupportService = inject(SupportService);

  protected readonly ticketList = this.supportService.tickets;

  statusLabel(status: string): string {
    return this.supportService.getStatusLabel(status);
  }
}
