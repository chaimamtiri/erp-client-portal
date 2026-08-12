from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token

from app.extensions import db
from app.models.Client import Client
from app.models.Utilisateur import Utilisateur
from app.schemas.client import ClientSchema, clients_schema, client_schema
from app.schemas.utilisateur import utilisateur_schema
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

# No url_prefix here — set once at registration time in __init__.py,
# consistent with every other blueprint.
client_bp = Blueprint('client', __name__)


@client_bp.route('', methods=['GET'])
@jwt_required()
def get_clients():
    """
    Retrieve all active (non‑deleted) clients
    ---
    tags:
      - Clients
    security:
      - Bearer: []
    responses:
      200:
        description: List of clients
        schema:
          type: array
          items:
            $ref: '#/definitions/Client'
      401:
        description: Missing or invalid token
    """
    clients = Client.query.filter_by(est_supprime=False).all()
    return clients_schema.jsonify(clients), 200


@client_bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    """
    Retrieve a single client by ID
    ---
    tags:
      - Clients
    security:
      - Bearer: []
    parameters:
      - name: client_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Client object
        schema:
          $ref: '#/definitions/Client'
      404:
        description: Client not found
      401:
        description: Unauthorized
    """
    client = Client.query.filter_by(id=client_id, est_supprime=False).first()
    if not client:
        return jsonify({"error": "Client not found"}), 404
    return client_schema.jsonify(client), 200


@client_bp.route('', methods=['POST'])
@jwt_required()
def create_client():
    """
    Create a new client (does NOT create a user)
    ---
    tags:
      - Clients
    security:
      - Bearer: []
    responses:
      201:
        description: Created client
      400:
        description: Validation errors
      409:
        description: Duplicate client code
      401:
        description: Unauthorized
    """
    claims = get_jwt()
    roles = claims.get('roles', [])
    if 'ROLE_ADMIN' not in roles:
        return jsonify({'error': 'Only administrators can create clients'}), 403

    try:
        data = client_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    try:
        client = Client(**data)
        db.session.add(client)
        db.session.commit()
    except IntegrityError:
        return jsonify({"error": "Client code already exists"}), 409

    return client_schema.jsonify(client), 201


@client_bp.route('/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    """
    Update an existing client
    ---
    tags:
      - Clients
    security:
      - Bearer: []
    responses:
      200:
        description: Updated client
      400:
        description: Validation errors
      404:
        description: Client not found
      409:
        description: Duplicate client code
      401:
        description: Unauthorized
    """
    try:
        data = client_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    client = Client.query.filter_by(id=client_id, est_supprime=False).first()
    if not client:
        return jsonify({"error": "Client not found"}), 404

    try:
        for key, value in data.items():
            setattr(client, key, value)
        db.session.commit()
    except IntegrityError:
        return jsonify({"error": "Client code already exists"}), 409

    return client_schema.jsonify(client), 200


@client_bp.route('/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    """
    Soft‑delete a client (sets est_supprime=True)
    ---
    tags:
      - Clients
    security:
      - Bearer: []
    responses:
      204:
        description: Deleted (no content)
      404:
        description: Client not found
      401:
        description: Unauthorized
    """
    claims = get_jwt()
    roles = claims.get('roles', [])
    if 'ROLE_ADMIN' not in roles:
        return jsonify({'error': 'Only administrators can delete clients'}), 403

    client = Client.query.filter_by(id=client_id, est_supprime=False).first()
    if not client:
        return jsonify({"error": "Client not found"}), 404
    client.est_supprime = True
    db.session.commit()
    return '', 204


@client_bp.route('/signup', methods=['POST'])
def signup():
    """
    Create a new client and a linked utilisateur (role='client') in one call
    ---
    tags:
      - Clients
    responses:
      201:
        description: Created client + user, returns both + JWT token
      400:
        description: Missing email/password or validation errors
      409:
        description: Duplicate code or email
    """
    data = request.json
    if not data:
        return jsonify({"error": "No input data"}), 400

    client_data = data.get('client', {})
    user_data = data.get('user', {})

    try:
        client_schema.load(client_data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    email = user_data.get('email')
    password = user_data.get('password')
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    try:
        client = Client(**client_data)
        db.session.add(client)
        db.session.flush()

        hashed = generate_password_hash(password)
        user = Utilisateur(
            email=email,
            password=hashed,
            roles='ROLE_CLIENT',
            nom=user_data.get('nom'),
            status='active',
            est_bloque=False,
            est_supprime=False,
            client_id=client.id
        )
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        return jsonify({"error": "Client code or email already exists"}), 409

    # Issue a token the same way /auth/login does, so it works against
    # every other endpoint immediately (previously used a standalone
    # generate_token() that produced an incompatible payload shape).
    token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'email': user.email,
            'roles': user.roles.split(',') if user.roles else ['ROLE_CLIENT'],
            'client_id': user.client_id
        }
    )

    return jsonify({
        "client": client_schema.dump(client),
        "user": utilisateur_schema.dump(user),
        "token": token
    }), 201