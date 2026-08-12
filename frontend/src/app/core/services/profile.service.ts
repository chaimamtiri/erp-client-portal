import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { AddressesService } from './addresses.service';

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
  private readonly addressesService = inject(AddressesService);

  private readonly _profile = signal<UserProfile | null>(null);
  private readonly _addresses = signal<Address[]>([]);

  readonly profile = this._profile.asReadonly();
  readonly addresses = this._addresses.asReadonly();

  constructor() {
    this.loadProfileFromStorage();
  }

  loadCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiConfig.getApiUrl('/auth/me')).pipe(
      tap((user: UserProfile) => {
        this.setProfile(user);
        if (user.clientId ?? user.client_id) {
          this.loadAddresses((user.clientId ?? user.client_id)!);
        }
      })
    );
  }

  loadAddresses(clientId: number): void {
    this.addressesService.getByClient(clientId).subscribe({
      next: (addresses) => this._addresses.set(addresses),
      error: () => this._addresses.set([])
    });
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

  // Real backend call — the only address mutation the backend supports.
  addAddress(address: Address): void {
    this.addressesService.create(address).subscribe({
      next: (created) => this._addresses.update(list => [...list, created]),
      error: () => {
        // Backend rejected it — fall back to local-only so the UI doesn't silently drop the input.
        this._addresses.update(list => [...list, address]);
      }
    });
  }

  // NOTE: no PUT/DELETE route exists on adresse_bp yet. These remain
  // local-only until that's built — changes here will NOT persist
  // past a page reload or across devices. Flagging clearly rather than
  // pretending this is fully migrated.
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
