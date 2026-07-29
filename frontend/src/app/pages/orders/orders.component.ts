import { ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT, formatDate, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { orders, orderLines, orderTracking, deliveries, Commande, LigneCommande, BonLivraison, EtapeCommande } from '../../core/models/mock-data';
import { CartService } from '../../core/services/cart.service';

type StepStatus = 'done' | 'active' | 'pending' | 'canceled';

interface TimelineStep {
  key: EtapeCommande;
  title: string;
  icon: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  status: StepStatus;
}

interface StepDefinition {
  key: EtapeCommande;
  title: string;
  icon: string;
  fallback: string;
}

/** Étapes du suivi, dans l'ordre d'avancement (style e-commerce). */
const STEP_DEFINITIONS: readonly StepDefinition[] = [
  { key: 'commande', title: 'Commande passée', icon: 'shopping_cart', fallback: 'Commande enregistrée.' },
  { key: 'paiement', title: 'Paiement confirmé', icon: 'verified', fallback: 'En attente du règlement.' },
  { key: 'preparation', title: 'Préparation', icon: 'inventory_2', fallback: 'Préparation à venir.' },
  { key: 'expediee', title: 'Expédiée', icon: 'local_shipping', fallback: 'Remise au transporteur à venir.' },
  { key: 'centre_local', title: 'Arrivée au centre local', icon: 'location_on', fallback: 'Acheminement vers le centre local.' },
  { key: 'en_livraison', title: 'En cours de livraison', icon: 'delivery_dining', fallback: 'Livraison à programmer.' },
  { key: 'livree', title: 'Livrée', icon: 'home', fallback: 'Colis non encore livré.' }
];

const CANCELED_STEP: StepDefinition = { key: 'annulee', title: 'Annulée', icon: 'cancel', fallback: 'Commande annulée.' };

/** Nombre d'étapes atteintes selon le statut de la commande. */
const STATUS_PROGRESS: Record<string, number> = {
  'Confirmée': 1,
  'En cours': 3,
  'Expédiée': 5,
  'En livraison': 6,
  'Livrée': 7
};

const LOCALE = 'fr-FR';
registerLocaleData(localeFr, LOCALE);

@Component({
  selector: 'app-orders',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatDividerModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, FormsModule, BreadcrumbComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  private readonly cartService: CartService = inject(CartService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly document: Document = inject(DOCUMENT);

  protected readonly displayedColumns = ['numero', 'clientNom', 'date_commande', 'total_ttc', 'est_valider', 'est_solder', 'statusLibelle'];

  protected readonly allOrders = computed<Commande[]>(() => {
    const cartOrders = this.cartService.getOrders().map(order => ({
      ...order,
      clientNom: 'Acme SAS',
      dateCommande: order.date_commande,
      totalTTC: order.total_ttc,
      totalHT: order.total_ht,
      totalTVA: order.total_tva,
      estValider: order.est_valider,
      estSolder: order.est_solder,
      montantRegle: order.montant_regle,
      soldeDu: order.solde_du,
      lignes: this.toOrderLines(order)
    }));
    return [...orders, ...cartOrders];
  });

  protected searchTerm = signal('');
  protected validationFilter = signal<boolean | ''>('');
  protected paymentFilter = signal<boolean | ''>('');
  protected statusFilter = signal('');

  protected readonly filteredOrders = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const validation = this.validationFilter();
    const payment = this.paymentFilter();
    const status = this.statusFilter();

    return this.allOrders().filter(order => {
      const clientNom = order.clientNom ?? '';
      if (search && !order.numero.toLowerCase().includes(search) && !clientNom.toLowerCase().includes(search)) {
        return false;
      }
      if (validation !== '' && order.est_valider !== validation) {
        return false;
      }
      if (payment !== '' && order.est_solder !== payment) {
        return false;
      }
      if (status && order.statusLibelle !== status) {
        return false;
      }
      return true;
    });
  });

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.validationFilter.set('');
    this.paymentFilter.set('');
    this.statusFilter.set('');
  }

  @ViewChild('timelineTpl') private readonly timelineTpl!: TemplateRef<unknown>;
  private dialogRef: ReturnType<MatDialog['open']> | null = null;

  protected selectedOrder = signal<Commande | null>(null);

  protected goToProducts(): void {
    this.router.navigate(['/products']);
  }

  protected openTimeline(order: Commande): void {
    this.selectedOrder.set(order);
    this.dialogRef = this.dialog.open(this.timelineTpl, {
      width: '820px',
      maxWidth: '96vw',
      panelClass: 'timeline-dialog-panel',
      autoFocus: false
    });
    this.dialogRef.afterClosed().subscribe(() => this.selectedOrder.set(null));
  }

  protected closeTimeline(): void {
    this.dialogRef?.close();
  }

  /** Articles de la commande sélectionnée (mock-data ou panier). */
  protected readonly orderItems = computed<LigneCommande[]>(() => {
    const order = this.selectedOrder();
    if (!order) return [];
    return order.lignes ?? orderLines.filter(line => line.commande_id === order.id && !line.est_supprime);
  });

  protected readonly itemsCount = computed(() =>
    this.orderItems().reduce((sum, line) => sum + line.quantite, 0)
  );

  protected readonly itemsSubtotal = computed(() =>
    this.orderItems().reduce((sum, line) => sum + line.total_ht, 0)
  );

  /** Bon de livraison associé à la commande sélectionnée. */
  protected readonly delivery = computed<BonLivraison | null>(() => {
    const order = this.selectedOrder();
    if (!order) return null;
    return deliveries.find(item => item.order === order.numero) ?? null;
  });

  protected readonly timelineSteps = computed<TimelineStep[]>(() => {
    const order = this.selectedOrder();
    if (!order) return [];

    const events = new Map(
      orderTracking
        .filter(event => event.commande_numero === order.numero)
        .map(event => [event.etape, event] as const)
    );
    const reached = this.reachedSteps(order);
    const isCanceled = order.statusLibelle === 'Annulée';

    const steps = STEP_DEFINITIONS.map((definition, index) => {
      let status: StepStatus = 'pending';
      if (index < reached) {
        status = 'done';
      } else if (index === reached && !isCanceled) {
        status = 'active';
      }
      return this.toTimelineStep(definition, status, events.get(definition.key)?.date ?? null, events.get(definition.key)?.description);
    });

    const visible = isCanceled ? steps.slice(0, reached) : steps;
    if (!isCanceled) {
      return visible;
    }
    const canceledDate = events.get('annulee')?.date ?? null;
    return [...visible, this.toTimelineStep(CANCELED_STEP, 'canceled', canceledDate, events.get('annulee')?.description)];
  });

  protected trackParcel(): void {
    this.closeTimeline();
    this.router.navigate(['/deliveries']);
  }

  /** Génère un récapitulatif de facture téléchargeable à partir des données mock. */
  protected downloadInvoice(): void {
    const order = this.selectedOrder();
    if (!order) return;

    const lines = this.orderItems().map(
      line => `${line.reference}\t${line.designation}\tx${line.quantite}\t${line.prix_unitaire_ht} EUR\t${line.total_ht} EUR`
    );
    const content = [
      `Facture - Commande ${order.numero}`,
      `Client : ${order.clientNom ?? ''}`,
      `Date : ${this.formatDay(order.date_commande)}`,
      '',
      'Reference\tDesignation\tQte\tPU HT\tTotal HT',
      ...lines,
      '',
      `Total HT : ${order.total_ht} EUR`,
      `TVA : ${order.total_tva} EUR`,
      `Total TTC : ${order.total_ttc} EUR`,
      `Montant réglé : ${order.montant_regle} EUR`,
      `Solde dû : ${order.solde_du} EUR`
    ].join('\n');

    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = `facture-${order.numero}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private toTimelineStep(definition: StepDefinition, status: StepStatus, date: Date | null, description?: string): TimelineStep {
    return {
      key: definition.key,
      title: definition.title,
      icon: definition.icon,
      description: description ?? definition.fallback,
      dateLabel: date ? this.formatDay(date) : '',
      timeLabel: date ? formatDate(date, 'HH:mm', LOCALE) : '',
      status
    };
  }

  private formatDay(date: Date): string {
    return formatDate(date, 'd MMMM y', LOCALE);
  }

  /** Étapes déjà franchies, dérivées des champs métier de la commande. */
  private reachedSteps(order: Commande): number {
    const fromStatus = STATUS_PROGRESS[order.statusLibelle ?? ''] ?? 1;
    const fromPayment = order.est_valider || order.est_solder ? 2 : 1;
    return Math.min(Math.max(fromStatus, fromPayment), STEP_DEFINITIONS.length);
  }

  private toOrderLines(order: { id: number; items?: { id: number; nom: string; reference: string; prix_vente_ht?: number; image?: string; quantity: number }[] }): LigneCommande[] {
    return (order.items ?? []).map((item, index) => {
      const unitPrice = item.prix_vente_ht ?? 0;
      return {
        id: index + 1,
        commande_id: order.id,
        article_id: item.id,
        designation: item.nom,
        reference: item.reference,
        quantite: item.quantity,
        prix_unitaire_ht: unitPrice,
        total_ht: unitPrice * item.quantity,
        image: item.image,
        est_supprime: false
      };
    });
  }
}
