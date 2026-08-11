from app.extensions import db


class SousFamilleArticle(db.Model):
    __tablename__ = 'sous_famille_article'

    id = db.Column(db.Integer, primary_key=True)
    famille_article_id = db.Column(db.Integer, db.ForeignKey('famille_article.id'), nullable=False)
    libelle = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50))
    est_default = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)

    articles = db.relationship('Article', backref='sous_famille_article', lazy=True,foreign_keys='Article.sous_famille_article_id')
