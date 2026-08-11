from app.extensions import db
from app.models.mixins import AuditMixin


class Panier(db.Model, AuditMixin):
    __tablename__ = 'panier'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=True)
    est_valide = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)

    client = db.relationship('Client', foreign_keys=[client_id])
    lignes = db.relationship('ArticlePanier', backref='panier', lazy=True)
