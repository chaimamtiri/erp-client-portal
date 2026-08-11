from app.extensions import db


class BonLivraison(db.Model):
    __tablename__ = 'bon_livraison'

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(50), unique=True)
    date_livraison = db.Column(db.DateTime)
    date_piece = db.Column(db.DateTime)
    date_echeance = db.Column(db.DateTime)
    total_ht = db.Column(db.Numeric(14, 3))
    total_tva = db.Column(db.Numeric(14, 3))
    total_ttc = db.Column(db.Numeric(14, 3))
    est_valider = db.Column(db.Boolean, default=False)
    est_imprimer = db.Column(db.Boolean, default=False)
    est_envoyer = db.Column(db.Boolean, default=False)
    est_desactive = db.Column(db.Boolean, default=False)
    tier_id = db.Column(db.Integer, nullable=True)
    status_id = db.Column(db.Integer, nullable=True)
    mode_livraison_id = db.Column(db.Integer, nullable=True)
    adresse_livraison = db.Column(db.String(255))
    code_postal_livraison = db.Column(db.String(20))
    societe_livraison = db.Column(db.String(255))
    transporteur = db.Column(db.String(150))
    numero_suivi = db.Column(db.String(150))

    lignes = db.relationship('ArticleBonLivraison', backref='bon_livraison', lazy=True)
