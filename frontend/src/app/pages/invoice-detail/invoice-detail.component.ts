import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { InvoicesService } from '../../Core/services/invoices.service';

@Component({
  selector: 'app-invoice-detail',
  imports: [MatCardModule, MatIconModule, MatButtonModule, BreadcrumbComponent],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent implements OnInit {
  protected readonly invoicesService: InvoicesService = inject(InvoicesService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  invoice: any;

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.queryParamMap.get('invoiceId');
    if (invoiceId) {
      this.invoice = this.invoicesService.getInvoiceById(Number(invoiceId));
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  downloadInvoice(): void {
    // TODO: Implement download functionality
    console.log('Downloading invoice:', this.invoice?.numero);
  }
}

