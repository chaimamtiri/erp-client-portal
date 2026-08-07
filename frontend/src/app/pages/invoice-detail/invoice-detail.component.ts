import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { InvoicesService } from '../../core/services/invoices.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
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

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.queryParamMap.get('invoiceId');
    if (invoiceId) {
      this.invoice = this.invoicesService.getInvoiceById(Number(invoiceId));
    }
  }

  formatDate(date: Date): string {
    const currentLang = this.translate.currentLang;
    const lang = typeof currentLang === 'function' ? currentLang() : currentLang;
    const locale = lang === 'ar' ? 'ar' : lang === 'en' ? 'en-US' : 'fr-FR';
    return new Date(date).toLocaleDateString(locale);
  }

  downloadInvoice(): void {
    // TODO: Implement download functionality
    console.log('Downloading invoice:', this.invoice?.numero);
  }
}

