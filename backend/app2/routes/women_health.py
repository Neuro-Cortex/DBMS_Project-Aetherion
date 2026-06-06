# app2/routes/women_health.py - Women's Health Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required

women_bp = Blueprint('women', __name__)

@women_bp.route('/menstrual-cycle', methods=['GET', 'POST'])
@jwt_token_required
def menstrual_cycle():
    user = request.user
    if request.method == 'GET':
        return jsonify(DB.fetch_all("SELECT * FROM women_menstrual_cycles WHERE user_id = %s ORDER BY start_date DESC", (user['id'],)))
    else:
        data = request.get_json()
        data['user_id'] = user['id']
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO women_menstrual_cycles ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Cycle recorded'}), 201

@women_bp.route('/pregnancies', methods=['GET', 'POST'])
@jwt_token_required
def pregnancies():
    user = request.user
    if request.method == 'GET':
        return jsonify(DB.fetch_all("SELECT * FROM women_pregnancies WHERE user_id = %s ORDER BY created_at DESC", (user['id'],)))
    else:
        data = request.get_json()
        data['user_id'] = user['id']
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO women_pregnancies ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Pregnancy recorded'}), 201

@women_bp.route('/pregnancies/<int:preg_id>/tracking', methods=['GET', 'POST'])
@jwt_token_required
def pregnancy_tracking(preg_id):
    if request.method == 'GET':
        return jsonify(DB.fetch_all("SELECT * FROM women_pregnancy_tracking WHERE pregnancy_id = %s ORDER BY week_number", (preg_id,)))
    else:
        data = request.get_json()
        data['pregnancy_id'] = preg_id
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO women_pregnancy_tracking ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Tracking recorded'}), 201