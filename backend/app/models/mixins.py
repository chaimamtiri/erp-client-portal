from datetime import datetime, UTC
from app.extensions import db


class AuditMixin:
    date_creation = db.Column(db.DateTime, default=datetime.now(UTC))
    date_modification = db.Column(db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))
    cree_par_id = db.Column(db.Integer, nullable=True)
    modifie_par_id = db.Column(db.Integer, nullable=True)
