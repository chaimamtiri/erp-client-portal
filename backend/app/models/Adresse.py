from app.extensions import db


class Adresse(db.Model):
    __tablename__ = 'adresse'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    adresse = db.Column(db.String(255))
    complement = db.Column(db.String(255))
    ville_id = db.Column(db.Integer, nullable=True)
    email = db.Column(db.String(255))
    societe = db.Column(db.String(255))
    est_default = db.Column(db.Boolean, default=False)
    est_livraison = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
