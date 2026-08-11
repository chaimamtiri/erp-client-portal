from app.extensions import db


class Document(db.Model):
    __tablename__ = 'document'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    lien = db.Column(db.String(500))
    nom = db.Column(db.String(255))
    est_attache_email = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
