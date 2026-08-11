from app.extensions import ma
from app.models.Client import Client

class ClientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Client
        load_instance = True
        include_fk = True
        fields = ("id", "code", "nom", "email", "telephone", "portable",
                  "numero_tva", "siret", "site_web", "est_bloquer",
                  "est_pospect", "est_supprime", "famille_id",
                  "mode_reglement_id")

client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)