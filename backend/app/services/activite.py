from flask import Blueprint, jsonify

from app.models.JournalAudit import JournalAudit
from app.services.auth import token_required

activity_bp = Blueprint('activity', __name__)


@activity_bp.route('', methods=['GET'])
@token_required
def list_activity():
    audits = JournalAudit.query.order_by(JournalAudit.date_action.desc()).limit(20).all()
    return jsonify([
        {
            'title': f'{audit.action or "Action"} {audit.entite_type or ""}'.strip(),
            'detail': audit.details or {},
            'time': audit.date_action.isoformat() if audit.date_action else None,
        }
        for audit in audits
    ]), 200