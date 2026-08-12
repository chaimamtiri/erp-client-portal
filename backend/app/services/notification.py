from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.models.Notification import Notification

notification_bp = Blueprint('notification', __name__)


def _serialize_notification(notification: Notification) -> dict:
    return {
        'id': notification.id,
        'client_id': notification.client_id,
        'utilisateur_id': notification.utilisateur_id,
        'titre': notification.titre,
        'message': notification.message,
        'type': notification.type,
        'lien': notification.lien,
        'entite_type': notification.entite_type,
        'entite_id': notification.entite_id,
        'est_lu': notification.est_lu,
        'date_creation': notification.date_creation.isoformat() if notification.date_creation else None,
        'title': notification.titre,
        'detail': notification.message,
        'time': notification.date_creation.isoformat() if notification.date_creation else None,
        'read': notification.est_lu,
    }


@notification_bp.route('', methods=['GET'])
@jwt_required()
def list_notifications():
    client_id = request.args.get('client_id', type=int)
    query = Notification.query
    if client_id:
        query = query.filter_by(client_id=client_id)
    notifications = query.order_by(Notification.date_creation.desc()).all()
    return jsonify([_serialize_notification(notification) for notification in notifications]), 200