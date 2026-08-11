from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from app.models.Utilisateur import Utilisateur

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        roles = claims.get('roles', [])
        if isinstance(roles, str):
            roles = [roles]
        if 'ROLE_ADMIN' not in roles:
            return jsonify({'error': 'Admin privileges required'}), 403
        return fn(*args, **kwargs)
    return wrapper

def client_owner_or_admin(fn):
    """Ensure user can only access their own client data"""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = Utilisateur.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Admin bypass
        roles = user.roles or []
        if isinstance(roles, str):
            roles = [roles]
        if 'ROLE_ADMIN' in roles:
            return fn(*args, **kwargs)
        
        # Extract client_id from kwargs or args
        target_client_id = kwargs.get('client_id') or kwargs.get('id')
        
        if target_client_id and user.client_id != int(target_client_id):
            return jsonify({'error': 'Access denied for this client'}), 403
            
        # Inject current user into kwargs for convenience
        kwargs['current_user'] = user
        return fn(*args, **kwargs)
    return wrapper