from app.extensions import db
from app.models.mixins import AuditMixin


class Ticket(db.Model, AuditMixin):
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(50), unique=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)
    sujet = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    categorie = db.Column(db.String(100))
    priorite = db.Column(db.String(20), default='normale')
    status = db.Column(db.String(50), default='ouvert')
    piece_liee_id = db.Column(db.Integer, nullable=True)
    type_piece_liee = db.Column(db.String(50), nullable=True)
    est_supprime = db.Column(db.Boolean, default=False)

    client = db.relationship('Client', foreign_keys=[client_id])
    messages = db.relationship('MessageTicket', backref='ticket', lazy=True)
    pieces_jointes = db.relationship('PieceJointe',primaryjoin="and_(PieceJointe.entite_type=='ticket', ""foreign(PieceJointe.entite_id)==Ticket.id)",viewonly=True, lazy=True)
