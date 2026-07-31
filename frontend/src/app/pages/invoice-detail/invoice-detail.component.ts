import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { InvoicesService } from '../../Core/services/invoices.service';
import { Facture, orderLines } from '../../Core/models/mock-data';

interface InvoiceLine {
  id: number;
  designation: string;
  reference: string;
  quantite: number;
  prix_unitaire_ht: number;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  tva_rate: number;
}

@Component({
  selector: 'app-invoice-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent implements OnInit {
  protected readonly invoicesService: InvoicesService = inject(InvoicesService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  protected readonly invoice = signal<Facture | null>(null);
  protected readonly invoiceLines = signal<InvoiceLine[]>([]);
  protected readonly dueDate = signal<Date | null>(null);

  protected readonly statusClass = computed(() => {
    const inv = this.invoice();
    if (!inv) return '';
    const status = inv.statusLibelle || (inv.est_solder ? 'Payée' : 'En attente');
    return status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  });

  protected readonly vatBreakdown = computed(() => {
    const lines = this.invoiceLines();
    const breakdown = new Map<number, { ht: number; tva: number }>();
    for (const line of lines) {
      const rate = line.tva_rate;
      const current = breakdown.get(rate) || { ht: 0, tva: 0 };
      current.ht += line.total_ht;
      current.tva += line.total_tva;
      breakdown.set(rate, current);
    }
    return Array.from(breakdown.entries())
      .map(([rate, value]) => ({
        rate,
        ht: value.ht,
        tva: value.tva
      }))
      .sort((a, b) => b.rate - a.rate);
  });

  protected readonly paymentInfo = computed(() => {
    const inv = this.invoice();
    if (!inv) return null;

    if (inv.est_solder) {
      return {
        method: inv.id % 2 === 0 ? 'Carte bancaire' : 'Virement bancaire',
        date: new Date(new Date(inv.date_facture).getTime() + 2 * 24 * 60 * 60 * 1000), // +2 jours
        reference: `TXN-${100000 + inv.id}`,
        confirmed: true
      };
    } else if (inv.montant_regle > 0) {
      return {
        method: 'Virement bancaire',
        date: new Date(new Date(inv.date_facture).getTime() + 1 * 24 * 60 * 60 * 1000), // +1 jour pour l'acompte
        reference: `TXN-${100000 + inv.id}`,
        confirmed: false,
        amountPaid: inv.montant_regle
      };
    } else {
      return {
        method: 'Virement bancaire',
        date: null,
        reference: null,
        confirmed: false
      };
    }
  });

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.queryParamMap.get('invoiceId');
    if (invoiceId) {
      const inv = this.invoicesService.getInvoiceById(Number(invoiceId));
      if (inv) {
        this.invoice.set(inv);
        
        // Calcul de la date d'échéance : date_facture + 30 jours
        const date = new Date(inv.date_facture);
        date.setDate(date.getDate() + 30);
        this.dueDate.set(date);

        // Association et calcul proportionnel des lignes de facture
        const totalHt = inv.total_ht;
        const totalTva = inv.total_tva;
        const rawLines = orderLines.filter(line => line.commande_id === inv.id && !line.est_supprime);
        
        const mappedLines = rawLines.map(line => {
          const lineHt = line.quantite * line.prix_unitaire_ht;
          const prop = totalHt > 0 ? (lineHt / totalHt) : 0;
          const lineTva = totalTva * prop;
          const lineTtc = lineHt + lineTva;
          const tvaRate = lineHt > 0 ? Math.round((lineTva / lineHt) * 1000) / 10 : 20.0;
          
          return {
            id: line.id,
            designation: line.designation,
            reference: line.reference,
            quantite: line.quantite,
            prix_unitaire_ht: line.prix_unitaire_ht,
            total_ht: lineHt,
            total_tva: lineTva,
            total_ttc: lineTtc,
            tva_rate: tvaRate
          };
        });

        this.invoiceLines.set(mappedLines);
      }
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/invoices']);
  }

  printInvoice(): void {
    window.print();
  }

  downloadPDF(): void {
    const inv = this.invoice();
    const lines = this.invoiceLines();
    const due = this.dueDate();
    const pay = this.paymentInfo();
    const vats = this.vatBreakdown();
    if (!inv) return;

    const itemsStr = lines.map(line =>
      `- ${line.designation} (${line.reference}) | Qté: ${line.quantite} | HT: ${line.total_ht.toFixed(2)}€ | TVA: ${line.tva_rate}% (${line.total_tva.toFixed(2)}€) | TTC: ${line.total_ttc.toFixed(2)}€`
    ).join('\n');

    const vatBreakdownStr = vats.map(v =>
      `  Taux ${v.rate}% | Base HT: ${v.ht.toFixed(2)} EUR | TVA: ${v.tva.toFixed(2)} EUR`
    ).join('\n');

    const paymentDetailsStr = pay?.confirmed 
      ? `CONFIRMATION DE RÈGLEMENT :
  Statut          : Facture Acquittée (Payée)
  Mode de paiement: ${pay.method}
  Date règlement  : ${this.formatDate(pay.date)}
  Référence trans.: ${pay.reference}`
      : `COORDONNÉES BANCAIRES POUR LE RÈGLEMENT :
  Mode de paiement: ${pay?.method || 'Virement bancaire'}
  Banque          : Société Générale Paris
  IBAN            : FR76 3000 6000 0123 4567 8901 234
  BIC/SWIFT       : ERPSFR2PXXX
  Reste à payer   : ${inv.solde_du.toFixed(2)} EUR`;

    const content = [
      `==================================================`,
      `            FACTURE D'ACHAT : ${inv.numero}`,
      `==================================================`,
      `Date d'émission : ${this.formatDate(inv.date_facture)}`,
      `Date d'échéance : ${this.formatDate(due)}`,
      `Statut          : ${inv.statusLibelle || (inv.est_solder ? 'Payée' : 'En attente')}`,
      `--------------------------------------------------`,
      `FOURNISSEUR :`,
      `  ERP Solutions Europe SAS`,
      `  45 Avenue de la Technologie, 75008 Paris`,
      `  TVA : FR 89 123456789`,
      `  Siret : 123 456 789 00012`,
      `--------------------------------------------------`,
      `CLIENT :`,
      `  ${inv.customer || 'Acme SAS'}`,
      `  Claire Martin (Responsable achats)`,
      `  12 Rue de l'Innovation, 69002 Lyon, France`,
      `  TVA : FR 42 987654321`,
      `  E-mail : claire.martin@acme.com`,
      `--------------------------------------------------`,
      `ARTICLES & SERVICES :`,
      itemsStr,
      `--------------------------------------------------`,
      `RÉCAPITULATIF FINANCIER :`,
      `  Sous-total HT  : ${inv.total_ht.toFixed(2)} EUR`,
      `  Total TVA      : ${inv.total_tva.toFixed(2)} EUR`,
      vatBreakdownStr ? `\n  VENTILATION TVA :\n${vatBreakdownStr}` : '',
      `  Total TTC      : ${inv.total_ttc.toFixed(2)} EUR`,
      `  Montant réglé  : ${inv.montant_regle.toFixed(2)} EUR`,
      `  Reste à payer  : ${inv.solde_du.toFixed(2)} EUR`,
      `--------------------------------------------------`,
      paymentDetailsStr,
      `==================================================`
    ].filter(Boolean).join('\n');

    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${inv.numero}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    this.snackBar.open('La facture a été téléchargée en format texte structuré.', 'Fermer', { duration: 3000 });
  }

  sendEmail(): void {
    const inv = this.invoice();
    if (!inv) return;
    this.snackBar.open(`La facture ${inv.numero} a été envoyée par e-mail à claire.martin@acme.com`, 'Fermer', { duration: 4000 });
  }
}
