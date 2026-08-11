from app.extensions import ma
from app.models.Utilisateur import Utilisateur

class UtilisateurSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Utilisateur
        load_instance = True
        include_fk = True
        fields = ("id", "email", "roles", "nom", "status", "est_bloque",
                  "est_supprime", "client_id")

utilisateur_schema = UtilisateurSchema()