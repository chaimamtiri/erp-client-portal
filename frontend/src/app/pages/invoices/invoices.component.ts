import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { InvoicesService } from '../../Core/services/invoices.service';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatChipsModule, BreadcrumbComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
  protected readonly invoicesService: InvoicesService = inject(InvoicesService);

  protected readonly displayedColumns = ['numero', 'customer', 'total_ttc', 'date_facture', 'est_solder'];
  protected readonly dataSource = this.invoicesService.invoices;
}
