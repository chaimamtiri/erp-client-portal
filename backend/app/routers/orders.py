from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/commandes", tags=["Commandes"])

@router.get("/", response_model=List[schemas.CommandeOut])
def get_commandes(db: Session = Depends(get_db)):
    return db.query(models.Commande).filter(models.Commande.est_supprime == False).all()

@router.get("/{commande_id}", response_model=schemas.CommandeOut)
def get_commande(commande_id: int, db: Session = Depends(get_db)):
    commande = db.query(models.Commande).filter(models.Commande.id == commande_id).first()
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande

@router.post("/", response_model=schemas.CommandeOut)
def create_commande(commande: schemas.CommandeCreate, db: Session = Depends(get_db)):
    db_commande = models.Commande(**commande.model_dump())
    db.add(db_commande)
    db.commit()
    db.refresh(db_commande)
    return db_commande

@router.put("/{commande_id}", response_model=schemas.CommandeOut)
def update_commande(commande_id: int, commande: schemas.CommandeCreate, db: Session = Depends(get_db)):
    db_commande = db.query(models.Commande).filter(models.Commande.id == commande_id).first()
    if not db_commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    for key, value in commande.model_dump().items():
        setattr(db_commande, key, value)
    db.commit()
    db.refresh(db_commande)
    return db_commande

@router.delete("/{commande_id}")
def delete_commande(commande_id: int, db: Session = Depends(get_db)):
    db_commande = db.query(models.Commande).filter(models.Commande.id == commande_id).first()
    if not db_commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    db_commande.est_supprime = True  # soft delete
    db.commit()
    return {"ok": True}