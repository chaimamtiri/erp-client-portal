// documents.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../core/services/documents.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-documents',
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent, TranslatePipe],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent implements OnInit {
  protected readonly documentsService: DocumentsService = inject(DocumentsService);
  private readonly profileService = inject(ProfileService);

  protected readonly documentList = this.documentsService.documents;

  ngOnInit(): void {
    const clientId = this.profileService.profile()?.client_id ?? undefined;
    this.documentsService.loadDocuments(clientId);
  }
}
