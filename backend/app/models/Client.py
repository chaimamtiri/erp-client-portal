from app.extensions import db
from app.models.mixins import AuditMixin


class Client(db.Model, AuditMixin):
    __tablename__ = 'client'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    nom = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    telephone = db.Column(db.String(30))
    portable = db.Column(db.String(30))
    numero_tva = db.Column(db.String(50))
    siret = db.Column(db.String(50))
    site_web = db.Column(db.String(255))
    est_bloquer = db.Column(db.Boolean, default=False)
    est_pospect = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
    famille_id = db.Column(db.Integer, nullable=True)
    mode_reglement_id = db.Column(db.Integer, nullable=True)

    utilisateurs = db.relationship('Utilisateur', backref='client', lazy=True,
                                    foreign_keys='Utilisateur.client_id')
    adresses = db.relationship('Adresse', backref='client', lazy=True)
    commandes = db.relationship('Commande', backref='client', lazy=True)
    factures = db.relationship('Facture', backref='client', lazy=True)
    reglements = db.relationship('Reglement', backref='client', lazy=True)
    documents = db.relationship('Document', backref='client', lazy=True)
