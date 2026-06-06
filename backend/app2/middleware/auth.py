# app2/middleware/auth.py - JWT Authentication & Role-Based Access
import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from ..config import Config
from ..database import DB

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_uuid():
    return str(uuid.uuid4())

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_ACCESS_EXPIRY_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)

def decode_token(token):
    return jwt.decode(token, Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM])

def jwt_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token required'}), 401
        try:
            data = decode_token(token)
            user = DB.fetch_one("SELECT * FROM users WHERE id = %s", (data['user_id'],))
            if not user:
                return jsonify({'error': 'User not found'}), 401
            request.user = user
            request.user_role = data.get('role', 'patient')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, 'user_role'):
                return jsonify({'error': 'Not authenticated'}), 401
            if request.user_role not in roles and request.user_role != 'admin':
                return jsonify({'error': 'Access denied'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator