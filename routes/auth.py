# app2/routes/auth.py - Authentication Routes (Register/Login/Password)
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import hash_password, check_password, generate_uuid, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['email', 'password', 'full_name', 'role']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    if DB.fetch_one("SELECT id FROM users WHERE email = %s", (data['email'],)):
        return jsonify({'error': 'Email already registered'}), 409

    role = DB.fetch_one("SELECT id FROM roles WHERE name = %s", (data['role'],))
    if not role:
        return jsonify({'error': 'Invalid role'}), 400

    user_id = generate_uuid()
    pw_hash = hash_password(data['password'])

    DB.execute(
        """INSERT INTO users (id, email, phone, password_hash, full_name, gender,
        date_of_birth, primary_role_id, is_verified, is_active) 
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (user_id, data['email'], data.get('phone', ''), pw_hash,
         data['full_name'], data.get('gender'), data.get('date_of_birth'),
         role['id'], True, True))

    DB.execute("INSERT INTO user_roles (user_id, role_id, is_primary) VALUES (%s,%s,%s)",
               (user_id, role['id'], True))

    token = generate_token(user_id, data['role'])
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'user': {
            'id': user_id, 'email': data['email'], 'full_name': data['full_name'],
            'role': data['role'], 'is_authenticated': True,
            'roles': [data['role']], 'primary_role': data['role']
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    user = DB.fetch_one("SELECT * FROM users WHERE email = %s AND is_active = TRUE", (data['email'],))
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    if not check_password(data['password'], user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    if data.get('role'):
        role_name = data['role']
    else:
        role_row = DB.fetch_one(
            "SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = %s AND ur.is_primary = TRUE",
            (user['id'],))
        role_name = role_row['name'] if role_row else 'patient'

    DB.execute("UPDATE users SET last_login_at = NOW() WHERE id = %s", (user['id'],))

    token = generate_token(user['id'], role_name)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['id'], 'email': user['email'], 'full_name': user['full_name'],
            'role': role_name, 'is_authenticated': True,
            'roles': [role_name], 'primary_role': role_name
        }
    })

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    return jsonify({'message': 'Use login to refresh token'})

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    user = DB.fetch_one("SELECT id FROM users WHERE email = %s", (data.get('email', ''),))
    if user:
        token = generate_uuid()
        DB.execute("INSERT INTO password_resets (email, token, expires_at) VALUES (%s, %s, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
                   (data['email'], token))
        return jsonify({'message': 'Reset link sent', 'reset_token': token})
    return jsonify({'error': 'Email not found'}), 404

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    reset = DB.fetch_one("SELECT * FROM password_resets WHERE token = %s AND is_used = FALSE AND expires_at > NOW()",
                         (data.get('token', ''),))
    if reset:
        pw_hash = hash_password(data['password'])
        DB.execute("UPDATE users SET password_hash = %s WHERE email = %s", (pw_hash, reset['email']))
        DB.execute("UPDATE password_resets SET is_used = TRUE WHERE token = %s", (data['token'],))
        return jsonify({'message': 'Password reset successful'})
    return jsonify({'error': 'Invalid or expired token'}), 400