# backend/app/__init__.py
import os
from flask import Flask
from app.extensions import db, jwt, migrate, cors, limiter, ma

# =============================================================================
# CONFIG FLAGS
# =============================================================================
RESET_USERS_ON_STARTUP = False  # Set True once if you need to reset admin
ADMIN_EMAIL = 'admin@erp.local'
ADMIN_PASSWORD = 'Admin123456789'
ADMIN_NAME = 'Admin'


def create_app():
    app = Flask(__name__)

    # =========================================================================
    # CONFIG
    # =========================================================================
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///erp.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-change-in-production')

    # =========================================================================
    # INIT EXTENSIONS
    # =========================================================================
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)

    # =========================================================================
    # REGISTER BLUEPRINTS
    # =========================================================================
    from app.services.auth import auth_bp      # ← YOUR auth file
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    # Add other blueprints here as you create them:
    # from app.routes.client import client_bp
    # app.register_blueprint(client_bp, url_prefix='/api/v1/clients')

    # =========================================================================
    # CREATE TABLES + ADMIN
    # =========================================================================
    with app.app_context():
        db.create_all()
        ensure_default_admin_user()

    return app


def ensure_default_admin_user():
    from app.models.Utilisateur import Utilisateur
    
    admin = Utilisateur.query.filter_by(email=ADMIN_EMAIL).first()
    if not admin:
        new_admin = Utilisateur(
            nom=ADMIN_NAME,
            email=ADMIN_EMAIL,
            roles='ROLE_ADMIN',
            status='ACTIF',
            est_bloque=False,
            est_supprime=False
        )
        new_admin.set_password(ADMIN_PASSWORD)
        db.session.add(new_admin)
        db.session.commit()
        print(f"✅ Admin created: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    else:
        print(f"ℹ️  Admin exists: {ADMIN_EMAIL}")