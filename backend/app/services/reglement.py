from flask import Blueprint, jsonify, request

from app.models.Reglement import Reglement
from flask_jwt_extended import jwt_required

reglement_bp = Blueprint('reglement', __name__)


def _serialize_reglement(reglement: Reglement) -> dict:
    return {
        'id': reglement.id,
        'numero': reglement.numero,
        'date_paiement': reglement.date_paiement.isoformat() if reglement.date_paiement else None,
        'reference': reglement.reference,
        'montant_regle': float(reglement.montant_regle) if reglement.montant_regle is not None else 0,
        'est_encaisser': reglement.est_encaisser,
        'est_supprime': reglement.est_supprime,
        'client_id': reglement.client_id,
        'type_paiement_id': reglement.type_paiement_id,
        'mode_rgelement_id': reglement.mode_rgelement_id,
        'method': reglement.reference,
        'amount': float(reglement.montant_regle) if reglement.montant_regle is not None else 0,
        'date': reglement.date_paiement.isoformat() if reglement.date_paiement else None,
        'status': 'Encaissé' if reglement.est_encaisser else 'En attente',
    }


@reglement_bp.route('', methods=['GET'])
@jwt_required()
def list_payments():
    client_id = request.args.get('client_id', type=int)
    query = Reglement.query.filter_by(est_supprime=False)
    if client_id:
        query = query.filter_by(client_id=client_id)
    payments = query.order_by(Reglement.date_paiement.desc()).all()
    return jsonify([_serialize_reglement(payment) for payment in payments]), 200