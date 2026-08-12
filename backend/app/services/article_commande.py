from flask import Blueprint, jsonify, request

from app.models.ArticleCommande import ArticleCommande
from flask_jwt_extended import jwt_required

article_commande_bp = Blueprint('article_commande', __name__)


@article_commande_bp.route('', methods=['GET'])
@jwt_required()
def list_order_lines():
    commande_id = request.args.get('commande_id', type=int)
    query = ArticleCommande.query.filter_by(est_supprime=False)
    if commande_id:
        query = query.filter_by(piece_id=commande_id)
    lines = query.order_by(ArticleCommande.ordre.asc().nullslast()).all()
    return jsonify([
        {
            'id': line.id,
            'commande_id': line.piece_id,
            'article_id': line.article_id,
            'designation': line.nom_article,
            'reference': line.reference,
            'quantite': float(line.quantite) if line.quantite is not None else 0,
            'prix_unitaire_ht': float(line.prix_ht) if line.prix_ht is not None else 0,
            'total_ht': float(line.total_prix_ht) if line.total_prix_ht is not None else 0,
            'image': None,
            'est_supprime': line.est_supprime,
        }
        for line in lines
    ]), 200