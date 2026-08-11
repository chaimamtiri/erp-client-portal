from flask import Blueprint, jsonify, request

from app.models.Document import Document
from app.services.auth import token_required

document_bp = Blueprint('document', __name__)


def _serialize_document(document: Document) -> dict:
    return {
        'id': document.id,
        'client_id': document.client_id,
        'lien': document.lien,
        'nom': document.nom,
        'est_attache_email': document.est_attache_email,
        'est_supprime': document.est_supprime,
        'name': document.nom,
        'type': document.nom.rsplit('.', 1)[-1].upper() if document.nom and '.' in document.nom else 'DOC',
        'updated': None,
        'size': None,
    }


@document_bp.route('', methods=['GET'])
@token_required
def list_documents():
    client_id = request.args.get('client_id', type=int)
    query = Document.query.filter_by(est_supprime=False)
    if client_id:
        query = query.filter_by(client_id=client_id)
    documents = query.order_by(Document.id.desc()).all()
    return jsonify([_serialize_document(document) for document in documents]), 200