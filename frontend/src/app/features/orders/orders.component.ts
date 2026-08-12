import { ChangeDetectionStrategy, Component, signal, computed, inject, effect, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, formatCurrency, formatDate, registerLocaleData } from '@angular/common';
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
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
// NOTE: orderTracking and deliveries remain mock-sourced — commande_bp has no
// tracking-event or delivery-linkage data yet (confirmed by reading commande.py:
// GET / and GET /<id> only return order fields + nested `articles` line items,
// nothing resembling etape/date/description events). The timeline dialog below
// is therefore intentionally left un-migrated. `orders` mock array is no longer
// used directly (replaced by real data) — only types are imported here now.
// NOTE: delivery/BonLivraison intentionally removed — BonLivraison has no
// foreign key back to Commande in the schema (only tier_id, status_id), so
// there is no real query that links an order to a delivery record. Rather
// than guess a match (e.g. by numero string), the delivery card is removed
// from the timeline dialog entirely until the backend adds that link.
import { Commande, LigneCommande, EtapeCommande } from '../../core/services/api-config.service';
import { CartService } from '../../core/services/cart.service';
import { OrdersService, OrderListItem, OrderArticle, OrderTrackingEvent } from '../../core/services/orders.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

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

const LOCALE = 'fr-FR';
registerLocaleData(localeFr, LOCALE);

@Component({
  selector: 'app-orders',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatDividerModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, FormsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  private readonly cartService: CartService = inject(CartService);
  private readonly ordersService: OrdersService = inject(OrdersService);
  private readonly profileService: ProfileService = inject(ProfileService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly translate: TranslateService = inject(TranslateService);

  protected readonly displayedColumns = ['numero', 'clientNom', 'date_commande', 'total_ttc', 'est_valider', 'est_solder', 'statusLibelle'];

  // Real orders loaded from the backend (commande_bp), scoped to the logged-in
  // user's client_id. Populated by the effect() below once profile.clientId is known.
  private readonly _realOrders = signal<Commande[]>([]);
  protected readonly loadError = signal(false);

  constructor() {
    effect(() => {
      const clientId = this.profileService.profile()?.clientId;
      if (!clientId) {
        return;
      }
      this.loadError.set(false);
      this.ordersService.listOrders(clientId).subscribe({
        next: (res) => this._realOrders.set(res.items.map(item => this.toCommande(item))),
        error: () => {
          this.loadError.set(true);
          this._realOrders.set([]);
        }
      });
    });
  }

  // Maps the backend's list-item shape (OrderListItem) onto the Commande shape
  // the rest of this component/template already expects, so downstream code
  // (filtering, formatting, table columns) doesn't need to change.
  private toCommande(item: OrderListItem): Commande {
    return {
      id: item.id,
      numero: item.numero,
      date_commande: item.date_commande ? new Date(item.date_commande) : null,
      total_ht: item.total_ht,
      total_ttc: item.total_ttc,
      total_tva: item.total_ttc - item.total_ht,
      est_valider: item.est_valider,
      est_solder: item.est_solder,
      montant_regle: item.total_ttc - item.solde_du,
      solde_du: item.solde_du,
      clientNom: '',
      statusLibelle: item.est_solder ? 'Livrée' : item.est_valider ? 'En cours' : 'Confirmée',
      lignes: undefined
    } as unknown as Commande;
  }

  protected readonly allOrders = computed<Commande[]>(() => {
    // Cart-originated orders are still local-only — placeOrder() has no
    // backend POST route to call yet (commande_bp is GET-only). These are
    // merged in on top of real orders so users still see what they just "placed."
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
    return [...this._realOrders(), ...cartOrders];
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

  @ViewChild('timelineTpl') private readonly timelineTpl!: TemplateRef<unknown>;
  private dialogRef: ReturnType<MatDialog['open']> | null = null;

  protected selectedOrder = signal<Commande | null>(null);
  protected readonly loadingOrderDetail = signal(false);
  private readonly _realOrderItems = signal<LigneCommande[]>([]);
  private readonly _realTracking = signal<OrderTrackingEvent[]>([]);

  protected goToProducts(): void {
    this.router.navigate(['/products']);
  }

  protected openTimeline(order: Commande): void {
    this.selectedOrder.set(order);
    this._realOrderItems.set([]);
    this._realTracking.set([]);
    this.dialogRef = this.dialog.open(this.timelineTpl, {
      width: '960px',
      maxWidth: '96vw',
      panelClass: 'timeline-dialog-panel',
      autoFocus: false
    });
    this.dialogRef.afterClosed().subscribe(() => this.selectedOrder.set(null));

    // Cart-originated orders already carry their line items locally (order.lignes).
    // Real orders don't — the list endpoint doesn't return articles, only the
    // detail endpoint does. Fetch it now instead of falling back to mock data.
    if (!order.lignes) {
      this.loadingOrderDetail.set(true);
      this.ordersService.getOrderById(order.id).subscribe({
        next: (detail) => {
          this._realOrderItems.set(detail.articles.map((a: OrderArticle) => ({
            id: a.id,
            commande_id: order.id,
            article_id: a.id,
            designation: a.nom_article,
            reference: a.reference,
            quantite: a.quantite,
            prix_unitaire_ht: a.prix_ht,
            total_ht: a.total_prix_ht,
            image: undefined,
            est_supprime: false
          })));
          this.loadingOrderDetail.set(false);
        },
        error: () => {
          this._realOrderItems.set([]);
          this.loadingOrderDetail.set(false);
        }
      });

      // Real status-history from HistoriqueStatutCommande. No mock fallback.
      this.ordersService.getOrderTracking(order.id).subscribe({
        next: (events) => this._realTracking.set(events),
        error: () => this._realTracking.set([])
      });
    }
  }

  protected closeTimeline(): void {
    this.dialogRef?.close();
  }

  protected readonly orderItems = computed<LigneCommande[]>(() => {
    const order = this.selectedOrder();
    if (!order) return [];
    // Cart-originated orders carry their own lines; real orders use the
    // fetched detail from openTimeline() above. No mock fallback.
    return order.lignes ?? this._realOrderItems();
  });

  protected readonly itemsCount = computed(() =>
    this.orderItems().reduce((sum, line) => sum + line.quantite, 0)
  );

  protected readonly itemsSubtotal = computed(() =>
    this.orderItems().reduce((sum, line) => sum + line.total_ht, 0)
  );

  /**
   * Real status-change history from HistoriqueStatutCommande, rendered
   * chronologically. There is no Statut lookup table in the backend models,
   * so status IDs can't be turned into human labels — showing raw IDs with
   * timestamps/comments until that mapping exists is more honest than
   * pretending to know what they mean.
   */
  protected readonly timelineSteps = computed<TimelineStep[]>(() => {
    const order = this.selectedOrder();
    if (!order) return [];

    // Cart-originated (local) orders have no backend history to fetch.
    if (order.lignes) {
      return [];
    }

    return this._realTracking().map((event, index) => ({
      key: 'commande' as EtapeCommande,
      title: event.nouveau_status_id !== null
        ? `Statut #${event.nouveau_status_id}`
        : `Étape ${index + 1}`,
      icon: 'sync_alt',
      description: event.commentaire ?? '',
      dateLabel: event.date_changement ? this.formatDay(new Date(event.date_changement)) : '',
      timeLabel: event.date_changement ? formatDate(new Date(event.date_changement), 'HH:mm', this.currentLocale()) : '',
      status: (index === this._realTracking().length - 1 ? 'active' : 'done') as StepStatus
    }));
  });

  private formatDay(date: Date): string {
    return formatDate(date, 'd MMMM y', this.currentLocale());
  }

  protected formatOrderDate(date: Date): string {
    return formatDate(date, 'dd/MM/yyyy', this.currentLocale());
  }

  protected formatMoney(amount: number): string {
    return formatCurrency(amount, this.currentLocale(), '€', 'EUR', '1.2-2');
  }

  protected formatBalanceDue(order: Commande): string {
    return `${this.translate.instant('ORDERS.TIMELINE.BALANCE_DUE')}: ${this.formatMoney(order.solde_du)}`;
  }

  protected formatLineTotal(amount: number): string {
    return this.formatMoney(amount);
  }

  protected formatLineQuantity(unitPrice: number, quantity: number): string {
    return `${quantity} × ${this.formatMoney(unitPrice)}`;
  }

  private currentLocale(): string {
    const lang = this.translate.currentLang();
    if (lang === 'en') return 'en-US';
    if (lang === 'ar') return 'ar';
    return LOCALE;
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

  protected statusKey(status: string): string {
    const map: Record<string, string> = {
      'confirmée': 'COMMON.STATUS.CONFIRMED',
      'confirm': 'COMMON.STATUS.CONFIRMED',
      'en cours': 'COMMON.STATUS.IN_PROGRESS',
      'in progress': 'COMMON.STATUS.IN_PROGRESS',
      'expédiée': 'COMMON.STATUS.SHIPPED',
      'shipped': 'COMMON.STATUS.SHIPPED',
      'annulée': 'COMMON.STATUS.CANCELED',
      'canceled': 'COMMON.STATUS.CANCELED',
      'payée': 'COMMON.STATUS.PAID',
      'paid': 'COMMON.STATUS.PAID',
      'en attente': 'COMMON.STATUS.PENDING',
      'pending': 'COMMON.STATUS.PENDING'
    };

    return map[(status || '').toLowerCase()] ?? status;
  }
}
