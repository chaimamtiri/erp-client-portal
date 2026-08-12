import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl = 'http://127.0.0.1:5000/api/v1';

  getApiUrl(path: string): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }
}

// ---------------------------------------------------------------------------
// SHARED MODEL INTERFACES (moved from mock-data.ts)
// ---------------------------------------------------------------------------

export interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: string;
  tone: 'accent' | 'success' | 'warning' | 'neutral';
}

export interface Client {
  id: number;
  code: string;
  nom: string;
  email?: string;
  telephone?: string;
  portable?: string;
  numero_tva?: string;
  siret?: string;
  site_web?: string;
  est_bloquer: boolean;
  est_pospect: boolean;
  est_supprime: boolean;
  famille_id?: number;
  mode_reglement_id?: number;
}

export interface Utilisateur {
  id: number;
  email: string;
  nom?: string;
  roles?: string;
  status?: string;
  est_bloque: boolean;
  est_supprime: boolean;
  client_id?: number;
}

export interface Adresse {
  id: number;
  client_id: number;
  adresse: string;
  complement?: string;
  ville_id?: number;
  email?: string;
  societe?: string;
  est_default: boolean;
  est_livraison: boolean;
  est_supprime: boolean;
  title?: string;
  line?: string;
  city?: string;
  default?: boolean;
}

export interface Article {
  id: number;
  nom: string;
  reference: string;
  description?: string;
  prix_vente_ht?: number;
  prix_vente_ttc?: number;
  est_affiche_ttc: boolean;
  est_service: boolean;
  image?: string;
  est_bloque: boolean;
  est_supprime: boolean;
  tva_id?: number;
  famille_article_id?: number;
  sous_famille_article_id?: number;
  unite_id?: number;
  stock_disponible: number;
  name?: string;
  price?: number;
  stock?: string;
  category?: string;
  rating?: number;
}

export interface Commande {
  id: number;
  numero: string;
  date_commande: Date;
  date_piece?: Date;
  date_echeance?: Date;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  est_valider: boolean;
  est_solder: boolean;
  montant_regle: number;
  solde_du: number;
  est_supprime: boolean;
  client_id: number;
  status_id?: number;
  cree_par_id?: number;
  dateCommande?: Date;
  totalTTC?: number;
  totalHT?: number;
  totalTVA?: number;
  estValider?: boolean;
  estSolder?: boolean;
  montantRegle?: number;
  soldeDu?: boolean | number;
  clientNom?: string;
  statusLibelle?: string;
  lignes?: LigneCommande[];
}

export interface LigneCommande {
  id: number;
  commande_id: number;
  article_id?: number;
  designation: string;
  reference: string;
  quantite: number;
  prix_unitaire_ht: number;
  total_ht: number;
  image?: string;
  est_supprime: boolean;
}

export type EtapeCommande =
  | 'commande'
  | 'paiement'
  | 'preparation'
  | 'expediee'
  | 'centre_local'
  | 'en_livraison'
  | 'livree'
  | 'annulee';

export interface SuiviCommande {
  commande_numero: string;
  etape: EtapeCommande;
  date: Date;
  description: string;
}

export interface Facture {
  id: number;
  numero: string;
  date_facture: Date;
  date_piece?: Date;
  date_echeance?: Date;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  est_valider: boolean;
  est_solder: boolean;
  montant_regle: number;
  solde_du: number;
  est_supprime: boolean;
  client_id: number;
  status_id?: number;
  cree_par_id?: number;
  customer?: string;
  amount?: string;
  issued?: string;
  status?: string;
  statusLibelle?: string;
}

export interface BonLivraison {
  id: number;
  numero: string;
  date_livraison: Date;
  date_piece?: Date;
  date_echeance?: Date;
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  est_valider: boolean;
  est_imprimer: boolean;
  est_envoyer: boolean;
  est_desactive: boolean;
  tier_id?: number;
  status_id?: number;
  mode_livraison_id?: number;
  adresse_livraison?: string;
  code_postal_livraison?: string;
  societe_livraison?: string;
  transporteur?: string;
  numero_suivi?: string;
  order?: string;
  eta?: string;
  status?: string;
  address?: string;
}

export interface Reglement {
  id: number;
  numero: string;
  date_paiement: Date;
  reference?: string;
  montant_regle: number;
  est_encaisser: boolean;
  est_supprime: boolean;
  client_id: number;
  type_paiement_id?: number;
  mode_rgelement_id?: number;
  method?: string;
  amount?: string;
  date?: string;
  status?: string;
}

export interface DocumentItem {
  id: number;
  client_id: number;
  lien: string;
  nom: string;
  est_attache_email: boolean;
  est_supprime: boolean;
  name?: string;
  type?: string;
  updated?: string;
  size?: string;
}

export interface Ticket {
  id: number;
  numero: string;
  client_id: number;
  utilisateur_id: number;
  sujet: string;
  description?: string;
  categorie?: string;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  piece_liee_type?: string;
  piece_liee_id?: number;
  est_supprime: boolean;
  title?: string;
  category?: string;
  priority?: string;
  updated?: string;
}

export interface NotificationItem {
  id: number;
  utilisateur_id: number;
  titre: string;
  message?: string;
  type?: string;
  lien?: string;
  entite_type?: string;
  entite_id?: number;
  est_lu: boolean;
  date_creation: Date;
  title?: string;
  detail?: string;
  time?: string;
  read?: boolean;
}

export interface ActivityItem {
  title: string;
  detail: string;
  time: string;
}
