import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudBaseService<T> {
  protected readonly http = inject(HttpClient);

  protected endpoint = '';

  private get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  getAll(params?: Record<string, string | number>): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<T[]>(this.baseUrl, { params: httpParams });
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, payload);
  }

  update(id: number | string, payload: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
