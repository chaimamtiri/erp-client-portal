# app/models/JournalAudit.py

from app.extensions import db
from datetime import datetime
from flask import request

class JournalAudit(db.Model):
    __tablename__ = 'journal_audit'
    
    id = db.Column(db.Integer, primary_key=True)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    action = db.Column(db.String(50))
    entite_type = db.Column(db.String(50))
    entite_id = db.Column(db.Integer)
    details = db.Column(db.JSON)
    adresse_ip = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    date_action = db.Column(db.DateTime, default=datetime.utcnow)
    
    @classmethod
    def log_action(cls, utilisateur_id=None, client_id=None, action=None,
                   entite_type=None, entite_id=None, details=None):
        log = cls(
            utilisateur_id=utilisateur_id,
            client_id=client_id,
            action=action,
            entite_type=entite_type,
            entite_id=entite_id,
            details=details,
            adresse_ip=request.remote_addr if request else None,
            user_agent=request.user_agent.string if request and request.user_agent else None
        )
        db.session.add(log)
        db.session.commit()
        return log