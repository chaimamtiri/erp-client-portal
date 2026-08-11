from app.extensions import db


class Tva(db.Model):
    __tablename__ = 'tva'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20))
    libelle = db.Column(db.String(100))
    valeur = db.Column(db.Numeric(5, 2), nullable=False)
    est_default = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)

    articles = db.relationship('Article', backref='tva', lazy=True)
