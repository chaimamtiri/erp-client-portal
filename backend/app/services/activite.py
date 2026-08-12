from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.JournalAudit import JournalAudit
from app.models.Utilisateur import Utilisateur

activity_bp = Blueprint('activity', __name__)


@activity_bp.route('', methods=['GET'])
@jwt_required()
def list_activity():
    user_id = get_jwt_identity()
    user = Utilisateur.query.get(user_id)

    if not user:
        return jsonify([]), 200

    is_admin = bool(user.roles and 'ROLE_ADMIN' in user.roles)

    query = JournalAudit.query.order_by(JournalAudit.date_action.desc())

    if not is_admin:
        if not user.client_id:
            return jsonify([]), 200
        query = query.filter(JournalAudit.client_id == user.client_id)

    audits = query.limit(20).all()

    return jsonify([
        {
            'title': f'{audit.action or "Action"} {audit.entite_type or ""}'.strip(),
            'detail': audit.details or {},
            'time': audit.date_action.isoformat() if audit.date_action else None,
        }
        for audit in audits
    ]), 200