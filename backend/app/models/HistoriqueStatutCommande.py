from datetime import datetime, UTC
from app.extensions import db


class HistoriqueStatutCommande(db.Model):
    __tablename__ = 'historique_statut_commande'

    id = db.Column(db.Integer, primary_key=True)
    commande_id = db.Column(db.Integer, db.ForeignKey('commande.id'), nullable=False)
    ancien_status_id = db.Column(db.Integer, nullable=True)
    nouveau_status_id = db.Column(db.Integer, nullable=True)
    commentaire = db.Column(db.Text)
    date_changement = db.Column(db.DateTime, default=datetime.now(UTC))
    modifie_par_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=True)
