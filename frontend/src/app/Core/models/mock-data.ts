export interface Ticket {
  id: number;
  numero: string;
  client_id: number;
  utilisateur_id: number;
  sujet: string;
  categorie: string;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  description: string;
  date_creation: Date;
  date_modification: Date;
  est_supprime: boolean;

  // Aliases pour compatibilité frontend et affichage
  title?: string;
  category?: string;
  priority?: string;
  updated?: string;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  utilisateur_id: number;
  message: string;
  est_interne: boolean;
  date_creation: Date;
  est_supprime: boolean;

  // Aliases pour compatibilité frontend et affichage
  author?: string;
  isInternal?: boolean;
  timestamp?: string;
}

export interface TicketCategory {
  value: string;
  label: string;
}

export interface TicketPriority {
  value: 'basse' | 'normale' | 'haute' | 'urgente';
  label: string;
}

export interface address {
  id: number;
  utilisateur_id: number;
  type: 'livraison' | 'facturation' | 'principal';
  rue: string;
  numero: string;
  code_postal: string;
  ville: string;
  pays: string;
  telephone?: string;
  est_par_defaut: boolean;
  est_supprime: boolean;
  date_creation: Date;
}

export const ticketCategories: TicketCategory[] = [
  { value: 'Compte', label: 'Compte' },
  { value: 'Technique', label: 'Technique' },
  { value: 'Facturation', label: 'Facturation' },
  { value: 'Livraison', label: 'Livraison' },
  { value: 'Produit', label: 'Produit' },
  { value: 'Autre', label: 'Autre' }
];

export const ticketPriorities: TicketPriority[] = [
  { value: 'basse', label: 'Basse' },
  { value: 'normale', label: 'Normale' },
  { value: 'haute', label: 'Haute' },
  { value: 'urgente', label: 'Urgente' }
];

export const tickets: Ticket[] = [
  {
    id: 1,
    numero: 'TKT-118',
    client_id: 1,
    utilisateur_id: 1,
    sujet: 'Erreur de synchronisation',
    description: 'Erreur de synchronisation constatée lors du chargement des factures.',
    categorie: 'Technique',
    priorite: 'normale',
    status: 'en_cours',
    date_creation: new Date(),
    date_modification: new Date(),
    est_supprime: false,

    // aliases
    title: 'Erreur de synchronisation',
    category: 'Technique',
    priority: 'Moyenne',
    updated: '1 h'
  },
  {
    id: 2,
    numero: 'TKT-119',
    client_id: 1,
    utilisateur_id: 1,
    sujet: 'Problème de livraison',
    description: 'La commande n\'a pas été livrée à l\'adresse prévue.',
    categorie: 'Livraison',
    priorite: 'haute',
    status: 'ouvert',
    date_creation: new Date(),
    date_modification: new Date(),
    est_supprime: false,

    // aliases
    title: 'Problème de livraison',
    category: 'Livraison',
    priority: 'Haute',
    updated: '2 h'
  }
];

export const Adresses: address[] = [
  {
    id: 1,
    utilisateur_id: 1,
    type: 'principal',
    rue: 'Rue de la République',
    numero: '42',
    code_postal: '75001',
    ville: 'Paris',
    pays: 'France',
    telephone: '01 23 45 67 89',
    est_par_defaut: true,
    est_supprime: false,
    date_creation: new Date()
  },
  {
    id: 2,
    utilisateur_id: 1,
    type: 'livraison',
    rue: 'Avenue des Champs-Élysées',
    numero: '101',
    code_postal: '75008',
    ville: 'Paris',
    pays: 'France',
    telephone: '01 98 76 54 32',
    est_par_defaut: false,
    est_supprime: false,
    date_creation: new Date()
  }
];
