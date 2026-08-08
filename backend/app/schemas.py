from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommandeBase(BaseModel):
    numero: str
    date_commande: datetime
    date_piece: Optional[datetime] = None
    date_echeance: Optional[datetime] = None
    total_ht: float
    total_tva: float
    total_ttc: float
    est_valider: bool = False
    est_solder: bool = False
    montant_regle: float = 0
    solde_du: float = 0
    client_id: int
    status_id: Optional[int] = None

class CommandeCreate(CommandeBase):
    pass

class CommandeOut(CommandeBase):
    id: int
    est_supprime: bool
    cree_par_id: Optional[int] = None

    class Config:
        from_attributes = True