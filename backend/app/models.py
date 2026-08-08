from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from .database import Base

class Commande(Base):
    __tablename__ = "commandes"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(String, unique=True, index=True, nullable=False)
    date_commande = Column(DateTime, nullable=False)
    date_piece = Column(DateTime, nullable=True)
    date_echeance = Column(DateTime, nullable=True)
    total_ht = Column(Float, nullable=False)
    total_tva = Column(Float, nullable=False)
    total_ttc = Column(Float, nullable=False)
    est_valider = Column(Boolean, default=False)
    est_solder = Column(Boolean, default=False)
    montant_regle = Column(Float, default=0)
    solde_du = Column(Float, default=0)
    est_supprime = Column(Boolean, default=False)
    client_id = Column(Integer, nullable=False)
    status_id = Column(Integer, nullable=True)
    cree_par_id = Column(Integer, nullable=True)