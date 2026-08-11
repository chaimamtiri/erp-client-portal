import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface Address {
  id?: number;
  societe: string;
  adresse: string;
  complement: string;
  est_default?: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  name: string;
  roles: string[];
  role: string;
  clientId: number | null;
  client_id?: number | null;
  phone?: string;
  company?: string;
  addresses?: Address[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  private readonly _profile = signal<UserProfile | null>(null);
  private readonly _addresses = signal<Address[]>([]);

  readonly profile = this._profile.asReadonly();
  readonly addresses = this._addresses.asReadonly();

  constructor() {
    this.loadProfileFromStorage();
  }

  loadCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiConfig.getApiUrl('/auth/me')).pipe(
      tap((user: UserProfile) => this.setProfile(user))
    );
  }

  setProfile(user: Partial<UserProfile>): void {
    const mapped: UserProfile = {
      id: user.id ?? 0,
      email: user.email ?? '',
      nom: user.nom ?? user.name ?? '',
      name: user.name ?? user.nom ?? '',
      roles: user.roles ?? [],
      role: user.roles?.[0] ?? user.role ?? '',
      clientId: user.clientId ?? user.client_id ?? null,
      client_id: user.client_id ?? user.clientId ?? null,
      phone: user.phone ?? '',
      company: user.company ?? '',
      addresses: user.addresses ?? []
    };
    this._profile.set(mapped);
    this._addresses.set(mapped.addresses ?? []);
    localStorage.setItem('userProfile', JSON.stringify(mapped));
  }

  loadProfileFromStorage(): void {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.setProfile(parsed);
      } catch {
        this._profile.set(null);
      }
    }
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiConfig.getApiUrl('/auth/profile'), data).pipe(
      tap((updated: UserProfile) => this.setProfile(updated))
    );
  }

  addAddress(address: Address): void {
    this._addresses.update(list => [...list, address]);
  }

  updateAddress(index: number, address: Address): void {
    this._addresses.update(list => {
      const updated = [...list];
      updated[index] = address;
      return updated;
    });
  }

  deleteAddress(index: number): void {
    this._addresses.update(list => list.filter((_, i) => i !== index));
  }

  setDefaultAddress(index: number): void {
    this._addresses.update(list =>
      list.map((addr, i) => ({ ...addr, est_default: i === index }))
    );
  }

  resetProfile(): void {
    this._profile.set(null);
    this._addresses.set([]);
    localStorage.removeItem('userProfile');
  }

  isAdmin(): boolean {
    return this._profile()?.roles?.includes('ROLE_ADMIN') ?? false;
  }
}
