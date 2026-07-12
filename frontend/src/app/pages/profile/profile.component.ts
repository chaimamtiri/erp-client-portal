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
import { ProfileService, UserProfile } from '../../services/profile.service';
import { Adresse } from '../../models/mock-data';

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
  template: `
    <app-breadcrumb [items]="['Accueil', 'Profil & Adresses']" />

    <div class="profile-layout">
      <!-- Profile Header Hero -->
      <div class="profile-hero">
        <div class="profile-hero__avatar">
          {{ initials() }}
        </div>
        <div class="profile-hero__info">
          <h2>{{ profileService.profile().name }}</h2>
          <p class="role">{{ profileService.profile().role }} • {{ profileService.profile().company }}</p>
          <p class="email"><mat-icon>email</mat-icon> {{ profileService.profile().email }}</p>
        </div>
      </div>

      <!-- Tabbed Container Card -->
      <mat-card class="tabs-card">
        <!-- Tabs Headers -->
        <div class="tab-headers">
          <button class="tab-header-btn" [class.active]="activeTab() === 'info'" (click)="setTab('info')">
            <mat-icon>person</mat-icon>
            <span>Mon Profil</span>
          </button>
          <button class="tab-header-btn" [class.active]="activeTab() === 'addresses'" (click)="setTab('addresses')">
            <mat-icon>home_work</mat-icon>
            <span>Mes Adresses</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- TAB 1: Mon Profil (Info & Edit) -->
          @if (activeTab() === 'info') {
            <div class="tab-pane">
              @if (!isEditing()) {
                <div class="info-view">
                  <div class="info-grid">
                    <div class="info-group">
                      <label>Nom complet</label>
                      <p>{{ profileService.profile().name }}</p>
                    </div>
                    <div class="info-group">
                      <label>Adresse e-mail</label>
                      <p>{{ profileService.profile().email }}</p>
                    </div>
                    <div class="info-group">
                      <label>Téléphone</label>
                      <p>{{ profileService.profile().phone }}</p>
                    </div>
                    <div class="info-group">
                      <label>Entreprise</label>
                      <p>{{ profileService.profile().company }}</p>
                    </div>
                    <div class="info-group">
                      <label>Rôle / Fonction</label>
                      <p>{{ profileService.profile().role }}</p>
                    </div>
                  </div>
                  <div class="action-row">
                    <button mat-flat-button color="primary" (click)="startEdit()">
                      <mat-icon>edit</mat-icon>
                      Modifier mes informations
                    </button>
                  </div>
                </div>
              } @else {
                <form [formGroup]="profileForm" (submit)="saveProfile()" class="profile-form">
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Nom complet</mat-label>
                      <input matInput formControlName="name" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Adresse e-mail</mat-label>
                      <input matInput formControlName="email" type="email" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Téléphone</mat-label>
                      <input matInput formControlName="phone" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Entreprise</mat-label>
                      <input matInput formControlName="company" readonly />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Rôle / Fonction</mat-label>
                      <input matInput formControlName="role" />
                    </mat-form-field>
                  </div>
                  <div class="action-row">
                    <button mat-stroked-button type="button" (click)="cancelEdit()">Annuler</button>
                    <button mat-flat-button color="primary" type="submit" [disabled]="profileForm.invalid">Enregistrer</button>
                  </div>
                </form>
              }
            </div>
          }

          <!-- TAB 2: Mes Adresses -->
          @if (activeTab() === 'addresses') {
            <div class="tab-pane">
              <!-- Address Editor Form (Shown during Add/Edit) -->
              @if (isEditingAddress() || isAddingAddress()) {
                <div class="address-form-container">
                  <h3>{{ isAddingAddress() ? 'Ajouter une adresse' : 'Modifier l’adresse' }}</h3>
                  <form [formGroup]="addressForm" (submit)="saveAddress()">
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Intitulé / Société (ex: Bureau principal)</mat-label>
                        <input matInput formControlName="societe" placeholder="ex: Bureau Principal" />
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Ligne d'adresse</mat-label>
                        <input matInput formControlName="adresse" placeholder="ex: 12 Rue de la Paix" />
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Ville & Code Postal (complément)</mat-label>
                        <input matInput formControlName="complement" placeholder="ex: 75002 Paris" />
                      </mat-form-field>
                    </div>

                    <div class="checkbox-row">
                      <mat-checkbox formControlName="est_default">Définir comme adresse par défaut</mat-checkbox>
                    </div>

                    <div class="action-row">
                      <button mat-stroked-button type="button" (click)="cancelAddressForm()">Annuler</button>
                      <button mat-flat-button color="primary" type="submit" [disabled]="addressForm.invalid">Enregistrer</button>
                    </div>
                  </form>
                </div>
              }

              <!-- Addresses List -->
              <div class="addresses-section" [class.blur-background]="isEditingAddress() || isAddingAddress()">
                <div class="addresses-header">
                  <div>
                    <h3>Vos adresses enregistrées</h3>
                    <p>Gérez vos adresses de livraison et de facturation associées à votre compte.</p>
                  </div>
                  @if (!isEditingAddress() && !isAddingAddress()) {
                    <button mat-flat-button color="primary" (click)="startAddAddress()">
                      <mat-icon>add</mat-icon>
                      Ajouter une adresse
                    </button>
                  }
                </div>

                @if (profileService.addresses().length === 0) {
                  <div class="empty-addresses">
                    <mat-icon>home_work</mat-icon>
                    <p>Aucune adresse enregistrée.</p>
                  </div>
                } @else {
                  <div class="addresses-grid">
                    @for (address of profileService.addresses(); track address.adresse; let idx = $index) {
                      <div class="address-card" [class.default]="address.est_default">
                        <div class="address-card__header">
                          <h4>{{ address.societe }}</h4>
                          @if (address.est_default) {
                            <span class="default-badge">Par défaut</span>
                          }
                        </div>
                        <div class="address-card__body">
                          <p class="line">{{ address.adresse }}</p>
                          <p class="city">{{ address.complement }}</p>
                        </div>
                        <div class="address-card__actions">
                          @if (!address.est_default) {
                            <button mat-button class="set-default-btn" (click)="setDefaultAddress(idx)">
                              Définir par défaut
                            </button>
                          }
                          <div class="row-actions">
                            <button mat-icon-button color="primary" (click)="startEditAddress(idx)" aria-label="Modifier">
                              <mat-icon>edit</mat-icon>
                            </button>
                            <button mat-icon-button color="warn" (click)="deleteAddress(idx)" aria-label="Supprimer">
                              <mat-icon>delete</mat-icon>
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `.profile-layout { display: flex; flex-direction: column; gap: 1.5rem; }`,
    
    `/* Profile Hero Banner */
    .profile-hero { display: flex; align-items: center; gap: 1.8rem; padding: 2rem; border-radius: 24px; background: linear-gradient(135deg, #1e293b, #0f172a); color: white; box-shadow: 0 4px 20px rgba(15,23,42,0.15); }`,
    `.profile-hero__avatar { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: grid; place-items: center; font-size: 2.2rem; font-weight: 700; border: 4px solid rgba(255,255,255,0.15); }`,
    `.profile-hero__info h2 { margin: 0 0 0.3rem 0; font-size: 1.6rem; font-weight: 700; }`,
    `.profile-hero__info p { margin: 0; font-size: 0.9rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; }`,
    `.profile-hero__info .role { font-size: 1rem; color: #e2e8f0; font-weight: 500; margin-bottom: 0.4rem; }`,
    `.profile-hero__info mat-icon { font-size: 16px; width: 16px; height: 16px; color: #3b82f6; }`,

    `/* Tabs Card styling */
    .tabs-card { border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important; padding: 0 !important; border: 1px solid #f1f5f9; background: white; }`,
    `.tab-headers { display: flex; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }`,
    `.tab-header-btn { flex: 1; border: none; background: none; display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1.2rem; cursor: pointer; color: #64748b; font-weight: 600; font-size: 0.95rem; border-bottom: 3px solid transparent; transition: all 0.2s ease; }`,
    `.tab-header-btn:hover { color: #2563eb; background: rgba(37,99,235,0.02); }`,
    `.tab-header-btn.active { color: #2563eb; border-bottom-color: #2563eb; background: white; }`,
    `.tab-header-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }`,
    `.tab-content { padding: 2rem; }`,
    
    `/* Profile Info Pane */
    .info-view { display: flex; flex-direction: column; gap: 2rem; }`,
    `.info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }`,
    `.info-group label { display: block; font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem; }`,
    `.info-group p { margin: 0; font-size: 1rem; color: #1e293b; font-weight: 500; }`,
    
    `/* Profile Form */
    .profile-form { display: flex; flex-direction: column; gap: 1.5rem; }`,
    `.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }`,
    `@media (max-width: 768px) { .info-grid, .form-grid { grid-template-columns: 1fr; } }`,
    `.action-row { display: flex; gap: 0.8rem; justify-content: flex-start; margin-top: 1rem; }`,

    `/* Address Tab */
    .addresses-section { display: flex; flex-direction: column; gap: 1.5rem; transition: filter 0.3s ease; }`,
    `.addresses-section.blur-background { filter: blur(3px); pointer-events: none; }`,
    `.addresses-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }`,
    `.addresses-header h3 { margin: 0 0 0.3rem 0; font-size: 1.15rem; color: #1e293b; font-weight: 700; }`,
    `.addresses-header p { margin: 0; color: #64748b; font-size: 0.88rem; }`,
    
    `.addresses-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }`,
    `@media (max-width: 768px) { .addresses-grid { grid-template-columns: 1fr; } }`,
    
    `.address-card { border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.2rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 160px; transition: all 0.2s ease; background: #f8fafc; }`,
    `.address-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }`,
    `.address-card.default { border-color: #bfdbfe; background: #eff6ff; }`,
    `.address-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; }`,
    `.address-card__header h4 { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }`,
    `.default-badge { background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 999px; }`,
    `.address-card__body p { margin: 0; font-size: 0.9rem; color: #475569; }`,
    `.address-card__body .line { font-weight: 500; color: #1e293b; margin-bottom: 0.2rem; }`,
    `.address-card__actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1.2rem; pt: 0.5rem; border-top: 1px solid rgba(226, 232, 240, 0.6); }`,
    `.set-default-btn { font-size: 0.8rem; font-weight: 600; color: #2563eb; padding: 0; min-width: auto; height: auto; }`,
    `.row-actions { display: flex; gap: 0.2rem; margin-left: auto; }`,
    
    `.empty-addresses { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; color: #94a3b8; gap: 0.8rem; }`,
    `.empty-addresses mat-icon { font-size: 40px; width: 40px; height: 40px; }`,

    `/* Address Form Overlay */
    .address-form-container { background: #f8fafc; border: 1px solid #bfdbfe; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; animation: slideDownForm 0.3s ease; }`,
    `@keyframes slideDownForm { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }`,
    `.address-form-container h3 { margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; color: #1e293b; }`,
    `.checkbox-row { margin: 0.5rem 0 1rem 0; }`,

    `/* Dark Mode overrides */
    .dark-theme .profile-hero { background: linear-gradient(135deg, #0f172a, #020617); box-shadow: none; }`,
    `.dark-theme .profile-hero__info .role { color: #f8fafc; }`,
    `.dark-theme .profile-hero__info p { color: #94a3b8; }`,
    `.dark-theme .tabs-card { background: #1e293b; border-color: #334155; }`,
    `.dark-theme .tab-headers { background: #0f172a; border-bottom-color: #334155; }`,
    `.dark-theme .tab-header-btn { color: #94a3b8; }`,
    `.dark-theme .tab-header-btn:hover { color: #60a5fa; background: rgba(59,130,246,0.02); }`,
    `.dark-theme .tab-header-btn.active { color: #60a5fa; border-bottom-color: #60a5fa; background: #1e293b; }`,
    `.dark-theme .info-group label { color: #94a3b8; }`,
    `.dark-theme .info-group p { color: #f8fafc; }`,
    `.dark-theme .address-card { background: #0f172a; border-color: #334155; }`,
    `.dark-theme .address-card:hover { border-color: #475569; }`,
    `.dark-theme .address-card.default { border-color: #1e3a8a; background: rgba(30,58,138,0.15); }`,
    `.dark-theme .address-card__header h4 { color: #f8fafc; }`,
    `.dark-theme .address-card__body .line { color: #f8fafc; }`,
    `.dark-theme .address-card__body .city { color: #cbd5e1; }`,
    `.dark-theme .default-badge { background: #15803d; color: #dcfce7; }`,
    `.dark-theme .set-default-btn { color: #60a5fa; }`,
    `.dark-theme .addresses-header h3 { color: #f8fafc; }`,
    `.dark-theme .addresses-header p { color: #94a3b8; }`,
    `.dark-theme .address-form-container { background: #0f172a; border-color: #1e3a8a; }`,
    `.dark-theme .address-form-container h3 { color: #f8fafc; }`,
    `.dark-theme .empty-addresses { color: #475569; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  protected readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

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
