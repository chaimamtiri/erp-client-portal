from datetime import datetime, UTC
from app.extensions import db


class ArticlePanier(db.Model):
    __tablename__ = 'article_panier'

    id = db.Column(db.Integer, primary_key=True)
    panier_id = db.Column(db.Integer, db.ForeignKey('panier.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    quantite = db.Column(db.Numeric(12, 3), nullable=False, default=1)
    prix_ht = db.Column(db.Numeric(12, 3))
    prix_ttc = db.Column(db.Numeric(12, 3))
    date_ajout = db.Column(db.DateTime, default=datetime.now(UTC))

    article = db.relationship('Article')
