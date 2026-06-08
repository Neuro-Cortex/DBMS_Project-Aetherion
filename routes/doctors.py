# app2/routes/doctors.py - Doctor Module Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required, role_required

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('', methods=['GET'])
def list_doctors():
    spec = request.args.get('specialization')
    search = request.args.get('q')
    sql = """SELECT u.id, u.full_name, u.profile_image, dp.specialization,
             dp.experience_years, dp.consultation_fee, dp.rating, dp.review_count,
             dp.total_patients, dp.is_verified, dp.hospital_affiliation, dp.about
             FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id WHERE dp.is_active = TRUE"""
    params = []
    if spec and spec != 'all':
        sql += " AND dp.specialization = %s"
        params.append(spec)
    if search:
        sql += " AND (u.full_name LIKE %s OR dp.specialization LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s])
    sql += " ORDER BY dp.rating DESC"
    return jsonify(DB.fetch_all(sql, params))

@doctors_bp.route('/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    doc = DB.fetch_one("""SELECT u.id, u.full_name, u.email, u.phone, u.profile_image, u.gender, u.date_of_birth,
        dp.* FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id WHERE u.id = %s""", (doctor_id,))
    if not doc:
        return jsonify({'error': 'Doctor not found'}), 404
    avail = DB.fetch_all("SELECT * FROM doctor_availability WHERE doctor_id = %s", (doc['id'],))
    return jsonify({'doctor': doc, 'availability': avail})

@doctors_bp.route('/me', methods=['GET', 'PUT'])
@jwt_token_required
@role_required('doctor')
def doctor_profile():
    user = request.user
    if request.method == 'GET':
        profile = DB.fetch_one("SELECT dp.*, u.full_name, u.email FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id WHERE dp.user_id = %s", (user['id'],))
        return jsonify(profile or {})
    else:
        data = request.get_json()
        exists = DB.fetch_one("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
        if exists:
            sets = ', '.join([f"`{k}` = %s" for k in data.keys()])
            DB.execute(f"UPDATE doctor_profiles SET {sets} WHERE user_id = %s", list(data.values()) + [user['id']])
        else:
            data['user_id'] = user['id']
            data['specialization'] = data.get('specialization', 'General')
            data['license_number'] = data.get('license_number', 'MED-' + user['id'][:8])
            data['qualifications'] = data.get('qualifications', '[]')
            cols = ', '.join([f"`{k}`" for k in data.keys()])
            vals = ', '.join(['%s'] * len(data))
            DB.execute(f"INSERT INTO doctor_profiles ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Doctor profile updated'})

@doctors_bp.route('/me/appointments', methods=['GET'])
@jwt_token_required
@role_required('doctor')
def doctor_appointments():
    user = request.user
    doc = DB.fetch_one("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
    if not doc:
        return jsonify([])
    apts = DB.fetch_all("""SELECT a.*, u.full_name as patient_name, u.phone as patient_phone
        FROM appointments a JOIN users u ON u.id = a.patient_id WHERE a.doctor_id = %s
        ORDER BY a.appointment_date DESC""", (doc['id'],))
    return jsonify(apts)

@doctors_bp.route('/me/patients', methods=['GET'])
@jwt_token_required
@role_required('doctor')
def doctor_patients():
    user = request.user
    doc = DB.fetch_one("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
    if not doc:
        return jsonify([])
    patients = DB.fetch_all("""SELECT DISTINCT u.id, u.full_name, u.gender, u.date_of_birth, u.blood_group, u.profile_image
        FROM appointments a JOIN users u ON u.id = a.patient_id WHERE a.doctor_id = %s
        ORDER BY a.appointment_date DESC""", (doc['id'],))
    return jsonify(patients)

@doctors_bp.route('/me/availability', methods=['GET', 'POST'])
@jwt_token_required
@role_required('doctor')
def manage_availability():
    user = request.user
    doc = DB.fetch_one("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
    if not doc:
        return jsonify({'error': 'Doctor profile not found'}), 404
    if request.method == 'GET':
        avail = DB.fetch_all("SELECT * FROM doctor_availability WHERE doctor_id = %s", (doc['id'],))
        return jsonify(avail)
    else:
        data = request.get_json()
        DB.execute("DELETE FROM doctor_availability WHERE doctor_id = %s", (doc['id'],))
        for item in (data if isinstance(data, list) else [data]):
            DB.execute("""INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, max_patients, is_available)
                VALUES (%s,%s,%s,%s,%s,%s)""",
                (doc['id'], item['day_of_week'], item['start_time'], item['end_time'],
                 item.get('max_patients', 10), item.get('is_available', True)))
        return jsonify({'message': 'Availability updated'})