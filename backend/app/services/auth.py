from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from datetime import datetime, timedelta

from app.extensions import db, token_blocklist
from app.models.Utilisateur import Utilisateur

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    """
    Register a new user account.
    ---
    tags:
      - Authentication
    responses:
      201:
        description: User registered successfully
      400:
        description: Missing fields
      409:
        description: Email already registered
    """
    claims = get_jwt()
    roles = claims.get('roles', [])
    if 'ROLE_ADMIN' not in roles:
        return jsonify({'error': 'Only administrators can create accounts'}), 403

    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    if len(data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    if Utilisateur.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = Utilisateur(
        email=data['email'].lower().strip(),
        nom=data.get('nom', ''),
        roles=','.join(data.get('roles', ['ROLE_CLIENT'])),
        client_id=data.get('client_id'),
        status='ACTIF'
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'User registered successfully',
        'user_id': user.id
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate user and return JWT tokens.
    ---
    tags:
      - Authentication
    responses:
      200:
        description: Login successful
      401:
        description: Invalid credentials
      403:
        description: Account blocked or deleted
    """
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = Utilisateur.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    if user.est_bloque:
        return jsonify({'error': 'Account blocked. Contact administrator.'}), 403
    if user.est_supprime:
        return jsonify({'error': 'Account deleted'}), 403

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'email': user.email,
            'roles': user.roles.split(',') if user.roles else ['ROLE_CLIENT'],
            'client_id': user.client_id
        }
    )
    refresh_token = create_refresh_token(identity=str(user.id))

    user.token = refresh_token
    user.date_token = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': 3600,
        'user': {
            'id': user.id,
            'email': user.email,
            'nom': user.nom,
            'roles': user.roles.split(',') if user.roles else ['ROLE_CLIENT'],
            'client_id': user.client_id
        }
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token.
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: New access token
      401:
        description: Invalid refresh token
    """
    current_user_id = get_jwt_identity()
    user = Utilisateur.query.get(int(current_user_id))
    if not user or user.est_bloque or user.est_supprime:
        return jsonify({'error': 'Invalid user'}), 401

    new_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'email': user.email,
            'roles': user.roles.split(',') if user.roles else ['ROLE_CLIENT'],
            'client_id': user.client_id
        }
    )
    return jsonify({'access_token': new_token}), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Revoke current JWT token.
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: Successfully logged out
    """
    jti = get_jwt()['jti']
    token_blocklist.add(jti)
    return jsonify({'message': 'Successfully logged out'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """
    Get current authenticated user info.
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: Current user info
    """
    user_id = get_jwt_identity()
    user = Utilisateur.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'nom': user.nom,
        'roles': user.roles.split(',') if user.roles else ['ROLE_CLIENT'],
        'client_id': user.client_id,
        'status': user.status,
        'date_token': user.date_token.isoformat() if user.date_token else None
    }), 200


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change current user password.
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: Password updated
      400:
        description: Current password incorrect
    """
    data = request.get_json()
    user_id = get_jwt_identity()
    user = Utilisateur.query.get(int(user_id))
    if not user.check_password(data.get('current_password')):
        return jsonify({'error': 'Current password is incorrect'}), 400
    user.set_password(data.get('new_password'))
    db.session.commit()

    jti = get_jwt()['jti']
    token_blocklist.add(jti)

    return jsonify({'message': 'Password updated successfully'}), 200