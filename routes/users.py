# app2/routes/users.py - User Management Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_token_required
def get_me():
    user = request.user
    profile = DB.fetch_one("SELECT * FROM user_profiles WHERE user_id = %s", (user['id'],))
    addresses = DB.fetch_all("SELECT * FROM user_addresses WHERE user_id = %s", (user['id'],))
    return jsonify({'user': {k: v for k, v in user.items() if k != 'password_hash'}, 'profile': profile, 'addresses': addresses})

@users_bp.route('/me', methods=['PUT'])
@jwt_token_required
def update_me():
    user = request.user
    data = request.get_json()
    allowed = ['full_name', 'phone', 'gender', 'date_of_birth', 'profile_image', 'blood_group']
    updates = {k: v for k, v in data.items() if k in allowed and v is not None}
    if updates:
        sets = ', '.join([f"{k} = %s" for k in updates.keys()])
        DB.execute(f"UPDATE users SET {sets} WHERE id = %s", list(updates.values()) + [user['id']])
    return jsonify({'message': 'Profile updated'})

@users_bp.route('/me/profile', methods=['GET', 'PUT'])
@jwt_token_required
def user_profile():
    user = request.user
    if request.method == 'GET':
        profile = DB.fetch_one("SELECT * FROM user_profiles WHERE user_id = %s", (user['id'],))
        return jsonify(profile or {})
    else:
        data = request.get_json()
        profile = DB.fetch_one("SELECT id FROM user_profiles WHERE user_id = %s", (user['id'],))
        if profile:
            sets = ', '.join([f"{k} = %s" for k in data.keys()])
            DB.execute(f"UPDATE user_profiles SET {sets} WHERE user_id = %s", list(data.values()) + [user['id']])
        else:
            data['user_id'] = user['id']
            cols = ', '.join(data.keys())
            vals = ', '.join(['%s'] * len(data))
            DB.execute(f"INSERT INTO user_profiles ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Profile updated'})