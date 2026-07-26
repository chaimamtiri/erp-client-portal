import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { DocumentsService } from '../../core/services/documents.service';

@Component({
  selector: 'app-documents',
  imports: [MatCardModule, MatIconModule, BreadcrumbComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent {
  protected readonly documentsService: DocumentsService = inject(DocumentsService);

  protected readonly documentList = this.documentsService.documents;
}

