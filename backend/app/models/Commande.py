from app.extensions import db


class Commande(db.Model):
    __tablename__ = 'commande'

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(50), unique=True)
    date_commande = db.Column(db.DateTime)
    date_piece = db.Column(db.DateTime)
    date_echeance = db.Column(db.DateTime)
    total_ht = db.Column(db.Numeric(14, 3))
    total_tva = db.Column(db.Numeric(14, 3))
    total_ttc = db.Column(db.Numeric(14, 3))
    est_valider = db.Column(db.Boolean, default=False)
    est_solder = db.Column(db.Boolean, default=False)
    montant_regle = db.Column(db.Numeric(14, 3), default=0)
    solde_du = db.Column(db.Numeric(14, 3), default=0)
    est_supprime = db.Column(db.Boolean, default=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    status_id = db.Column(db.Integer, nullable=True)
    cree_par_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=True)

    lignes = db.relationship('ArticleCommande', backref='commande', lazy=True)
    historique_statuts = db.relationship('HistoriqueStatutCommande', backref='commande', lazy=True)
