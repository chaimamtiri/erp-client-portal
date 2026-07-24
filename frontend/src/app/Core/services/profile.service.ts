import { Injectable, signal } from '@angular/core';
import { Adresse, addresses } from '../models/mock-data';

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly profile = signal<UserProfile>({
    name: 'Claire Martin',
    email: 'claire.martin@acme.com',
    company: 'Acme SAS',
    role: 'Responsable achats',
    phone: '+33 6 12 34 56 78'
  });

  readonly addresses = signal<Adresse[]>(addresses);

  updateProfile(newProfile: Partial<UserProfile>): void {
    this.profile.update((p) => ({ ...p, ...newProfile }));
  }

  addAddress(address: Adresse): void {
    this.addresses.update((list) => {
      let updated = list;
      if (address.est_default) {
        updated = list.map((a) => ({ ...a, est_default: false, default: false }));
      }
      return [...updated, address];
    });
  }

  updateAddress(index: number, updatedAddress: Adresse): void {
    this.addresses.update((list) => {
      let updated = list.map((item, idx) => (idx === index ? updatedAddress : item));
      if (updatedAddress.est_default) {
        updated = updated.map((a, idx) => (idx === index ? a : { ...a, est_default: false, default: false }));
      }
      return updated;
    });
  }

  deleteAddress(index: number): void {
    this.addresses.update((list) => {
      const removed = list.filter((_, idx) => idx !== index);
      // If we deleted the default, set first as default
      if (list[index]?.est_default && removed.length > 0) {
        removed[0].est_default = true;
        removed[0].default = true;
      }
      return removed;
    });
  }

  setDefaultAddress(index: number): void {
    this.addresses.update((list) =>
      list.map((item, idx) => ({
        ...item,
        est_default: idx === index,
        default: idx === index
      }))
    );
  }
}
