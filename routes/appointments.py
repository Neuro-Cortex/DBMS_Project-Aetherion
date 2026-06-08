# app2/routes/appointments.py - Appointment Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('', methods=['GET', 'POST'])
@jwt_token_required
def appointments():
    user = request.user
    if request.method == 'GET':
        apts = DB.fetch_all("""SELECT a.*, dp.specialization, u.full_name as doctor_name
            FROM appointments a
            JOIN doctor_profiles dp ON dp.id = a.doctor_id
            JOIN users u ON u.id = dp.user_id
            WHERE a.patient_id = %s ORDER BY a.appointment_date DESC""", (user['id'],))
        return jsonify(apts)
    else:
        data = request.get_json()
        data['id'] = __import__('uuid').uuid4().__str__()
        data['patient_id'] = user['id']
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO appointments ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Appointment created', 'id': data['id']}), 201

@appointments_bp.route('/<apt_id>', methods=['GET', 'PUT'])
@jwt_token_required
def appointment_detail(apt_id):
    if request.method == 'GET':
        apt = DB.fetch_one("""SELECT a.*, dp.specialization, u.full_name as doctor_name
            FROM appointments a JOIN doctor_profiles dp ON dp.id = a.doctor_id
            JOIN users u ON u.id = dp.user_id WHERE a.id = %s""", (apt_id,))
        if not apt:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(apt)
    else:
        data = request.get_json()
        sets = ', '.join([f"`{k}` = %s" for k in data.keys()])
        DB.execute(f"UPDATE appointments SET {sets} WHERE id = %s", list(data.values()) + [apt_id])
        return jsonify({'message': 'Appointment updated'})

@appointments_bp.route('/<apt_id>/cancel', methods=['POST'])
@jwt_token_required
def cancel_appointment(apt_id):
    data = request.get_json()
    DB.execute("UPDATE appointments SET status = 'cancelled', cancellation_reason = %s WHERE id = %s",
               (data.get('reason', ''), apt_id))
    return jsonify({'message': 'Appointment cancelled'})