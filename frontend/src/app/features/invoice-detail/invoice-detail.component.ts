import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { InvoicesService } from '../../core/services/invoices.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-detail',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent implements OnInit {
  protected readonly invoicesService: InvoicesService = inject(InvoicesService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly translate: TranslateService = inject(TranslateService);

  invoice: any;
  loading = true;
  notFound = false;

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.queryParamMap.get('invoiceId');
    if (!invoiceId) {
      this.loading = false;
      this.notFound = true;
      return;
    }

    // Try the cache first for instant render if the list was already loaded,
    // then always refresh from the server so deep links/refreshes work.
    this.invoice = this.invoicesService.getInvoiceById(Number(invoiceId));
    if (this.invoice) this.loading = false;

    this.invoicesService.fetchInvoiceById(Number(invoiceId)).subscribe({
      next: (inv) => {
        this.invoice = inv;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        if (!this.invoice) this.notFound = true;
      }
    });
  }

  formatDate(date: Date): string {
    const locale = this.translate.currentLang() === 'ar' ? 'ar' : this.translate.currentLang() === 'en' ? 'en-US' : 'fr-FR';
    return new Date(date).toLocaleDateString(locale);
  }

  downloadInvoice(): void {
    // TODO: Implement download functionality
    console.log('Downloading invoice:', this.invoice?.numero);
  }
}
