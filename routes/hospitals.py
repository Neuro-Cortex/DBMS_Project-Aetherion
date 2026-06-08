# app2/routes/hospitals.py - Hospital Module Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required, role_required

hospitals_bp = Blueprint('hospitals', __name__)

@hospitals_bp.route('', methods=['GET'])
def list_hospitals():
    search = request.args.get('q')
    city = request.args.get('city')
    sql = "SELECT * FROM hospitals WHERE is_active = TRUE"
    params = []
    if city:
        sql += " AND city = %s"
        params.append(city)
    if search:
        sql += " AND (name LIKE %s OR city LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s])
    sql += " ORDER BY rating DESC"
    return jsonify(DB.fetch_all(sql, params))

@hospitals_bp.route('/<hospital_id>', methods=['GET'])
def get_hospital(hospital_id):
    hosp = DB.fetch_one("SELECT * FROM hospitals WHERE id = %s", (hospital_id,))
    if not hosp:
        return jsonify({'error': 'Hospital not found'}), 404
    depts = DB.fetch_all("SELECT * FROM hospital_departments WHERE hospital_id = %s", (hospital_id,))
    beds = DB.fetch_all("SELECT * FROM hospital_beds WHERE hospital_id = %s", (hospital_id,))
    return jsonify({'hospital': hosp, 'departments': depts, 'beds': beds})

@hospitals_bp.route('/me', methods=['GET', 'PUT'])
@jwt_token_required
@role_required('hospital')
def manage_hospital():
    user = request.user
    if request.method == 'GET':
        hosp = DB.fetch_one("SELECT * FROM hospitals WHERE admin_user_id = %s", (user['id'],))
        if not hosp:
            DB.execute("""INSERT INTO hospitals (id, admin_user_id, name, city, state, phone, type, registration_number)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                (__import__('uuid').uuid4().__str__(), user['id'], user['full_name'] + "'s Hospital",
                 'Unknown', 'Unknown', '000-000-0000', 'general', 'HOSP-' + user['id'][:8]))
            hosp = DB.fetch_one("SELECT * FROM hospitals WHERE admin_user_id = %s", (user['id'],))
        return jsonify(hosp)
    else:
        data = request.get_json()
        hosp = DB.fetch_one("SELECT id FROM hospitals WHERE admin_user_id = %s", (user['id'],))
        if hosp:
            sets = ', '.join([f"`{k}` = %s" for k in data.keys()])
            DB.execute(f"UPDATE hospitals SET {sets} WHERE admin_user_id = %s", list(data.values()) + [user['id']])
        else:
            data['id'] = __import__('uuid').uuid4().__str__()
            data['admin_user_id'] = user['id']
            cols = ', '.join([f"`{k}`" for k in data.keys()])
            vals = ', '.join(['%s'] * len(data))
            DB.execute(f"INSERT INTO hospitals ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Hospital updated'})

@hospitals_bp.route('/me/departments', methods=['GET', 'POST'])
@jwt_token_required
@role_required('hospital')
def manage_departments():
    user = request.user
    hosp = DB.fetch_one("SELECT id FROM hospitals WHERE admin_user_id = %s", (user['id'],))
    if not hosp:
        return jsonify({'error': 'No hospital found'}), 404
    if request.method == 'GET':
        return jsonify(DB.fetch_all("SELECT * FROM hospital_departments WHERE hospital_id = %s", (hosp['id'],)))
    else:
        data = request.get_json()
        data['hospital_id'] = hosp['id']
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO hospital_departments ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Department added'}), 201

@hospitals_bp.route('/me/beds', methods=['GET', 'POST'])
@jwt_token_required
@role_required('hospital')
def manage_beds():
    user = request.user
    hosp = DB.fetch_one("SELECT id FROM hospitals WHERE admin_user_id = %s", (user['id'],))
    if not hosp:
        return jsonify({'error': 'No hospital found'}), 404
    if request.method == 'GET':
        return jsonify(DB.fetch_all("SELECT * FROM hospital_beds WHERE hospital_id = %s", (hosp['id'],)))
    else:
        data = request.get_json()
        data['hospital_id'] = hosp['id']
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO hospital_beds ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Bed added'}), 201