// payments.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { PaymentsService } from '../../core/services/payments.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent implements OnInit {
  protected readonly paymentsService: PaymentsService = inject(PaymentsService);
  private readonly profileService = inject(ProfileService);

  protected readonly displayedColumns = ['numero', 'reference', 'montant_regle', 'date_paiement', 'est_encaisser'];
  protected readonly dataSource = this.paymentsService.payments;

  ngOnInit(): void {
    const clientId = this.profileService.profile()?.client_id ?? undefined;
    this.paymentsService.loadPayments(clientId);
  }

  protected formatAmount(amount: number): string {
    return formatCurrency(amount, 'fr-FR', '€', 'EUR', '1.2-2');
  }

  protected formatPaymentDate(value: Date): string {
    return formatDate(value, 'dd/MM/yyyy', 'fr-FR');
  }
}
