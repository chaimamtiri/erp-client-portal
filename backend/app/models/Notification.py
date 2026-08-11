from datetime import datetime, UTC
from app.extensions import db

class Notification(db.Model):
    __tablename__ = 'notification'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)  # Changed from utilisateur_id
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=True)
    titre = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text)
    type = db.Column(db.String(50))
    lien = db.Column(db.String(500))
    entite_type = db.Column(db.String(50), nullable=True)
    entite_id = db.Column(db.Integer, nullable=True)
    est_lu = db.Column(db.Boolean, default=False)
    date_creation = db.Column(db.DateTime, default=datetime.now(UTC))