from app.extensions import db


class FamilleArticle(db.Model):
    __tablename__ = 'famille_article'

    id = db.Column(db.Integer, primary_key=True)
    libelle = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50))
    est_service = db.Column(db.Boolean, default=False)
    est_default = db.Column(db.Boolean, default=False)
    est_desactive = db.Column(db.Boolean, default=False)

    sous_familles = db.relationship('SousFamilleArticle', backref='famille_article', lazy=True)
    articles = db.relationship('Article', backref='famille_article', lazy=True,foreign_keys='Article.famille_article_id')
