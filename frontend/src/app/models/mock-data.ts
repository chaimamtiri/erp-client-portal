// ---------------------------------------------------------------------------
// INTERFACES ALIGNÉES SUR LES MODÈLES DE BASE DE DONNÉES SQLALCHEMY
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

  // Aliases pour compatibilité frontend
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

  // Aliases pour compatibilité frontend
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

  // Aliases pour compatibilité frontend et affichage
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

  // Aliases pour compatibilité frontend et affichage
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

  // Aliases pour compatibilité frontend et affichage
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

  // Aliases pour compatibilité frontend et affichage
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

  // Aliases pour compatibilité frontend et affichage
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

  // Aliases pour compatibilité frontend et affichage
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

  // Aliases pour compatibilité frontend et affichage
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

// ---------------------------------------------------------------------------
// DONNÉES FICTIVES DE TEST (MOCK DATA)
// ---------------------------------------------------------------------------

export const stats: StatItem[] = [
  { title: 'Revenus', value: '€184.2k', change: '+12.4%', icon: 'payments', tone: 'accent' },
  { title: 'Commandes', value: '1,248', change: '+8.1%', icon: 'shopping_bag', tone: 'success' },
  { title: 'Factures', value: '324', change: '-2.3%', icon: 'receipt_long', tone: 'warning' },
  { title: 'Tickets', value: '19', change: '+4.5%', icon: 'support_agent', tone: 'neutral' }
];

export const products: Article[] = [
  {
    id: 1,
    nom: 'ERP Pro Suite',
    reference: 'REF-ERP-PRO',
    description: 'Suite ERP complète pour PME/ETI',
    prix_vente_ht: 980,
    prix_vente_ttc: 1176,
    est_affiche_ttc: false,
    est_service: true,
    image: '📦',
    est_bloque: false,
    est_supprime: false,
    tva_id: 1,
    famille_article_id: 1,
    stock_disponible: 99,
    
    // aliases
    name: 'ERP Pro Suite',
    price: 980,
    stock: 'En stock',
    category: 'Logiciels',
    rating: 4.9
  },
  {
    id: 2,
    nom: 'Terminal Mobile',
    reference: 'REF-TERM-MOB',
    description: 'Terminal de saisie mobile durci',
    prix_vente_ht: 640,
    prix_vente_ttc: 768,
    est_affiche_ttc: false,
    est_service: false,
    image: '📱',
    est_bloque: false,
    est_supprime: false,
    tva_id: 1,
    famille_article_id: 2,
    stock_disponible: 3,
    
    // aliases
    name: 'Terminal Mobile',
    price: 640,
    stock: '3 restants',
    category: 'Matériel',
    rating: 4.7
  },
  {
    id: 3,
    nom: 'Pack Analytics',
    reference: 'REF-PACK-ANA',
    description: 'Module additionnel d\'analyse décisionnelle',
    prix_vente_ht: 320,
    prix_vente_ttc: 384,
    est_affiche_ttc: false,
    est_service: true,
    image: '📊',
    est_bloque: false,
    est_supprime: false,
    tva_id: 1,
    famille_article_id: 1,
    stock_disponible: 150,
    
    // aliases
    name: 'Pack Analytics',
    price: 320,
    stock: 'En stock',
    category: 'Services',
    rating: 4.8
  },
  {
    id: 4,
    nom: 'Assistant IA',
    reference: 'REF-AST-IA',
    description: 'Assistant intelligent connecté à votre ERP',
    prix_vente_ht: 540,
    prix_vente_ttc: 648,
    est_affiche_ttc: false,
    est_service: true,
    image: '🤖',
    est_bloque: false,
    est_supprime: false,
    tva_id: 1,
    famille_article_id: 1,
    stock_disponible: 200,
    
    // aliases
    name: 'Assistant IA',
    price: 540,
    stock: 'En stock',
    category: 'Logiciels',
    rating: 4.6
  }
];

export const orders: Commande[] = [
  {
    id: 1,
    numero: 'ORD-1024',
    date_commande: new Date('2026-07-05'),
    total_ht: 2000,
    total_tva: 400,
    total_ttc: 2450,
    est_valider: true,
    est_solder: true,
    montant_regle: 2450,
    solde_du: 0,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    dateCommande: new Date('2026-07-05'),
    totalTTC: 2450,
    totalHT: 2000,
    totalTVA: 400,
    estValider: true,
    estSolder: true,
    montantRegle: 2450,
    soldeDu: 0,
    clientNom: 'Acme SAS',
    statusLibelle: 'Expédiée'
  },
  {
    id: 2,
    numero: 'ORD-1025',
    date_commande: new Date('2026-07-04'),
    total_ht: 700,
    total_tva: 140,
    total_ttc: 860,
    est_valider: true,
    est_solder: false,
    montant_regle: 430,
    solde_du: 430,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    dateCommande: new Date('2026-07-04'),
    totalTTC: 860,
    totalHT: 700,
    totalTVA: 140,
    estValider: true,
    estSolder: false,
    montantRegle: 430,
    soldeDu: 430,
    clientNom: 'Acme SAS',
    statusLibelle: 'En cours'
  },
  {
    id: 3,
    numero: 'ORD-1026',
    date_commande: new Date('2026-07-03'),
    total_ht: 1100,
    total_tva: 220,
    total_ttc: 1320,
    est_valider: false,
    est_solder: false,
    montant_regle: 0,
    solde_du: 1320,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    dateCommande: new Date('2026-07-03'),
    totalTTC: 1320,
    totalHT: 1100,
    totalTVA: 220,
    estValider: false,
    estSolder: false,
    montantRegle: 0,
    soldeDu: 1320,
    clientNom: 'Acme SAS',
    statusLibelle: 'Confirmée'
  }
];

export const invoices: Facture[] = [
  {
    id: 1,
    numero: 'INV-2048',
    date_facture: new Date('2026-07-05'),
    total_ht: 2000,
    total_tva: 450,
    total_ttc: 2450,
    est_valider: true,
    est_solder: true,
    montant_regle: 2450,
    solde_du: 0,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    customer: 'Acme SAS',
    amount: '€2,450',
    issued: '05 Jul',
    status: 'Payée',
    statusLibelle: 'Payée'
  },
  {
    id: 2,
    numero: 'INV-2049',
    date_facture: new Date('2026-07-04'),
    total_ht: 700,
    total_tva: 160,
    total_ttc: 860,
    est_valider: true,
    est_solder: false,
    montant_regle: 430,
    solde_du: 430,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    customer: 'Acme SAS',
    amount: '€860',
    issued: '04 Jul',
    status: 'En attente',
    statusLibelle: 'En attente'
  },
  {
    id: 3,
    numero: 'INV-2050',
    date_facture: new Date('2026-07-03'),
    total_ht: 1100,
    total_tva: 220,
    total_ttc: 1320,
    est_valider: true,
    est_solder: false,
    montant_regle: 0,
    solde_du: 1320,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    customer: 'Acme SAS',
    amount: '€1,320',
    issued: '03 Jul',
    status: 'En retard',
    statusLibelle: 'En retard'
  }
];

export const payments: Reglement[] = [
  {
    id: 1,
    numero: 'PAY-301',
    date_paiement: new Date('2026-07-05'),
    reference: 'Carte bancaire',
    montant_regle: 1250,
    est_encaisser: true,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    method: 'Carte bancaire',
    amount: '€1,250',
    date: '05 Jul',
    status: 'Validé'
  },
  {
    id: 2,
    numero: 'PAY-302',
    date_paiement: new Date('2026-07-04'),
    reference: 'Virement',
    montant_regle: 2400,
    est_encaisser: false,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    method: 'Virement',
    amount: '€2,400',
    date: '04 Jul',
    status: 'En cours'
  },
  {
    id: 3,
    numero: 'PAY-303',
    date_paiement: new Date('2026-07-02'),
    reference: 'PayPal',
    montant_regle: 540,
    est_encaisser: true,
    est_supprime: false,
    client_id: 1,
    
    // aliases
    method: 'PayPal',
    amount: '€540',
    date: '02 Jul',
    status: 'Validé'
  }
];

export const deliveries: BonLivraison[] = [
  {
    id: 1,
    numero: 'DEL-44',
    date_livraison: new Date('2026-07-12'),
    total_ht: 2000,
    total_tva: 400,
    total_ttc: 2400,
    est_valider: true,
    est_imprimer: true,
    est_envoyer: true,
    est_desactive: false,
    adresse_livraison: '12 Rue de l’Innovation, Lyon',
    societe_livraison: 'Acme SAS',
    transporteur: 'DHL Express',
    numero_suivi: 'DHL-827361',
    
    // aliases
    order: 'ORD-1024',
    eta: 'Aujourd’hui, 16:00',
    status: 'En transit',
    address: '12 Rue de l’Innovation, Lyon'
  },
  {
    id: 2,
    numero: 'DEL-45',
    date_livraison: new Date('2026-07-13'),
    total_ht: 700,
    total_tva: 140,
    total_ttc: 840,
    est_valider: true,
    est_imprimer: true,
    est_envoyer: false,
    est_desactive: false,
    adresse_livraison: '8 Avenue des Forges, Lille',
    societe_livraison: 'Acme SAS',
    transporteur: 'FedEx',
    numero_suivi: 'FDX-998811',
    
    // aliases
    order: 'ORD-1025',
    eta: 'Demain, 10:30',
    status: 'Préparé',
    address: '8 Avenue des Forges, Lille'
  }
];

export const documents: DocumentItem[] = [
  {
    id: 1,
    client_id: 1,
    lien: '/assets/docs/contrat.pdf',
    nom: 'Contrat ERP 2026.pdf',
    est_attache_email: true,
    est_supprime: false,
    
    // aliases
    name: 'Contrat ERP 2026.pdf',
    type: 'Contrat',
    updated: 'Il y a 2 jours',
    size: '2.4 MB'
  },
  {
    id: 2,
    client_id: 1,
    lien: '/assets/docs/facture_2048.pdf',
    nom: 'Facture_2048.pdf',
    est_attache_email: false,
    est_supprime: false,
    
    // aliases
    name: 'Facture_2048.pdf',
    type: 'Facture',
    updated: 'Hier',
    size: '760 KB'
  },
  {
    id: 3,
    client_id: 1,
    lien: '/assets/docs/guide.docx',
    nom: 'Guide d’intégration.docx',
    est_attache_email: false,
    est_supprime: false,
    
    // aliases
    name: 'Guide d’intégration.docx',
    type: 'Guide',
    updated: 'Il y a 1 semaine',
    size: '1.1 MB'
  }
];

export const tickets: Ticket[] = [
  {
    id: 1,
    numero: 'TKT-118',
    client_id: 1,
    utilisateur_id: 1,
    sujet: 'Accès au portail',
    description: 'Une mise à jour d’accès est nécessaire pour l’utilisateur Claire Martin.',
    categorie: 'Compte',
    priorite: 'haute',
    status: 'ouvert',
    est_supprime: false,
    
    // aliases
    title: 'Accès au portail',
    category: 'Compte',
    priority: 'Élevée',
    updated: '10 min'
  },
  {
    id: 2,
    numero: 'TKT-119',
    client_id: 1,
    utilisateur_id: 1,
    sujet: 'Erreur de synchronisation',
    description: 'Erreur de synchronisation constatée lors du chargement des factures.',
    categorie: 'Technique',
    priorite: 'normale',
    status: 'en_cours',
    est_supprime: false,
    
    // aliases
    title: 'Erreur de synchronisation',
    category: 'Technique',
    priority: 'Moyenne',
    updated: '1 h'
  }
];

export const notifications: NotificationItem[] = [
  {
    id: 1,
    utilisateur_id: 1,
    titre: 'Paiement reçu',
    message: 'Le paiement de la facture INV-2048 a bien été traité.',
    type: 'paiement',
    lien: '/invoices',
    est_lu: false,
    date_creation: new Date('2026-07-12T06:32:00'),
    
    // aliases
    title: 'Paiement reçu',
    detail: 'Le paiement de la facture INV-2048 a bien été traité.',
    time: 'Il y a 10 min',
    read: false
  },
  {
    id: 2,
    utilisateur_id: 1,
    titre: 'Livraison prévue',
    message: 'Votre commande ORD-1024 arrive aujourd’hui avant 16:00.',
    type: 'livraison',
    lien: '/deliveries',
    est_lu: true,
    date_creation: new Date('2026-07-12T05:42:00'),
    
    // aliases
    title: 'Livraison prévue',
    detail: 'Votre commande ORD-1024 arrive aujourd’hui avant 16:00.',
    time: 'Il y a 1 h',
    read: true
  },
  {
    id: 3,
    utilisateur_id: 1,
    titre: 'Nouvelle mise à jour',
    message: 'Le portail a été mis à jour avec de nouveaux modules.',
    type: 'systeme',
    lien: '/settings',
    est_lu: true,
    date_creation: new Date('2026-07-11T06:42:00'),
    
    // aliases
    title: 'Nouvelle mise à jour',
    detail: 'Le portail a été mis à jour avec de nouveaux modules.',
    time: 'Hier',
    read: true
  }
];

export const activity: ActivityItem[] = [
  { title: 'Connexion réussie', detail: 'Vous avez ouvert le portail depuis votre bureau.', time: 'Il y a 15 min' },
  { title: 'Commande passée', detail: 'La commande ORD-1025 a été confirmée.', time: 'Il y a 2 h' },
  { title: 'Profil mis à jour', detail: 'Votre adresse de facturation a été modifiée.', time: 'Hier' }
];

export const addresses: Adresse[] = [
  {
    id: 1,
    client_id: 1,
    adresse: '12 Rue de l’Innovation',
    complement: 'Lyon',
    societe: 'Adresse principale',
    est_default: true,
    est_livraison: false,
    est_supprime: false,
    
    // aliases
    title: 'Adresse principale',
    line: '12 Rue de l’Innovation',
    city: 'Lyon',
    default: true
  },
  {
    id: 2,
    client_id: 1,
    adresse: '8 Avenue des Forges',
    complement: 'Lille',
    societe: 'Adresse de livraison',
    est_default: false,
    est_livraison: true,
    est_supprime: false,
    
    // aliases
    title: 'Adresse de livraison',
    line: '8 Avenue des Forges',
    city: 'Lille',
    default: false
  }
];
