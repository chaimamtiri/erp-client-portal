from datetime import datetime, UTC
from app.extensions import db


class MessageTicket(db.Model):
    __tablename__ = 'message_ticket'

    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=True)
    auteur_client = db.Column(db.Boolean, default=True)
    contenu = db.Column(db.Text, nullable=False)
    date_envoi = db.Column(db.DateTime, default=datetime.now(UTC))
    est_lu = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
