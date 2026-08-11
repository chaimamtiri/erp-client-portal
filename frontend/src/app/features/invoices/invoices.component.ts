import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT, formatDate, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { InvoicesService } from '../../core/services/invoices.service';
import { Facture } from '../../core/models/mock-data';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

const LOCALE = 'fr-FR';
registerLocaleData(localeFr, LOCALE);

@Component({
  selector: 'app-invoices',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatChipsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesComponent {
  protected readonly invoicesService: InvoicesService = inject(InvoicesService);
  private readonly document: Document = inject(DOCUMENT);
  private readonly translate: TranslateService = inject(TranslateService);

  protected readonly displayedColumns = ['numero', 'customer', 'total_ttc', 'date_facture', 'est_solder', 'actions'];
  protected readonly dataSource = this.invoicesService.invoices;

  /** Génère un récapitulatif de facture téléchargeable à partir des données de la facture. */
  protected downloadInvoice(invoice: Facture): void {
    const content = [
      `Facture - ${invoice.numero}`,
      `Client : ${invoice.customer ?? ''}`,
      `Date : ${formatDate(invoice.date_facture, 'd MMMM y', this.currentLocale())}`,
      '',
      `Total HT : ${invoice.total_ht} EUR`,
      `TVA : ${invoice.total_tva} EUR`,
      `Total TTC : ${invoice.total_ttc} EUR`,
      `Montant réglé : ${invoice.montant_regle} EUR`,
      `Solde dû : ${invoice.solde_du} EUR`
    ].join('\n');

    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = `facture-${invoice.numero}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private currentLocale(): string {
    const lang = this.translate.currentLang();
    if (lang === 'en') return 'en-US';
    if (lang === 'ar') return 'ar';
    return LOCALE;
  }
}
