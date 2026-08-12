import os
from flask import Flask, app

from app.config import config_by_name
from app.extensions import db, jwt, migrate, cors, limiter, ma


def create_app(config_name: str | None = None) -> Flask:
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    _register_extensions(app)
    _register_blueprints(app)

    return app


def _register_extensions(app: Flask) -> None:
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)


def _register_blueprints(app: Flask) -> None:
    from app.services.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    from app.services.famille_article import famille_article_bp
    app.register_blueprint(famille_article_bp, url_prefix='/api/v1/families')

    from app.services.bon_livraison import bon_livraison_bp
    app.register_blueprint(bon_livraison_bp, url_prefix='/api/v1/deliveries')

    from app.services.facture import facture_bp
    app.register_blueprint(facture_bp, url_prefix='/api/v1/factures')

    from app.services.activite import activity_bp
    app.register_blueprint(activity_bp, url_prefix='/api/v1/activity')

    from app.services.adresse import adresse_bp
    app.register_blueprint(adresse_bp, url_prefix='/api/v1/addresses')

    from app.services.article import article_bp
    app.register_blueprint(article_bp, url_prefix='/api/v1/articles')

    from app.services.article_commande import article_commande_bp
    app.register_blueprint(article_commande_bp, url_prefix='/api/v1/order-lines')

    from app.services.client import client_bp
    app.register_blueprint(client_bp, url_prefix='/api/v1/clients')

    from app.services.commande import commande_bp
    app.register_blueprint(commande_bp, url_prefix='/api/v1/orders')

    from app.services.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')

    from app.services.reglement import reglement_bp
    app.register_blueprint(reglement_bp, url_prefix='/api/v1/payments')

    from app.services.document import document_bp
    app.register_blueprint(document_bp, url_prefix='/api/v1/documents')

    from app.services.ticket import ticket_bp
    app.register_blueprint(ticket_bp, url_prefix='/api/v1/tickets')

    from app.services.notification import notification_bp
    app.register_blueprint(notification_bp, url_prefix='/api/v1/notifications')
    # Add this import near your other blueprint imports in backend/app/__init__.py:
