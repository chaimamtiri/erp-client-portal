from flask import Blueprint, jsonify, request

from app.models.Article import Article
from flask_jwt_extended import jwt_required

article_bp = Blueprint('article', __name__)


def _serialize_article(article: Article) -> dict:
    return {
        'id': article.id,
        'nom': article.nom,
        'reference': article.reference,
        'description': article.description,
        'prix_vente_ht': float(article.prix_vente_ht) if article.prix_vente_ht is not None else 0,
        'prix_vente_ttc': float(article.prix_vente_ttc) if article.prix_vente_ttc is not None else 0,
        'est_affiche_ttc': article.est_affiche_ttc,
        'est_service': article.est_service,
        'image': article.image,
        'est_bloque': article.est_bloque,
        'est_supprime': article.est_supprime,
        'tva_id': article.tva_id,
        'famille_article_id': article.famille_article_id,
        'sous_famille_article_id': article.sous_famille_article_id,
        'unite_id': article.unite_id,
        'stock_disponible': float(article.stock_disponible) if article.stock_disponible is not None else 0,
    }


@article_bp.route('', methods=['GET'])
@jwt_required()
def list_articles():
    only_active = request.args.get('active', 'true').lower() == 'true'
    query = Article.query
    if only_active:
        query = query.filter_by(est_supprime=False, est_bloque=False)
    articles = query.order_by(Article.nom.asc()).all()
    return jsonify([_serialize_article(article) for article in articles]), 200


@article_bp.route('/<int:article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id: int):
    article = Article.query.get_or_404(article_id)
    return jsonify(_serialize_article(article)), 200