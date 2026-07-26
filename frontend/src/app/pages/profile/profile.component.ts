import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProfileService, UserProfile } from '../../core/services/profile.service';
import { Adresse } from '../../core/models/mock-data';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    BreadcrumbComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  protected readonly profileService: ProfileService = inject(ProfileService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  activeTab = signal<'info' | 'addresses'>('info');
  isEditing = signal<boolean>(false);

  // Address editing states
  isAddingAddress = signal<boolean>(false);
  isEditingAddress = signal<boolean>(false);
  editingAddressIndex = signal<number | null>(null);

  profileForm!: FormGroup;
  addressForm!: FormGroup;

  ngOnInit(): void {
    this.initProfileForm();
    this.initAddressForm();

    // Check for query parameters to auto-switch tab
    this.route.queryParams.subscribe((params) => {
      if (params['tab'] === 'addresses') {
        this.activeTab.set('addresses');
      } else {
        this.activeTab.set('info');
      }
    });
  }

  setTab(tab: 'info' | 'addresses'): void {
    this.activeTab.set(tab);
    // Cancel any active forms when switching tabs
    this.cancelEdit();
    this.cancelAddressForm();
  }

  initials = () => {
    const name = this.profileService.profile().name;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Profile forms management
  private initProfileForm(): void {
    const current = this.profileService.profile();
    this.profileForm = this.fb.group({
      name: [current.name, [Validators.required]],
      email: [current.email, [Validators.required, Validators.email]],
      phone: [current.phone, [Validators.required]],
      company: [current.company],
      role: [current.role, [Validators.required]]
    });
  }

  startEdit(): void {
    this.initProfileForm();
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value);
      this.isEditing.set(false);
    }
  }

  // Address forms management
  private initAddressForm(address?: Adresse): void {
    this.addressForm = this.fb.group({
      societe: [address ? address.societe : '', [Validators.required]],
      adresse: [address ? address.adresse : '', [Validators.required]],
      complement: [address ? address.complement : ''],
      est_default: [address ? address.est_default : false]
    });
  }

  startAddAddress(): void {
    this.initAddressForm();
    this.isAddingAddress.set(true);
    this.isEditingAddress.set(false);
    this.editingAddressIndex.set(null);
  }

  startEditAddress(index: number): void {
    const address = this.profileService.addresses()[index];
    this.initAddressForm(address);
    this.isEditingAddress.set(true);
    this.isAddingAddress.set(false);
    this.editingAddressIndex.set(index);
  }

  cancelAddressForm(): void {
    this.isAddingAddress.set(false);
    this.isEditingAddress.set(false);
    this.editingAddressIndex.set(null);
  }

  saveAddress(): void {
    if (this.addressForm.invalid) return;

    const formVal = this.addressForm.value;
    const newAddress: Adresse = {
      id: Date.now(),
      client_id: 1,
      adresse: formVal.adresse,
      complement: formVal.complement,
      societe: formVal.societe,
      est_default: formVal.est_default,
      est_livraison: false,
      est_supprime: false,
      // aliases
      title: formVal.societe,
      line: formVal.adresse,
      city: formVal.complement,
      default: formVal.est_default
    };

    if (this.isAddingAddress()) {
      this.profileService.addAddress(newAddress);
    } else if (this.isEditingAddress()) {
      const idx = this.editingAddressIndex();
      if (idx !== null) {
        this.profileService.updateAddress(idx, newAddress);
      }
    }

    this.cancelAddressForm();
  }

  deleteAddress(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      this.profileService.deleteAddress(index);
    }
  }

  setDefaultAddress(index: number): void {
    this.profileService.setDefaultAddress(index);
  }
}
