from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_marshmallow import Marshmallow 

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()
limiter = Limiter(key_func=get_remote_address)
ma = Marshmallow()

# Token blocklist (replace with Redis in production)
token_blocklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload.get('jti') in token_blocklist