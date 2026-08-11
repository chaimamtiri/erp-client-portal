from app.extensions import db


class ArticleCommande(db.Model):
    __tablename__ = 'article_commande'

    id = db.Column(db.Integer, primary_key=True)
    piece_id = db.Column(db.Integer, db.ForeignKey('commande.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=True)
    nom_article = db.Column(db.String(255))
    reference = db.Column(db.String(100))
    quantite = db.Column(db.Numeric(12, 3))
    prix_ht = db.Column(db.Numeric(12, 3))
    prix_ttc = db.Column(db.Numeric(12, 3))
    total_prix_ht = db.Column(db.Numeric(14, 3))
    total_prix_ttc = db.Column(db.Numeric(14, 3))
    taux_tva = db.Column(db.Numeric(5, 2))
    valeur_tva = db.Column(db.Numeric(12, 3))
    total_valeur_tva = db.Column(db.Numeric(14, 3))
    taux_remise = db.Column(db.Numeric(5, 2))
    valeur_remise = db.Column(db.Numeric(12, 3))
    ordre = db.Column(db.Integer)
    est_commentaire = db.Column(db.Boolean, default=False)
    est_sous_total = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
