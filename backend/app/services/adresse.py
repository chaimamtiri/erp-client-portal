from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.Adresse import Adresse
from flask_jwt_extended import jwt_required

adresse_bp = Blueprint('adresse', __name__)


def _serialize_adresse(adresse: Adresse) -> dict:
    return {
        'id': adresse.id,
        'client_id': adresse.client_id,
        'adresse': adresse.adresse,
        'complement': adresse.complement,
        'ville_id': adresse.ville_id,
        'email': adresse.email,
        'societe': adresse.societe,
        'est_default': adresse.est_default,
        'est_livraison': adresse.est_livraison,
        'est_supprime': adresse.est_supprime,
        'title': adresse.societe,
        'line': adresse.adresse,
        'city': adresse.complement,
        'default': adresse.est_default,
    }


@adresse_bp.route('', methods=['GET'])
@jwt_required()
def list_addresses():
    client_id = request.args.get('client_id', type=int)
    query = Adresse.query.filter_by(est_supprime=False)
    if client_id:
        query = query.filter_by(client_id=client_id)
    addresses = query.order_by(Adresse.est_default.desc(), Adresse.id.asc()).all()
    return jsonify([_serialize_adresse(adresse) for adresse in addresses]), 200


@adresse_bp.route('', methods=['POST'])
@jwt_required()
def create_address():
    data = request.get_json() or {}
    adresse = Adresse(
        client_id=data['client_id'],
        adresse=data.get('adresse'),
        complement=data.get('complement'),
        email=data.get('email'),
        societe=data.get('societe'),
        est_default=bool(data.get('est_default', False)),
        est_livraison=bool(data.get('est_livraison', False)),
        est_supprime=False,
    )
    db.session.add(adresse)
    db.session.commit()
    return jsonify(_serialize_adresse(adresse)), 201