import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../ui/breadcrumb/breadcrumb.component';
import { ProfileService, Address } from '../../core/services/profile.service';

type ProfileTab = 'info' | 'addresses';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    TranslatePipe,
    BreadcrumbComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly profileService = inject(ProfileService);

  // ----- Tabs -----
  readonly activeTab = signal<ProfileTab>('info');

  setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  // ----- Profile info edit state -----
  readonly isEditing = signal(false);

  readonly initials = computed(() => {
    const name = this.profileService.profile()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });

  profileForm!: FormGroup;

  // ----- Address edit state -----
  readonly isAddingAddress = signal(false);
  readonly isEditingAddress = signal(false);
  editingAddressIndex: number | null = null;

  addressForm!: FormGroup;

  ngOnInit(): void {
    this.profileService.loadCurrentUser().subscribe(() => {
      this.initForms();
    });
  }

  private initForms(): void {
    const current = this.profileService.profile();

    this.profileForm = this.fb.group({
      name: [current?.name ?? '', [Validators.required]],
      email: [current?.email ?? '', [Validators.required, Validators.email]],
      phone: [current?.phone ?? '', [Validators.required]],
      company: [current?.company ?? ''],
      role: [current?.role ?? '', [Validators.required]]
    });

    this.addressForm = this.fb.group({
      societe: ['', Validators.required],
      adresse: ['', Validators.required],
      complement: ['', Validators.required],
      est_default: [false]
    });
  }

  // ----- Profile info actions -----
  startEdit(): void {
    const current = this.profileService.profile();
    this.profileForm.patchValue({
      name: current?.name ?? '',
      email: current?.email ?? '',
      phone: current?.phone ?? '',
      company: current?.company ?? '',
      role: current?.role ?? ''
    });
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.profileService.updateProfile(this.profileForm.value).subscribe(() => {
      this.isEditing.set(false);
    });
  }

  // ----- Address actions -----
  get addresses(): Address[] {
    return this.profileService.addresses();
  }

  startAddAddress(): void {
    this.addressForm.reset({ societe: '', adresse: '', complement: '', est_default: false });
    this.editingAddressIndex = null;
    this.isAddingAddress.set(true);
    this.isEditingAddress.set(false);
  }

  startEditAddress(index: number): void {
    const address = this.profileService.addresses()[index];
    this.addressForm.patchValue(address);
    this.editingAddressIndex = index;
    this.isEditingAddress.set(true);
    this.isAddingAddress.set(false);
  }

  cancelAddressForm(): void {
    this.isAddingAddress.set(false);
    this.isEditingAddress.set(false);
    this.editingAddressIndex = null;
    this.addressForm.reset({ societe: '', adresse: '', complement: '', est_default: false });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) return;

    const newAddress: Address = this.addressForm.value;

    if (this.editingAddressIndex !== null) {
      this.profileService.updateAddress(this.editingAddressIndex, newAddress);
    } else {
      this.profileService.addAddress(newAddress);
    }

    this.cancelAddressForm();
  }

  deleteAddress(index: number): void {
    this.profileService.deleteAddress(index);
  }

  setDefaultAddress(index: number): void {
    this.profileService.setDefaultAddress(index);
  }
}
