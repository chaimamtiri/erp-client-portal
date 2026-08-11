from flask import Blueprint, jsonify
from sqlalchemy import func
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.Client import Client
from app.models.Commande import Commande
from app.models.Facture import Facture
from app.models.Notification import Notification
from app.utils.decorators import client_owner_or_admin

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
@client_owner_or_admin
def get_dashboard(client_id, current_user=None):
    """
    Get personalized dashboard data for a client.
    ---
    tags:
      - Dashboard
    security:
      - Bearer: []
    parameters:
      - in: path
        name: client_id
        type: integer
        required: true
        description: Client ID
        example: 1
    responses:
      200:
        description: Dashboard data
        schema:
          type: object
          properties:
            client:
              type: object
              properties:
                id:
                  type: integer
                nom:
                  type: string
                code:
                  type: string
                solde:
                  type: number
            stats:
              type: object
              properties:
                commandes_en_cours:
                  type: integer
                factures_impayees:
                  type: integer
                notifications_non_lues:
                  type: integer
            recent_commandes:
              type: array
              items:
                type: object
            recent_factures:
              type: array
              items:
                type: object
            notifications:
              type: array
              items:
                type: object
      403:
        description: Access denied
    """
    client = Client.query.get_or_404(client_id)
    
    solde = db.session.query(
        func.coalesce(func.sum(Facture.solde_du), 0)
    ).filter(
        Facture.client_id == client_id,
        Facture.est_supprime == False,
        Facture.est_solder == False
    ).scalar() or 0
    
    recent_orders = Commande.query.filter_by(
        client_id=client_id, est_supprime=False
    ).order_by(Commande.date_commande.desc()).limit(5).all()
    
    recent_invoices = Facture.query.filter_by(
        client_id=client_id, est_supprime=False
    ).order_by(Facture.date_facture.desc()).limit(5).all()
    
    notifications = Notification.query.filter_by(
        client_id=client_id, est_lu=False
    ).order_by(Notification.date_creation.desc()).limit(10).all()
    
    pending_orders = Commande.query.filter_by(
        client_id=client_id, est_valider=False, est_supprime=False
    ).count()
    
    return jsonify({
        'client': {
            'id': client.id,
            'nom': client.nom,
            'code': client.code,
            'solde': float(solde)
        },
        'stats': {
            'commandes_en_cours': pending_orders,
            'factures_impayees': Facture.query.filter_by(
                client_id=client_id, est_solder=False, est_supprime=False
            ).count(),
            'notifications_non_lues': Notification.query.filter_by(
                client_id=client_id, est_lu=False
            ).count()
        },
        'recent_commandes': [
            {
                'id': c.id,
                'numero': c.numero,
                'date_commande': c.date_commande.isoformat() if c.date_commande else None,
                'total_ttc': float(c.total_ttc) if c.total_ttc else 0,
                'est_valider': c.est_valider
            } for c in recent_orders
        ],
        'recent_factures': [
            {
                'id': f.id,
                'numero': f.numero,
                'date_facture': f.date_facture.isoformat() if f.date_facture else None,
                'total_ttc': float(f.total_ttc) if f.total_ttc else 0,
                'solde_du': float(f.solde_du) if f.solde_du else 0,
                'est_solder': f.est_solder
            } for f in recent_invoices
        ],
        'notifications': [
            {
                'id': n.id,
                'titre': n.titre,
                'message': n.message,
                'type': n.type,
                'date_creation': n.date_creation.isoformat() if n.date_creation else None
            } for n in notifications
        ]
    }), 200