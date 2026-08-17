"""
ERP Client Portal Chatbot - Flask backend
Adapted from the dental-clinic keyword-detection pattern (Next.js -> Flask/Angular).

Endpoint expected by the Angular component:
POST /api/v1/chatbot/chat
Body: { "history": [ { "role": "user" | "assistant", "content": "..." }, ... ] }
Response: { "reply": "..." }
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timezone

chatbot_bp = Blueprint('chatbot', __name__)
# NOTE: url_prefix is intentionally NOT set here — app/__init__.py already
# registers this blueprint with url_prefix='/api/v1/chatbot'.

# ---------------------------------------------------------------------------
# ERP keywords to identify on-topic questions (client portal domain)
# ---------------------------------------------------------------------------
erp_keywords = [
    # Orders
    'commande', 'commandes', 'order', 'orders', 'suivi', 'suivre', 'tracking',
    'statut', 'status', 'livraison', 'livree', 'delivery', 'expedition', 'shipping',
    'colis', 'package', 'annuler commande', 'cancel order', 'modifier commande',

    # Invoices / billing
    'facture', 'factures', 'invoice', 'invoices', 'paiement', 'payment', 'payer',
    'pay', 'facturation', 'billing', 'devis', 'quote', 'reçu', 'receipt',
    'tva', 'vat', 'montant', 'amount', 'solde', 'balance', 'echeance', 'due date',

    # Account
    'compte', 'account', 'mot de passe', 'password', 'connexion', 'login',
    'inscription', 'signup', 'profil', 'profile', 'email', 'identifiants',
    'credentials', 'deconnexion', 'logout', 'securite', 'security',

    # Address / contact
    'adresse', 'address', 'adresses', 'coordonnees', 'contact', 'telephone',
    'phone', 'siege', 'entreprise', 'company info',

    # Products / catalog / stock
    'produit', 'produits', 'product', 'products', 'catalogue', 'catalog',
    'stock', 'inventaire', 'inventory', 'disponibilite', 'availability',
    'prix', 'price', 'reference', 'sku',

    # Returns / support
    'retour', 'retours', 'return', 'returns', 'remboursement', 'refund',
    'reclamation', 'complaint', 'support', 'assistance', 'aide', 'help',
    'ticket', 'probleme', 'issue', 'bug', 'erreur', 'error',

    # Reports / dashboard (typical ERP client portal)
    'rapport', 'report', 'tableau de bord', 'dashboard', 'statistique',
    'statistics', 'export', 'telecharger', 'download',
]

# ---------------------------------------------------------------------------
# ERP knowledge base: keyword -> canned response
# ---------------------------------------------------------------------------
erp_knowledge = {
    'commande': "Vous pouvez suivre vos commandes depuis la section « Mes commandes » du portail. Indiquez-moi votre numéro de commande si vous voulez que je vérifie son statut.",
    'order': "You can track your orders from the 'My Orders' section of the portal. Share your order number if you'd like me to check its status.",
    'suivi': "Pour suivre une commande, allez dans « Mes commandes » puis cliquez sur le numéro de commande concerné pour voir son statut en temps réel.",
    'tracking': "To track an order, go to 'My Orders' and click on the relevant order number to see its live status.",
    'livraison': "Les délais de livraison standards sont de 3 à 5 jours ouvrés. Vous pouvez consulter le statut exact dans « Mes commandes ».",
    'colis': "Votre colis peut être suivi via le lien d'expédition envoyé par email, ou directement depuis votre espace « Mes commandes ».",
    'annuler commande': "Une commande peut être annulée tant qu'elle n'est pas encore expédiée. Rendez-vous dans « Mes commandes » et cliquez sur « Annuler ».",

    'facture': "Vos factures sont disponibles dans la section « Facturation ». Vous pouvez les télécharger au format PDF à tout moment.",
    'invoice': "Your invoices are available under the 'Billing' section and can be downloaded as PDF at any time.",
    'paiement': "Les paiements peuvent être effectués par carte bancaire ou virement depuis la section « Facturation ». Un reçu vous est envoyé automatiquement.",
    'payment': "Payments can be made by card or bank transfer from the 'Billing' section. A receipt is sent automatically afterwards.",
    'solde': "Votre solde actuel est visible en haut de la section « Facturation ». Contactez le support si un montant vous semble incorrect.",
    'echeance': "Les dates d'échéance de vos factures sont indiquées dans le tableau de la section « Facturation ».",

    'compte': "Vous pouvez gérer les informations de votre compte (email, mot de passe, préférences) depuis « Mon profil ».",
    'account': "You can manage your account details (email, password, preferences) from 'My Profile'.",
    'mot de passe': "Pour réinitialiser votre mot de passe, cliquez sur « Mot de passe oublié » sur la page de connexion, ou changez-le depuis « Mon profil ».",
    'password': "To reset your password, use 'Forgot password' on the login page, or change it directly from 'My Profile'.",
    'connexion': "En cas de problème de connexion, vérifiez votre email et mot de passe, ou utilisez « Mot de passe oublié ».",

    'adresse': "Vous pouvez ajouter, modifier ou supprimer vos adresses de livraison et de facturation dans « Mon profil » > « Adresses ».",
    'address': "You can add, edit, or remove your shipping and billing addresses under 'My Profile' > 'Addresses'.",

    'produit': "Le catalogue complet des produits est disponible dans la section « Produits », avec prix et disponibilité en temps réel.",
    'product': "The full product catalog is available under 'Products', with real-time pricing and availability.",
    'stock': "La disponibilité en stock est indiquée sur chaque fiche produit dans le catalogue.",

    'retour': "Pour initier un retour, allez dans « Mes commandes », sélectionnez la commande concernée puis cliquez sur « Demander un retour ».",
    'return': "To start a return, go to 'My Orders', select the relevant order, then click 'Request a return'.",
    'remboursement': "Les remboursements sont traités sous 5 à 7 jours ouvrés après réception et validation du retour.",

    'support': "Notre équipe support est disponible via le formulaire de contact ou en créant un ticket depuis « Assistance ».",
    'ticket': "Vous pouvez créer un ticket de support depuis la section « Assistance » en décrivant votre problème.",
    'probleme': "Je suis désolé pour ce désagrément. Pouvez-vous décrire le problème plus précisément, ou créer un ticket dans « Assistance » ?",

    'rapport': "Les rapports (commandes, facturation, activité) sont exportables en PDF ou Excel depuis le « Tableau de bord ».",
    'dashboard': "Your dashboard gives an overview of recent orders, invoices, and account activity.",
}

# ---------------------------------------------------------------------------
# Off-topic detection helpers
# ---------------------------------------------------------------------------
non_erp_topics = [
    'politique', 'covid', 'vaccin', 'climat', 'football', 'cinema', 'music',
    'sport', 'recette', 'cuisine', 'voiture', 'meteo', 'weather', 'amour',
    'relation', 'histoire', 'science', 'math', 'physique', 'chimie',
    'biologie', 'geologie', 'economie', 'gouvernement', 'loi', 'justice',
    'militaire', 'guerre', 'armes',
]


def is_erp_related(message: str) -> bool:
    lower_message = message.lower()
    return any(keyword in lower_message for keyword in erp_keywords)


def generate_response(message: str) -> str:
    lower_message = message.lower()

    if not is_erp_related(message):
        return (
            "Je suis l'assistant du portail client ERP. Je peux vous aider avec vos "
            "commandes, factures, adresses, produits, retours ou votre compte. "
            "Comment puis-je vous aider ?"
        )

    for keyword, response in erp_knowledge.items():
        if keyword in lower_message:
            return response

    return (
        "C'est une bonne question concernant votre espace client. Pouvez-vous préciser "
        "s'il s'agit d'une commande, d'une facture, de votre compte ou d'un produit ? "
        "Je pourrai alors vous orienter plus précisément."
    )


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------
@chatbot_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        data = request.get_json(silent=True) or {}
        history = data.get('history')

        if not history or not isinstance(history, list):
            return jsonify({'error': 'history is required and must be a list'}), 400

        # Last user message drives the keyword-based reply
        last_user_message = next(
            (m.get('content', '') for m in reversed(history) if m.get('role') == 'user'),
            ''
        )

        if not last_user_message:
            return jsonify({'error': 'No user message found in history'}), 400

        reply = generate_response(last_user_message)

        return jsonify({
            'reply': reply,
            'timestamp': datetime.now(timezone.utc).isoformat(),
        })

    except Exception as exc:
        return jsonify({'error': 'Internal server error', 'details': str(exc)}), 500