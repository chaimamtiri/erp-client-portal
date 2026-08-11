from app.extensions import db


class ArticleBonLivraison(db.Model):
    __tablename__ = 'article_bon_livraison'

    id = db.Column(db.Integer, primary_key=True)
    piece_id = db.Column(db.Integer, db.ForeignKey('bon_livraison.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=True)
    nom_article = db.Column(db.String(255))
    code_article = db.Column(db.String(100))
    quantite = db.Column(db.Numeric(12, 3))
    quantite_transferer = db.Column(db.Numeric(12, 3))
    prix_ht = db.Column(db.Numeric(12, 3))
    prix_ttc = db.Column(db.Numeric(12, 3))
    total_prix_ht = db.Column(db.Numeric(14, 3))
    total_prix_ttc = db.Column(db.Numeric(14, 3))
    taux_tva = db.Column(db.Numeric(5, 2))
    valeur_tva = db.Column(db.Numeric(12, 3))
    est_sous_total = db.Column(db.Boolean, default=False)
    est_desactive = db.Column(db.Boolean, default=False)
