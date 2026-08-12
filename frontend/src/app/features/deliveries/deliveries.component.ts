// deliveries.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { DeliveriesService } from '../../core/services/deliveries.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-deliveries',
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveriesComponent implements OnInit {
  protected readonly deliveriesService: DeliveriesService = inject(DeliveriesService);
  private readonly profileService = inject(ProfileService);

  protected readonly displayedColumns = ['numero', 'order', 'date_livraison', 'transporteur', 'numero_suivi', 'adresse_livraison', 'est_valider'];
  protected readonly dataSource = this.deliveriesService.deliveries;

  ngOnInit(): void {
    const clientId = this.profileService.profile()?.client_id ?? undefined;
    this.deliveriesService.loadDeliveries(clientId).subscribe();
  }
}
