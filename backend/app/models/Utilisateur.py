from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    roles = db.Column(db.String(255))
    nom = db.Column(db.String(255))
    token = db.Column(db.String(255))
    date_token = db.Column(db.DateTime)
    code_verification = db.Column(db.String(20))
    status = db.Column(db.String(50))
    est_bloque = db.Column(db.Boolean, default=False)
    est_supprime = db.Column(db.Boolean, default=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=True)

    tickets = db.relationship('Ticket', backref='utilisateur', lazy=True, foreign_keys='Ticket.utilisateur_id')
    notifications = db.relationship('Notification', backref='utilisateur', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)