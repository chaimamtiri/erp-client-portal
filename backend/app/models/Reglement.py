from app.extensions import db


class Reglement(db.Model):
    __tablename__ = 'reglement'

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(50), unique=True)
    date_paiement = db.Column(db.DateTime)
    reference = db.Column(db.String(150))
    montant_regle = db.Column(db.Numeric(14, 3))
    est_encaisser = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    type_paiement_id = db.Column(db.Integer, nullable=True)
    mode_rgelement_id = db.Column(db.Integer, nullable=True)

    details = db.relationship('DetailReglement', backref='reglement', lazy=True)
