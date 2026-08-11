from datetime import datetime, UTC
from app.extensions import db


class PieceJointe(db.Model):
    __tablename__ = 'piece_jointe'

    id = db.Column(db.Integer, primary_key=True)
    entite_type = db.Column(db.String(50), nullable=False)
    entite_id = db.Column(db.Integer, nullable=False)
    nom_fichier = db.Column(db.String(255), nullable=False)
    lien = db.Column(db.String(500), nullable=False)
    type_mime = db.Column(db.String(100))
    taille = db.Column(db.Integer)
    date_upload = db.Column(db.DateTime, default=datetime.now(UTC))
    uploade_par_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=True)
    est_supprime = db.Column(db.Boolean, default=False)
