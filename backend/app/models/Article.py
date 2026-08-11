from app.extensions import db


class Article(db.Model):
    __tablename__ = 'article'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(255), nullable=False)
    reference = db.Column(db.String(100), unique=True)
    description = db.Column(db.Text)
    prix_vente_ht = db.Column(db.Numeric(12, 3))
    prix_vente_ttc = db.Column(db.Numeric(12, 3))
    est_affiche_ttc = db.Column(db.Boolean, default=False)
    est_service = db.Column(db.Boolean, default=False)
    image = db.Column(db.String(255))
    est_bloque = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
    tva_id = db.Column(db.Integer, db.ForeignKey('tva.id'), nullable=True)
    famille_article_id = db.Column(db.Integer, db.ForeignKey('famille_article.id'), nullable=True)
    sous_famille_article_id = db.Column(db.Integer, db.ForeignKey('sous_famille_article.id'), nullable=True)
    unite_id = db.Column(db.Integer, nullable=True)
    stock_disponible = db.Column(db.Numeric(12, 3), default=0)
