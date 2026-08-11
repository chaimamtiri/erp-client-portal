import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { ProfileService, UserProfile } from './profile.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: UserProfile;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
  roles: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly profileService = inject(ProfileService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.apiConfig.getApiUrl('/auth/login'),
      credentials
    ).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('authToken', response.access_token);
        }
        if (response.refresh_token) {
          localStorage.setItem('refreshToken', response.refresh_token);
        }
        if (response.user) {
          this.profileService.setProfile(response.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      this.apiConfig.getApiUrl('/auth/register'),
      data
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.profileService.resetProfile();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
