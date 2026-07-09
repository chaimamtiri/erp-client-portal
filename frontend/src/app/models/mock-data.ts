export interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: string;
  tone: 'accent' | 'success' | 'warning' | 'neutral';
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: string;
  rating: number;
  image: string;
}

export interface Order {
  id: number;
  numero: string;
  dateCommande: Date;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  estValider: boolean;
  estSolder: boolean;
  montantRegle: number;
  soldeDu: number;
  clientNom: string;
  statusLibelle: string;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: string;
  issued: string;
  status: string;
}

export interface Payment {
  id: string;
  method: string;
  amount: string;
  date: string;
  status: string;
}

export interface Delivery {
  id: string;
  order: string;
  eta: string;
  status: string;
  address: string;
}

export interface DocumentItem {
  name: string;
  type: string;
  updated: string;
  size: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  updated: string;
}

export interface NotificationItem {
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

export interface ActivityItem {
  title: string;
  detail: string;
  time: string;
}

export interface AddressItem {
  title: string;
  line: string;
  city: string;
  default: boolean;
}

export const stats: StatItem[] = [
  { title: 'Revenus', value: '€184.2k', change: '+12.4%', icon: 'payments', tone: 'accent' },
  { title: 'Commandes', value: '1,248', change: '+8.1%', icon: 'shopping_bag', tone: 'success' },
  { title: 'Factures', value: '324', change: '-2.3%', icon: 'receipt_long', tone: 'warning' },
  { title: 'Tickets', value: '19', change: '+4.5%', icon: 'support_agent', tone: 'neutral' }
];

export const products: Product[] = [
  { id: 1, name: 'ERP Pro Suite', category: 'Logiciels', price: 980, stock: 'En stock', rating: 4.9, image: '📦' },
  { id: 2, name: 'Terminal Mobile', category: 'Matériel', price: 640, stock: '3 restants', rating: 4.7, image: '📱' },
  { id: 3, name: 'Pack Analytics', category: 'Services', price: 320, stock: 'En stock', rating: 4.8, image: '📊' },
  { id: 4, name: 'Assistant IA', category: 'Logiciels', price: 540, stock: 'En stock', rating: 4.6, image: '🤖' }
];

export const orders: Order[] = [
  {
    id: 1,
    numero: 'ORD-1024',
    dateCommande: new Date('2026-07-05'),
    totalHT: 2000,
    totalTVA: 400,
    totalTTC: 2450,
    estValider: true,
    estSolder: true,
    montantRegle: 2450,
    soldeDu: 0,
    clientNom: 'A. Martin',
    statusLibelle: 'Expédiée'
  },
  {
    id: 2,
    numero: 'ORD-1025',
    dateCommande: new Date('2026-07-04'),
    totalHT: 700,
    totalTVA: 140,
    totalTTC: 860,
    estValider: true,
    estSolder: false,
    montantRegle: 430,
    soldeDu: 430,
    clientNom: 'L. Bernard',
    statusLibelle: 'En cours'
  },
  {
    id: 3,
    numero: 'ORD-1026',
    dateCommande: new Date('2026-07-03'),
    totalHT: 1100,
    totalTVA: 220,
    totalTTC: 1320,
    estValider: false,
    estSolder: false,
    montantRegle: 0,
    soldeDu: 1320,
    clientNom: 'S. Dupont',
    statusLibelle: 'Confirmée'
  }
];

export const invoices: Invoice[] = [
  { id: 'INV-2048', customer: 'A. Martin', amount: '€2,450', issued: '05 Jul', status: 'Payée' },
  { id: 'INV-2049', customer: 'L. Bernard', amount: '€860', issued: '04 Jul', status: 'En attente' },
  { id: 'INV-2050', customer: 'S. Dupont', amount: '€1,320', issued: '03 Jul', status: 'En retard' }
];

export const payments: Payment[] = [
  { id: 'PAY-301', method: 'Carte bancaire', amount: '€1,250', date: '05 Jul', status: 'Validé' },
  { id: 'PAY-302', method: 'Virement', amount: '€2,400', date: '04 Jul', status: 'En cours' },
  { id: 'PAY-303', method: 'PayPal', amount: '€540', date: '02 Jul', status: 'Validé' }
];

export const deliveries: Delivery[] = [
  { id: 'DEL-44', order: 'ORD-1024', eta: 'Aujourd’hui, 16:00', status: 'En transit', address: '12 Rue de l’Innovation, Lyon' },
  { id: 'DEL-45', order: 'ORD-1025', eta: 'Demain, 10:30', status: 'Préparé', address: '8 Avenue des Forges, Lille' }
];

export const documents: DocumentItem[] = [
  { name: 'Contrat ERP 2026.pdf', type: 'Contrat', updated: 'Il y a 2 jours', size: '2.4 MB' },
  { name: 'Facture_2048.pdf', type: 'Facture', updated: 'Hier', size: '760 KB' },
  { name: 'Guide d’intégration.docx', type: 'Guide', updated: 'Il y a 1 semaine', size: '1.1 MB' }
];

export const tickets: Ticket[] = [
  { id: 'TKT-118', title: 'Accès au portail', category: 'Compte', priority: 'Élevée', status: 'Ouverte', updated: '10 min' },
  { id: 'TKT-119', title: 'Erreur de synchronisation', category: 'Technique', priority: 'Moyenne', status: 'En cours', updated: '1 h' }
];

export const notifications: NotificationItem[] = [
  { title: 'Paiement reçu', detail: 'Le paiement de la facture INV-2048 a bien été traité.', time: 'Il y a 10 min', read: false },
  { title: 'Livraison prévue', detail: 'Votre commande ORD-1024 arrive aujourd’hui avant 16:00.', time: 'Il y a 1 h', read: true },
  { title: 'Nouvelle mise à jour', detail: 'Le portail a été mis à jour avec de nouveaux modules.', time: 'Hier', read: true }
];

export const activity: ActivityItem[] = [
  { title: 'Connexion réussie', detail: 'Vous avez ouvert le portail depuis votre bureau.', time: 'Il y a 15 min' },
  { title: 'Commande passée', detail: 'La commande ORD-1025 a été confirmée.', time: 'Il y a 2 h' },
  { title: 'Profil mis à jour', detail: 'Votre adresse de facturation a été modifiée.', time: 'Hier' }
];

export const addresses: AddressItem[] = [
  { title: 'Adresse principale', line: '12 Rue de l’Innovation', city: 'Lyon', default: true },
  { title: 'Adresse de livraison', line: '8 Avenue des Forges', city: 'Lille', default: false }
];

