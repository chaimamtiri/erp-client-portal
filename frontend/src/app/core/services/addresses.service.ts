import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudBaseService } from './crud-base.service';
import { Address } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesService extends CrudBaseService<Address> {
  protected override endpoint = 'addresses';

  // Backend only supports GET (optionally ?client_id=) and POST —
  // there is no PUT/DELETE route yet, so update/delete are not exposed here.
  getByClient(clientId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrlPublic}?client_id=${clientId}`);
  }

  // CrudBaseService.baseUrl is private; exposing a protected getter so
  // getByClient can reuse it without duplicating the endpoint string.
  protected get baseUrlPublic(): string {
    return (this as any).baseUrl ?? `/api/v1/${this.endpoint}`;
  }
}
