from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.Ticket import Ticket
from app.services.auth import token_required

ticket_bp = Blueprint('ticket', __name__)


def _serialize_ticket(ticket: Ticket) -> dict:
    return {
        'id': ticket.id,
        'numero': ticket.numero,
        'client_id': ticket.client_id,
        'utilisateur_id': ticket.utilisateur_id,
        'sujet': ticket.sujet,
        'description': ticket.description,
        'categorie': ticket.categorie,
        'priorite': ticket.priorite,
        'status': ticket.status,
        'piece_liee_type': ticket.type_piece_liee,
        'piece_liee_id': ticket.piece_liee_id,
        'est_supprime': ticket.est_supprime,
        'title': ticket.sujet,
        'category': ticket.categorie,
        'priority': ticket.priorite,
        'updated': None,
    }


@ticket_bp.route('', methods=['GET'])
@token_required
def list_tickets():
    client_id = request.args.get('client_id', type=int)
    query = Ticket.query.filter_by(est_supprime=False)
    if client_id:
        query = query.filter_by(client_id=client_id)
    tickets = query.order_by(Ticket.id.desc()).all()
    return jsonify([_serialize_ticket(ticket) for ticket in tickets]), 200


@ticket_bp.route('', methods=['POST'])
@token_required
def create_ticket():
    data = request.get_json() or {}
    ticket = Ticket(
        numero=data.get('numero'),
        client_id=data['client_id'],
        utilisateur_id=data['utilisateur_id'],
        sujet=data.get('sujet'),
        description=data.get('description'),
        categorie=data.get('categorie'),
        priorite=data.get('priorite', 'normale'),
        status=data.get('status', 'ouvert'),
        piece_liee_id=data.get('piece_liee_id'),
        type_piece_liee=data.get('piece_liee_type'),
        est_supprime=False,
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify(_serialize_ticket(ticket)), 201