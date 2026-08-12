from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models.FamilleArticle import FamilleArticle

famille_article_bp = Blueprint('famille_article', __name__)


def _serialize_famille(famille: FamilleArticle) -> dict:
    return {
        'id': famille.id,
        'libelle': famille.libelle,
        'code': famille.code,
        'est_service': famille.est_service,
        'est_default': famille.est_default,
    }


@famille_article_bp.route('', methods=['GET'])
@jwt_required()
def list_familles():
    familles = FamilleArticle.query.filter_by(est_desactive=False).order_by(FamilleArticle.libelle.asc()).all()
    return jsonify([_serialize_famille(f) for f in familles]), 200