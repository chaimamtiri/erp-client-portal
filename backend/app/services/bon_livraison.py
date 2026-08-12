from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.models.BonLivraison import BonLivraison
from app.models.ArticleBonLivraison import ArticleBonLivraison

bon_livraison_bp = Blueprint('bon_livraison', __name__)


def _serialize_ligne(ligne: ArticleBonLivraison) -> dict:
    return {
        'id': ligne.id,
        'article_id': ligne.article_id,
        'nom_article': ligne.nom_article,
        'code_article': ligne.code_article,
        'quantite': float(ligne.quantite) if ligne.quantite is not None else 0,
        'quantite_transferer': float(ligne.quantite_transferer) if ligne.quantite_transferer is not None else 0,
        'prix_ht': float(ligne.prix_ht) if ligne.prix_ht is not None else 0,
        'prix_ttc': float(ligne.prix_ttc) if ligne.prix_ttc is not None else 0,
        'total_prix_ht': float(ligne.total_prix_ht) if ligne.total_prix_ht is not None else 0,
        'total_prix_ttc': float(ligne.total_prix_ttc) if ligne.total_prix_ttc is not None else 0,
    }


@bon_livraison_bp.route('', methods=['GET'])
@jwt_required()
def list_deliveries():
    # NOTE: query param is `client_id` for frontend consistency with every
    # other entity, but the underlying column on BonLivraison is `tier_id`.
    client_id = request.args.get('client_id', type=int)
    query = BonLivraison.query.filter_by(est_desactive=False)
    if client_id:
        query = query.filter_by(tier_id=client_id)
    deliveries = query.order_by(BonLivraison.date_livraison.desc()).all()
    return jsonify([
        {
            'id': d.id,
            'numero': d.numero,
            'date_livraison': d.date_livraison.isoformat() if d.date_livraison else None,
            'total_ht': float(d.total_ht) if d.total_ht else 0,
            'total_ttc': float(d.total_ttc) if d.total_ttc else 0,
            'est_valider': d.est_valider,
            'tier_id': d.tier_id,
            'transporteur': d.transporteur,
            'numero_suivi': d.numero_suivi,
        } for d in deliveries
    ]), 200


@bon_livraison_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_delivery(id):
    delivery = BonLivraison.query.get_or_404(id)
    lignes = ArticleBonLivraison.query.filter_by(
        piece_id=id, est_desactive=False
    ).all()

    return jsonify({
        'id': delivery.id,
        'numero': delivery.numero,
        'date_livraison': delivery.date_livraison.isoformat() if delivery.date_livraison else None,
        'date_piece': delivery.date_piece.isoformat() if delivery.date_piece else None,
        'date_echeance': delivery.date_echeance.isoformat() if delivery.date_echeance else None,
        'total_ht': float(delivery.total_ht) if delivery.total_ht else 0,
        'total_tva': float(delivery.total_tva) if delivery.total_tva else 0,
        'total_ttc': float(delivery.total_ttc) if delivery.total_ttc else 0,
        'est_valider': delivery.est_valider,
        'tier_id': delivery.tier_id,
        'adresse_livraison': delivery.adresse_livraison,
        'code_postal_livraison': delivery.code_postal_livraison,
        'societe_livraison': delivery.societe_livraison,
        'transporteur': delivery.transporteur,
        'numero_suivi': delivery.numero_suivi,
        'lignes': [_serialize_ligne(l) for l in lignes],
    }), 200