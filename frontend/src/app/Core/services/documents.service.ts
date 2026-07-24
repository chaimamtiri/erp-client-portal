import { Injectable, signal, computed } from '@angular/core';
import { documents, DocumentItem } from '../models/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private documentsData = signal(documents);

  readonly documents$ = this.documentsData.asReadonly();
  readonly documents = computed(() => this.documentsData());

  getDocuments() {
    return this.documentsData();
  }

  getDocumentById(id: number): DocumentItem | undefined {
    return this.documentsData().find(doc => doc.id === id);
  }

  getDocumentsByType(type: string): DocumentItem[] {
    return this.documentsData().filter(doc => doc.type === type);
  }

  getDocumentsByClient(clientId: number): DocumentItem[] {
    return this.documentsData().filter(doc => doc.client_id === clientId);
  }
}
