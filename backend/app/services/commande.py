from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.Commande import Commande
from app.models.ArticleCommande import ArticleCommande
from app.models.Utilisateur import Utilisateur
from app.utils.decorators import client_owner_or_admin
from app.models.HistoriqueStatutCommande import HistoriqueStatutCommande

commande_bp = Blueprint('commande', __name__)

@commande_bp.route('', methods=['GET'])
@jwt_required()
def list_commandes():
    """
    List orders with filters and pagination.
    ---
    tags:
      - Commandes
    security:
      - Bearer: []
    parameters:
      - in: query
        name: client_id
        type: integer
        required: true
        description: Filter by client ID
      - in: query
        name: page
        type: integer
        default: 1
      - in: query
        name: per_page
        type: integer
        default: 20
      - in: query
        name: numero
        type: string
        description: Search by order number
      - in: query
        name: date_debut
        type: string
        format: date
      - in: query
        name: date_fin
        type: string
        format: date
      - in: query
        name: est_valider
        type: boolean
      - in: query
        name: sort_by
        type: string
        default: date_commande
      - in: query
        name: sort_order
        type: string
        default: desc
    responses:
      200:
        description: Paginated list of orders
        schema:
          type: object
          properties:
            items:
              type: array
            total:
              type: integer
            pages:
              type: integer
            current_page:
              type: integer
            per_page:
              type: integer
      400:
        description: client_id required
    """
    client_id = request.args.get('client_id', type=int)
    if not client_id:
        return jsonify({'error': 'client_id parameter is required'}), 400
    
    current_user = Utilisateur.query.get(int(get_jwt_identity()))
    roles = current_user.roles or []
    if isinstance(roles, str):
        roles = [roles]
    if 'ROLE_ADMIN' not in roles and current_user.client_id != client_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    query = Commande.query.filter_by(client_id=client_id, est_supprime=False)
    
    if request.args.get('numero'):
        query = query.filter(Commande.numero.ilike(f"%{request.args.get('numero')}%"))
    
    if request.args.get('date_debut'):
        query = query.filter(Commande.date_commande >= request.args.get('date_debut'))
    
    if request.args.get('date_fin'):
        query = query.filter(Commande.date_commande <= request.args.get('date_fin'))
    
    if request.args.get('est_valider') is not None:
        est_valider = request.args.get('est_valider').lower() == 'true'
        query = query.filter(Commande.est_valider == est_valider)
    
    sort_by = request.args.get('sort_by', 'date_commande')
    sort_order = request.args.get('sort_order', 'desc')
    if sort_order == 'desc':
        query = query.order_by(getattr(Commande, sort_by).desc())
    else:
        query = query.order_by(getattr(Commande, sort_by).asc())
    
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'items': [
            {
                'id': c.id,
                'numero': c.numero,
                'date_commande': c.date_commande.isoformat() if c.date_commande else None,
                'total_ht': float(c.total_ht) if c.total_ht else 0,
                'total_ttc': float(c.total_ttc) if c.total_ttc else 0,
                'est_valider': c.est_valider,
                'est_solder': c.est_solder,
                'solde_du': float(c.solde_du) if c.solde_du else 0
            } for c in pagination.items
        ],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page
    }), 200

@commande_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
@client_owner_or_admin
def get_commande(id, current_user=None):
    """
    Get order details with articles.
    ---
    tags:
      - Commandes
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: integer
        required: true
        description: Order ID
    responses:
      200:
        description: Order details with articles
        schema:
          type: object
          properties:
            id:
              type: integer
            numero:
              type: string
            date_commande:
              type: string
            total_ht:
              type: number
            total_tva:
              type: number
            total_ttc:
              type: number
            est_valider:
              type: boolean
            est_solder:
              type: boolean
            solde_du:
              type: number
            articles:
              type: array
              items:
                type: object
      404:
        description: Order not found
    """
    commande = Commande.query.get_or_404(id)
    
    articles = ArticleCommande.query.filter_by(
        piece_id=id, est_supprime=False
    ).order_by(ArticleCommande.ordre).all()
    
    return jsonify({
        'id': commande.id,
        'numero': commande.numero,
        'date_commande': commande.date_commande.isoformat() if commande.date_commande else None,
        'date_piece': commande.date_piece.isoformat() if commande.date_piece else None,
        'date_echeance': commande.date_echeance.isoformat() if commande.date_echeance else None,
        'total_ht': float(commande.total_ht) if commande.total_ht else 0,
        'total_tva': float(commande.total_tva) if commande.total_tva else 0,
        'total_ttc': float(commande.total_ttc) if commande.total_ttc else 0,
        'est_valider': commande.est_valider,
        'est_solder': commande.est_solder,
        'solde_du': float(commande.solde_du) if commande.solde_du else 0,
        'client_id': commande.client_id,
        'articles': [
            {
                'id': a.id,
                'nom_article': a.nom_article,
                'reference': a.reference,
                'quantite': float(a.quantite) if a.quantite else 0,
                'prix_ht': float(a.prix_ht) if a.prix_ht else 0,
                'prix_ttc': float(a.prix_ttc) if a.prix_ttc else 0,
                'total_prix_ht': float(a.total_prix_ht) if a.total_prix_ht else 0,
                'total_prix_ttc': float(a.total_prix_ttc) if a.total_prix_ttc else 0,
                'taux_tva': float(a.taux_tva) if a.taux_tva else 0,
                'taux_remise': float(a.taux_remise) if a.taux_remise else 0
            } for a in articles
        ]
    }), 200

@commande_bp.route('/<int:id>/tracking', methods=['GET'])
@jwt_required()
@client_owner_or_admin
def get_commande_tracking(id, current_user=None):
    """
    Get status history for an order.
    ---
    tags:
      - Commandes
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: integer
        required: true
    responses:
      200:
        description: Chronological list of status changes
        schema:
          type: array
          items:
            type: object
    """
    history = HistoriqueStatutCommande.query.filter_by(
        commande_id=id
    ).order_by(HistoriqueStatutCommande.date_changement.asc()).all()

    return jsonify([
        {
            'id': h.id,
            'ancien_status_id': h.ancien_status_id,
            'nouveau_status_id': h.nouveau_status_id,
            'commentaire': h.commentaire,
            'date_changement': h.date_changement.isoformat() if h.date_changement else None
        } for h in history
    ]), 200