from app.extensions import db


class DetailReglement(db.Model):
    __tablename__ = 'detail_reglement'

    id = db.Column(db.Integer, primary_key=True)
    reglement_id = db.Column(db.Integer, db.ForeignKey('reglement.id'), nullable=False)
    piece_id = db.Column(db.Integer, nullable=True)
    type_piece = db.Column(db.String(50))
    montant = db.Column(db.Numeric(14, 3))
    date_echeance = db.Column(db.DateTime)
    numero_piece = db.Column(db.String(50))
    est_supprime = db.Column(db.Boolean, default=False)
