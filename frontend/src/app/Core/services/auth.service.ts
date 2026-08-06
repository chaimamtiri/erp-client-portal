import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  user?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiConfig.getApiUrl('/auth/login'), credentials).pipe(
      tap(response => {
        const token = response.accessToken ?? response.token;
        if (token) {
          localStorage.setItem('authToken', token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
