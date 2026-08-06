import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = signal(environment.apiUrl);

  setBaseUrl(url: string): void {
    this.baseUrl.set(url);
  }

  getApiUrl(path: string): string {
    const normalizedBase = this.baseUrl().replace(/\/$/, '');
    const normalizedPath = path.replace(/^\//, '');
    return `${normalizedBase}/${normalizedPath}`;
  }
}
