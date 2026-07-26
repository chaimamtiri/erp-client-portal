import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, BreadcrumbComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent {
  protected readonly paymentsService: PaymentsService = inject(PaymentsService);

  protected readonly displayedColumns = ['numero', 'reference', 'montant_regle', 'date_paiement', 'est_encaisser'];
  protected readonly dataSource = this.paymentsService.payments;
}
