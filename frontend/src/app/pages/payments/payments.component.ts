import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { PaymentsService } from '../../Core/services/payments.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {
  protected readonly paymentsService: PaymentsService = inject(PaymentsService);

  protected readonly displayedColumns = ['numero', 'reference', 'montant_regle', 'date_paiement', 'est_encaisser'];
  protected readonly dataSource = this.paymentsService.payments;

  protected formatAmount(amount: number): string {
    return formatCurrency(amount, 'fr-FR', '€', 'EUR', '1.2-2');
  }

  protected formatPaymentDate(value: Date): string {
    return formatDate(value, 'dd/MM/yyyy', 'fr-FR');
  }
}
