import { ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { orders, Commande } from '../../Core/models/mock-data';
import { CartService } from '../../Core/services/cart.service';

type StepStatus = 'done' | 'active' | 'pending' | 'canceled';

interface TimelineStep {
  index: number;
  title: string;
  subtitle?: string;
  status: StepStatus;
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTableModule, MatChipsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, FormsModule, BreadcrumbComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  private readonly cartService: CartService = inject(CartService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);

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
      soldeDu: order.solde_du
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

  protected goToProducts(): void {
    this.router.navigate(['/products']);
  }

  protected viewOrderDetail(order: Commande): void {
    this.router.navigate(['/orders/detail'], { queryParams: { orderId: order.id } });
  }

  protected selectedOrder = signal<Commande | null>(null);

  protected readonly copiedTracking = signal(false);
  protected readonly trackingSteps = computed(() => {
    const order = this.selectedOrder();
    if (!order) {
      return [];
    }

    const statusLabel = order.statusLibelle ?? '';
    const validated = order.est_valider;
    const prepared = validated && (statusLabel === 'En cours' || statusLabel === 'Confirmée' || statusLabel === 'Expédiée');
    const shipped = statusLabel === 'Expédiée';

    return [
      {
        title: 'Commande reçue',
        shortTitle: 'Order',
        status: 'completed',
        icon: 'shopping_cart',
        description: 'Votre commande a bien été enregistrée.'
      },
      {
        title: 'Commande validée',
        shortTitle: 'Payment',
        status: validated ? 'completed' : 'current',
        icon: 'payments',
        description: validated ? 'La commande a été validée.' : 'Validation en cours.'
      },
      {
        title: 'Préparation',
        shortTitle: 'Shipped',
        status: prepared ? 'completed' : validated ? 'current' : 'pending',
        icon: 'inventory',
        description: prepared ? 'Le colis est en préparation.' : 'Préparation à venir.'
      },
      {
        title: 'Expédiée',
        shortTitle: 'Transit',
        status: shipped ? 'completed' : prepared ? 'current' : 'pending',
        icon: 'local_shipping',
        description: shipped ? 'Le colis a été expédié.' : 'Expédition en attente.'
      },
      {
        title: 'Livraison',
        shortTitle: 'Delivery',
        status: shipped ? 'current' : 'pending',
        icon: 'delivery_dining',
        description: shipped ? 'Le colis est en cours de livraison.' : 'Livraison à venir.'
      },
      {
        title: 'Livré',
        shortTitle: 'Delivered',
        status: 'pending',
        icon: 'home',
        description: 'La livraison sera finalisée prochainement.'
      }
    ];
  });

  protected readonly trackingProgress = computed(() => {
    const steps = this.trackingSteps();
    if (steps.length === 0) {
      return 0;
    }

    const completed = steps.filter((step) => step.status === 'completed').length;
    const currentIndex = steps.findIndex((step) => step.status === 'current');

    if (currentIndex === -1) {
      return (completed / steps.length) * 100;
    }

    return ((completed + 0.5) / steps.length) * 100;
  });

  protected readonly currentStatusLabel = computed(() => {
    const order = this.selectedOrder();
    if (!order) {
      return 'En attente';
    }

    return order.statusLibelle ?? 'En attente';
  });

  protected selectOrder(order: Commande): void {
    this.selectedOrder.set(order);
    this.copiedTracking.set(false);
  }

  protected async copyTrackingNumber(order: Commande): Promise<void> {
    try {
      await navigator.clipboard.writeText(order.numero);
      this.copiedTracking.set(true);
      window.setTimeout(() => this.copiedTracking.set(false), 1400);
    } catch {
      this.copiedTracking.set(true);
      window.setTimeout(() => this.copiedTracking.set(false), 1400);
    }
  }

  protected openTimeline(order: Commande): void {
    this.selectedOrder.set(order);
    this.dialogRef = this.dialog.open(this.timelineTpl, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'timeline-panel',
      autoFocus: false
    });
    this.dialogRef.afterClosed().subscribe(() => this.selectedOrder.set(null));
  }

  protected closeTimeline(): void {
    this.dialogRef?.close();
  }

  protected readonly timelineSteps = computed<TimelineStep[]>(() => {
    const order = this.selectedOrder();
    if (!order) return [];

    const isCanceled = order.statusLibelle === 'Annulée';

    // Raw completion state for each stage, in order.
    const raw = [
      { title: 'Commande reçue', subtitle: order.numero, done: true },
      { title: 'Commande validée', subtitle: order.est_valider ? 'Validée' : 'En attente de validation', done: order.est_valider },
      {
        title: 'Préparation',
        done: order.est_valider && (order.statusLibelle === 'En cours' || order.statusLibelle === 'Confirmée' || order.statusLibelle === 'Expédiée'),
        subtitle: ''
      },
      { title: 'Expédiée', done: order.est_valider && order.statusLibelle === 'Expédiée', subtitle: '' },
      { title: 'Paiement', done: order.est_valider && order.est_solder, subtitle: order.est_solder ? 'Soldée' : 'Solde dû: ' + order.solde_du }
    ];

    // Fill in subtitles that depend on done state, once computed.
    raw[2].subtitle = raw[2].done ? 'Articles préparés' : 'En attente';
    raw[3].subtitle = raw[3].done ? 'Expédiée au client' : '';

    // Find the first not-done step: that's the "active" one (in process).
    // Everything before it is "done", everything after is "pending".
    const firstNotDoneIndex = raw.findIndex(s => !s.done);

    return raw.map((s, i) => {
      let status: StepStatus;
      if (isCanceled && i >= (firstNotDoneIndex === -1 ? raw.length : firstNotDoneIndex)) {
        status = 'canceled';
      } else if (s.done) {
        status = 'done';
      } else if (i === firstNotDoneIndex) {
        status = 'active';
      } else {
        status = 'pending';
      }
      return { index: i + 1, title: s.title, subtitle: s.subtitle, status };
    });
  });
}