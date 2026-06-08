# app2/routes/blood_donors.py - Blood Donation Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required

blood_bp = Blueprint('blood', __name__)

@blood_bp.route('/donors', methods=['GET'])
def list_donors():
    bg = request.args.get('blood_group')
    sql = """SELECT bd.*, u.full_name, u.phone, u.profile_image
             FROM blood_donors bd JOIN users u ON u.id = bd.user_id
             WHERE bd.status = 'approved' AND bd.is_available = TRUE"""
    params = []
    if bg:
        sql += " AND bd.blood_group = %s"
        params.append(bg)
    sql += " ORDER BY bd.last_donation_date ASC NULLS FIRST"
    return jsonify(DB.fetch_all(sql, params))

@blood_bp.route('/donors', methods=['POST'])
@jwt_token_required
def register_donor():
    user = request.user
    data = request.get_json()
    existing = DB.fetch_one("SELECT id FROM blood_donors WHERE user_id = %s", (user['id'],))
    if existing:
        return jsonify({'error': 'Already registered as donor'}), 409
    data['user_id'] = user['id']
    data['status'] = 'pending'
    cols = ', '.join([f"`{k}`" for k in data.keys()])
    vals = ', '.join(['%s'] * len(data))
    DB.execute(f"INSERT INTO blood_donors ({cols}) VALUES ({vals})", list(data.values()))
    return jsonify({'message': 'Blood donor registration submitted'}), 201

@blood_bp.route('/donors/me', methods=['GET', 'PUT'])
@jwt_token_required
def donor_profile():
    user = request.user
    if request.method == 'GET':
        donor = DB.fetch_one("SELECT bd.*, u.full_name FROM blood_donors bd JOIN users u ON u.id = bd.user_id WHERE bd.user_id = %s", (user['id'],))
        return jsonify(donor or {})
    else:
        data = request.get_json()
        DB.execute("UPDATE blood_donors SET " + ', '.join([f"`{k}` = %s" for k in data.keys()]) +
                   " WHERE user_id = %s", list(data.values()) + [user['id']])
        return jsonify({'message': 'Donor profile updated'})

@blood_bp.route('/requests', methods=['GET', 'POST'])
@jwt_token_required
def blood_requests():
    if request.method == 'GET':
        return jsonify(DB.fetch_all("""SELECT br.*, h.name as hospital_name
            FROM blood_requests br LEFT JOIN hospitals h ON h.id = br.hospital_id
            ORDER BY br.created_at DESC"""))
    else:
        data = request.get_json()
        data['requested_by'] = request.user['id']
        if 'request_number' not in data:
            import time
            data['request_number'] = f"BR-{int(time.time())}"
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO blood_requests ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Blood request created'}), 201