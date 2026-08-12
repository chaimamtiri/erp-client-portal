import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AppDocument {
  id: number;
  client_id: number;
  lien: string;
  nom: string;
  name: string;
  type: string;
  updated: string | null;
  size: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  private readonly _documents = signal<AppDocument[]>([]);
  readonly documents = this._documents.asReadonly();

  loadDocuments(clientId?: number): void {
    const url = clientId ? `${this.baseUrl}?client_id=${clientId}` : this.baseUrl;
    this.http.get<AppDocument[]>(url).subscribe({
      next: (docs) => this._documents.set(docs),
      error: () => this._documents.set([])
    });
  }
}
