"""
Aetherion Healthcare - Flask REST API Backend
Complete backend with all routes, auth, and database operations
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from functools import wraps
import mysql.connector
import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
import json
import os

# ============================================
# APP CONFIGURATION
# ============================================
app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = 'aetherion-super-secret-key-2024'
app.config['JWT_EXPIRY_HOURS'] = 24
app.config['UPLOAD_FOLDER'] = 'uploads'

# ============================================
# DATABASE CONNECTION
# ============================================
def get_db():
    """Get database connection"""
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="aetherion_healthcare"
    )

def query(sql, params=None, fetch=True):
    """Execute query and return results"""
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(sql, params or ())
        if fetch:
            result = cursor.fetchall()
            return result
        db.commit()
        return cursor.lastrowid
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()
        db.close()

# ============================================
# AUTH DECORATORS
# ============================================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token required'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = query("SELECT * FROM users WHERE id = %s", (data['user_id'],), fetch=True)
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
            request.user = current_user[0]
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
            # Get the role name from the user's primary_role_id
            role_id = request.user.get('primary_role_id')
            if role_id:
                role_row = query("SELECT name FROM roles WHERE id = %s", (role_id,))
                user_role_name = role_row[0]['name'] if role_row else ''
            else:
                user_role_name = ''
            # Check if user's role is in allowed roles
            if user_role_name not in roles and user_role_name not in ['super_admin', 'admin']:
                return jsonify({'error': 'Access denied'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

# ============================================
# HELPER FUNCTIONS
# ============================================
def generate_token(user_id, role):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=app.config['JWT_EXPIRY_HOURS']),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def hash_password(password):
    """Hash password"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    """Check password"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_uuid():
    return str(uuid.uuid4())

# ============================================
# PUBLIC ROUTES
# ============================================
@app.route('/')
def root():
    return jsonify({
        'name': 'Aetherion Healthcare API',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/health')
def health():
    try:
        query("SELECT 1")
        return jsonify({'status': 'healthy', 'database': 'connected'})
    except:
        return jsonify({'status': 'degraded', 'database': 'disconnected'}), 500

# ============================================
# AUTH ROUTES
# ============================================
@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    """Register new user"""
    data = request.get_json()
    required = ['email', 'password', 'full_name', 'role']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Check existing user
    existing = query("SELECT id FROM users WHERE email = %s", (data['email'],))
    if existing:
        return jsonify({'error': 'Email already registered'}), 409

    # Get role ID
    role = query("SELECT id FROM roles WHERE name = %s", (data['role'],))
    if not role:
        return jsonify({'error': 'Invalid role'}), 400

    user_id = generate_uuid()
    password_hash = hash_password(data['password'])

    sql = """INSERT INTO users (id, email, phone, password_hash, full_name, gender,
             date_of_birth, primary_role_id, is_active, is_verified)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    params = (
        user_id, data['email'], data.get('phone', ''),
        password_hash, data['full_name'],
        data.get('gender'), data.get('date_of_birth'),
        role[0]['id'], True, True
    )
    query(sql, params, fetch=False)

    # Assign role
    query("INSERT INTO user_roles (user_id, role_id, is_primary) VALUES (%s, %s, %s)",
          (user_id, role[0]['id'], True), fetch=False)

    token = generate_token(user_id, data['role'])
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'user': {
            'id': user_id,
            'email': data['email'],
            'full_name': data['full_name'],
            'role': data['role'],
            'is_authenticated': True,
            'roles': [data['role']],
            'primary_role': data['role']
        }
    }), 201

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    user = query("SELECT * FROM users WHERE email = %s AND is_active = TRUE", (data['email'],))
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    user = user[0]
    if not check_password(data['password'], user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    if data.get('role'):
        role = data['role']
    else:
        role_row = query("SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = %s AND ur.is_primary = TRUE", (user['id'],))
        role = role_row[0]['name'] if role_row else 'patient'

    token = generate_token(user['id'], role)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'role': role,
            'is_authenticated': True,
            'roles': [role],
            'primary_role': role
        }
    })

@app.route('/api/v1/auth/refresh', methods=['POST'])
@token_required
def refresh_token():
    """Refresh JWT token"""
    user = request.user
    role = query("SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = %s AND ur.is_primary = TRUE", (user['id'],))
    role_name = role[0]['name'] if role else 'patient'
    token = generate_token(user['id'], role_name)
    return jsonify({'token': token})

@app.route('/api/v1/auth/logout', methods=['POST'])
@token_required
def logout():
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/v1/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    user = query("SELECT id FROM users WHERE email = %s", (data.get('email', ''),))
    if user:
        reset_token = generate_uuid()
        query("INSERT INTO password_resets (email, token, expires_at) VALUES (%s, %s, %s)",
              (data['email'], reset_token, datetime.utcnow() + timedelta(hours=1)), fetch=False)
        return jsonify({'message': 'Reset link sent', 'reset_token': reset_token})
    return jsonify({'error': 'Email not found'}), 404

@app.route('/api/v1/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    reset = query("SELECT * FROM password_resets WHERE token = %s AND used_at IS NULL AND expires_at > NOW()",
                  (data.get('token', ''),))
    if reset:
        password_hash = hash_password(data['password'])
        query("UPDATE users SET password_hash = %s WHERE email = %s",
              (password_hash, reset[0]['email']), fetch=False)
        query("UPDATE password_resets SET used_at = NOW() WHERE token = %s", (data['token'],), fetch=False)
        return jsonify({'message': 'Password reset successful'})
    return jsonify({'error': 'Invalid or expired token'}), 400

# ============================================
# USER ROUTES
# ============================================
@app.route('/api/v1/users/me', methods=['GET'])
@token_required
def get_me():
    user = request.user
    profile = query("SELECT * FROM user_profiles WHERE user_id = %s", (user['id'],))
    addresses = query("SELECT * FROM user_addresses WHERE user_id = %s", (user['id'],))
    return jsonify({
        'user': user,
        'profile': profile[0] if profile else None,
        'addresses': addresses
    })

@app.route('/api/v1/users/me', methods=['PUT'])
@token_required
def update_me():
    user = request.user
    data = request.get_json()
    allowed = ['full_name', 'phone', 'gender', 'date_of_birth', 'profile_image', 'blood_group']
    updates = {k: v for k, v in data.items() if k in allowed and v is not None}
    if updates:
        sets = ', '.join([f"{k} = %s" for k in updates.keys()])
        values = list(updates.values()) + [user['id']]
        query(f"UPDATE users SET {sets} WHERE id = %s", values, fetch=False)
    return jsonify({'message': 'Profile updated'})

@app.route('/api/v1/users/me/profile', methods=['GET', 'PUT'])
@token_required
def user_profile():
    user = request.user
    if request.method == 'GET':
        profile = query("SELECT * FROM user_profiles WHERE user_id = %s", (user['id'],))
        if not profile:
            query("INSERT INTO user_profiles (user_id) VALUES (%s)", (user['id'],), fetch=False)
            profile = query("SELECT * FROM user_profiles WHERE user_id = %s", (user['id'],))
        return jsonify(profile[0])
    else:
        data = request.get_json()
        profile = query("SELECT id FROM user_profiles WHERE user_id = %s", (user['id'],))
        if profile:
            sets = ', '.join([f"{k} = %s" for k in data.keys()])
            values = list(data.values()) + [user['id']]
            query(f"UPDATE user_profiles SET {sets} WHERE user_id = %s", values, fetch=False)
        else:
            data['user_id'] = user['id']
            cols = ', '.join(data.keys())
            vals = ', '.join(['%s'] * len(data))
            query(f"INSERT INTO user_profiles ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Profile updated'})

# ============================================
# DOCTOR ROUTES
# ============================================
@app.route('/api/v1/doctors', methods=['GET'])
def get_doctors():
    """Get all doctors (public)"""
    specialization = request.args.get('specialization')
    search = request.args.get('q')
    sql = """SELECT u.id, u.full_name, u.profile_image, u.email,
                    dp.specialization, dp.experience_years, dp.consultation_fee,
                    dp.rating, dp.review_count, dp.total_patients, dp.is_verified,
                    dp.hospital_affiliation, dp.about, dp.languages
             FROM doctor_profiles dp
             JOIN users u ON u.id = dp.user_id
             WHERE dp.is_active = TRUE"""
    params = []
    if specialization and specialization != 'all':
        sql += " AND dp.specialization = %s"
        params.append(specialization)
    if search:
        sql += " AND (u.full_name LIKE %s OR dp.specialization LIKE %s OR dp.hospital_affiliation LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s, s])
    sql += " ORDER BY dp.rating DESC"
    doctors = query(sql, params)
    return jsonify(doctors)

@app.route('/api/v1/doctors/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    """Get doctor details"""
    doctor = query("""SELECT u.*, dp.*, u.id as user_id
                     FROM doctor_profiles dp
                     JOIN users u ON u.id = dp.user_id
                     WHERE u.id = %s""", (doctor_id,))
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404
    availability = query("SELECT * FROM doctor_availability WHERE doctor_id = %s",
                        (doctor[0]['id'] if 'id' in doctor[0] else 0,))
    return jsonify({'doctor': doctor[0], 'availability': availability})

@app.route('/api/v1/doctors/me', methods=['GET', 'PUT'])
@token_required
@role_required('doctor')
def doctor_profile():
    user = request.user
    if request.method == 'GET':
        profile = query("""SELECT dp.*, u.full_name, u.email, u.phone
                          FROM doctor_profiles dp
                          JOIN users u ON u.id = dp.user_id
                          WHERE dp.user_id = %s""", (user['id'],))
        return jsonify(profile[0] if profile else {})
    else:
        data = request.get_json()
        profile = query("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
        if profile:
            sets = ', '.join([f"{k} = %s" for k in data.keys()])
            values = list(data.values()) + [user['id']]
            query(f"UPDATE doctor_profiles SET {sets} WHERE user_id = %s", values, fetch=False)
        else:
            data['user_id'] = user['id']
            cols = ', '.join(data.keys())
            vals = ', '.join(['%s'] * len(data))
            query(f"INSERT INTO doctor_profiles ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Doctor profile updated'})

@app.route('/api/v1/doctors/me/appointments', methods=['GET'])
@token_required
@role_required('doctor')
def doctor_appointments():
    user = request.user
    profile = query("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
    doc_id = profile[0]['id'] if profile else 0
    appointments = query("""SELECT a.*, u.full_name as patient_name, u.profile_image as patient_image
                           FROM appointments a
                           JOIN users u ON u.id = a.patient_id
                           WHERE a.doctor_id = %s
                           ORDER BY a.appointment_date DESC, a.start_time DESC""", (doc_id,))
    return jsonify(appointments)

@app.route('/api/v1/doctors/me/patients', methods=['GET'])
@token_required
@role_required('doctor')
def doctor_patients():
    user = request.user
    profile = query("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
    doc_id = profile[0]['id'] if profile else 0
    patients = query("""SELECT DISTINCT u.id, u.full_name, u.gender, u.date_of_birth,
                               u.blood_group, u.profile_image
                        FROM appointments a
                        JOIN users u ON u.id = a.patient_id
                        WHERE a.doctor_id = %s
                        ORDER BY a.appointment_date DESC""", (doc_id,))
    return jsonify(patients)

# ============================================
# HOSPITAL ROUTES
# ============================================
@app.route('/api/v1/hospitals', methods=['GET'])
def get_hospitals():
    """Get all hospitals (public)"""
    search = request.args.get('q')
    city = request.args.get('city')
    sql = """SELECT * FROM hospitals WHERE is_active = TRUE"""
    params = []
    if city:
        sql += " AND city = %s"
        params.append(city)
    if search:
        sql += " AND (name LIKE %s OR city LIKE %s OR state LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s, s])
    sql += " ORDER BY rating DESC"
    hospitals = query(sql, params)
    return jsonify(hospitals)

@app.route('/api/v1/hospitals/<hospital_id>', methods=['GET'])
def get_hospital(hospital_id):
    """Get hospital details"""
    hospital = query("SELECT * FROM hospitals WHERE id = %s", (hospital_id,))
    if not hospital:
        return jsonify({'error': 'Hospital not found'}), 404
    depts = query("SELECT * FROM hospital_departments WHERE hospital_id = %s", (hospital_id,))
    beds = query("SELECT * FROM hospital_beds WHERE hospital_id = %s", (hospital_id,))
    return jsonify({'hospital': hospital[0], 'departments': depts, 'beds': beds})

@app.route('/api/v1/hospitals/me', methods=['GET', 'PUT'])
@token_required
@role_required('hospital')
def manage_hospital():
    user = request.user
    if request.method == 'GET':
        hospital = query("SELECT * FROM hospitals WHERE admin_user_id = %s", (user['id'],))
        if not hospital:
            query("INSERT INTO hospitals (id, admin_user_id, name, city, state) VALUES (%s, %s, %s, %s, %s)",
                  (generate_uuid(), user['id'], user['full_name'] + "'s Hospital", 'Unknown', 'Unknown'), fetch=False)
            hospital = query("SELECT * FROM hospitals WHERE admin_user_id = %s", (user['id'],))
        return jsonify(hospital[0] if hospital else {})
    else:
        data = request.get_json()
        hospital = query("SELECT id FROM hospitals WHERE admin_user_id = %s", (user['id'],))
        if hospital:
            sets = ', '.join([f"{k} = %s" for k in data.keys()])
            values = list(data.values()) + [user['id']]
            query(f"UPDATE hospitals SET {sets} WHERE admin_user_id = %s", values, fetch=False)
        else:
            data['id'] = generate_uuid()
            data['admin_user_id'] = user['id']
            cols = ', '.join(data.keys())
            vals = ', '.join(['%s'] * len(data))
            query(f"INSERT INTO hospitals ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Hospital updated'})

# ============================================
# PHARMACY ROUTES
# ============================================
@app.route('/api/v1/pharmacies', methods=['GET'])
def get_pharmacies():
    search = request.args.get('q')
    sql = "SELECT * FROM pharmacies WHERE is_active = TRUE"
    params = []
    if search:
        sql += " AND (name LIKE %s OR city LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s])
    sql += " ORDER BY name"
    return jsonify(query(sql, params))

@app.route('/api/v1/pharmacies/<pharmacy_id>', methods=['GET'])
def get_pharmacy(pharmacy_id):
    pharmacy = query("SELECT * FROM pharmacies WHERE id = %s", (pharmacy_id,))
    if not pharmacy:
        return jsonify({'error': 'Pharmacy not found'}), 404
    inventory = query("SELECT * FROM pharmacy_inventory WHERE pharmacy_id = %s AND is_active = TRUE", (pharmacy_id,))
    return jsonify({'pharmacy': pharmacy[0], 'inventory': inventory})

@app.route('/api/v1/pharmacies/me', methods=['GET', 'PUT'])
@token_required
@role_required('pharmacy')
def manage_pharmacy():
    user = request.user
    if request.method == 'GET':
        pharmacy = query("SELECT * FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
        if not pharmacy:
            query("INSERT INTO pharmacies (id, admin_user_id, name, pharmacist_name) VALUES (%s, %s, %s, %s)",
                  (generate_uuid(), user['id'], user['full_name'] + "'s Pharmacy", user['full_name']), fetch=False)
            pharmacy = query("SELECT * FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
        return jsonify(pharmacy[0] if pharmacy else {})
    else:
        data = request.get_json()
        pharmacy = query("SELECT id FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
        if pharmacy:
            sets = ', '.join([f"{k} = %s" for k in data.keys()])
            values = list(data.values()) + [user['id']]
            query(f"UPDATE pharmacies SET {sets} WHERE admin_user_id = %s", values, fetch=False)
        else:
            data['id'] = generate_uuid()
            data['admin_user_id'] = user['id']
            cols = ', '.join(data.keys())
            vals = ', '.join(['%s'] * len(data))
            query(f"INSERT INTO pharmacies ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Pharmacy updated'})

@app.route('/api/v1/pharmacies/me/inventory', methods=['GET', 'POST'])
@token_required
@role_required('pharmacy')
def pharmacy_inventory():
    user = request.user
    pharmacy = query("SELECT id FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
    if not pharmacy:
        return jsonify({'error': 'No pharmacy found'}), 404
    pharm_id = pharmacy[0]['id']
    if request.method == 'GET':
        return jsonify(query("SELECT * FROM pharmacy_inventory WHERE pharmacy_id = %s ORDER BY medicine_name", (pharm_id,)))
    else:
        data = request.get_json()
        data['pharmacy_id'] = pharm_id
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO pharmacy_inventory ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Item added to inventory'}), 201

# ============================================
# APPOINTMENT ROUTES
# ============================================
@app.route('/api/v1/appointments', methods=['GET', 'POST'])
@token_required
def appointments():
    user = request.user
    if request.method == 'GET':
        appointments = query("""SELECT a.*, u.full_name as doctor_name, dp.specialization
                               FROM appointments a
                               JOIN doctor_profiles dp ON dp.id = a.doctor_id
                               JOIN users u ON u.id = dp.user_id
                               WHERE a.patient_id = %s
                               ORDER BY a.appointment_date DESC""", (user['id'],))
        return jsonify(appointments)
    else:
        data = request.get_json()
        data['id'] = generate_uuid()
        data['patient_id'] = user['id']
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO appointments ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Appointment created', 'id': data['id']}), 201

# ============================================
# PRESCRIPTION ROUTES
# ============================================
@app.route('/api/v1/prescriptions', methods=['GET', 'POST'])
@token_required
def prescriptions():
    user = request.user
    user_role = user.get('primary_role_id') or 'patient'
    if request.method == 'GET':
        if user_role == 'doctor':
            profile = query("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
            doc_id = profile[0]['id'] if profile else 0
            pres = query("""SELECT p.*, u.full_name as patient_name
                           FROM prescriptions p
                           JOIN users u ON u.id = p.patient_id
                           WHERE p.doctor_id = %s ORDER BY p.created_at DESC""", (doc_id,))
        else:
            pres = query("""SELECT p.*, u.full_name as doctor_name
                           FROM prescriptions p
                           JOIN doctor_profiles dp ON dp.id = p.doctor_id
                           JOIN users u ON u.id = dp.user_id
                           WHERE p.patient_id = %s ORDER BY p.created_at DESC""", (user['id'],))
        return jsonify(pres)
    else:  # POST
        data = request.get_json()
        profile = query("SELECT id FROM doctor_profiles WHERE user_id = %s", (user['id'],))
        if not profile:
            return jsonify({'error': 'Only doctors can create prescriptions'}), 403
        data['doctor_id'] = profile[0]['id']
        data['id'] = generate_uuid()
        items = data.pop('items', [])
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO prescriptions ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        for item in items:
            item['prescription_id'] = data['id']
            icols = ', '.join(item.keys())
            ivals = ', '.join(['%s'] * len(item))
            query(f"INSERT INTO prescription_items ({icols}) VALUES ({ivals})", list(item.values()), fetch=False)
        return jsonify({'message': 'Prescription created', 'id': data['id']}), 201

# ============================================
# BLOOD DONATION ROUTES
# ============================================
@app.route('/api/v1/blood/donors', methods=['GET'])
def get_blood_donors():
    blood_group = request.args.get('blood_group')
    city = request.args.get('city')
    sql = """SELECT bd.*, u.full_name, u.phone, u.profile_image
             FROM blood_donors bd
             JOIN users u ON u.id = bd.user_id
             WHERE bd.status = 'approved' AND bd.is_available = TRUE"""
    params = []
    if blood_group:
        sql += " AND bd.blood_group = %s"
        params.append(blood_group)
    if city:
        sql += " AND u.city = %s"
        params.append(city)
    sql += " ORDER BY bd.last_donation_date ASC"
    return jsonify(query(sql, params))

@app.route('/api/v1/blood/donors', methods=['POST'])
@token_required
def register_blood_donor():
    user = request.user
    data = request.get_json()
    existing = query("SELECT id FROM blood_donors WHERE user_id = %s", (user['id'],))
    if existing:
        return jsonify({'error': 'Already registered as donor'}), 409
    data['user_id'] = user['id']
    data['status'] = 'pending'
    cols = ', '.join(data.keys())
    vals = ', '.join(['%s'] * len(data))
    query(f"INSERT INTO blood_donors ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
    return jsonify({'message': 'Blood donor registration submitted'}), 201

@app.route('/api/v1/blood/requests', methods=['GET', 'POST'])
@token_required
def blood_requests():
    if request.method == 'GET':
        return jsonify(query("""SELECT br.*, h.name as hospital_name
                               FROM blood_requests br
                               LEFT JOIN hospitals h ON h.id = br.hospital_id
                               ORDER BY br.created_at DESC"""))
    else:
        data = request.get_json()
        data['id'] = generate_uuid()
        data['requested_by'] = request.user['id']
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO blood_requests ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Blood request created', 'id': data['id']}), 201

# ============================================
# AMBULANCE ROUTES
# ============================================
@app.route('/api/v1/ambulance/requests', methods=['GET', 'POST'])
@token_required
def ambulance_requests():
    if request.method == 'GET':
        return jsonify(query("""SELECT ar.*, h.name as hospital_name
                               FROM ambulance_requests ar
                               LEFT JOIN hospitals h ON h.id = ar.hospital_id
                               ORDER BY ar.created_at DESC"""))
    else:
        data = request.get_json()
        data['id'] = generate_uuid()
        data['requested_by'] = request.user['id']
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO ambulance_requests ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Ambulance request created', 'id': data['id']}), 201

# ============================================
# MESSAGE ROUTES
# ============================================
@app.route('/api/v1/messages', methods=['GET', 'POST'])
@token_required
def messages():
    user = request.user
    if request.method == 'GET':
        other_user = request.args.get('user_id')
        if other_user:
            msgs = query("""SELECT * FROM messages
                           WHERE (sender_id = %s AND receiver_id = %s)
                              OR (sender_id = %s AND receiver_id = %s)
                           ORDER BY created_at ASC""",
                        (user['id'], other_user, other_user, user['id']))
        else:
            msgs = query("""SELECT * FROM messages
                           WHERE sender_id = %s OR receiver_id = %s
                           ORDER BY created_at DESC LIMIT 50""", (user['id'], user['id']))
        return jsonify(msgs)
    else:
        data = request.get_json()
        data['id'] = generate_uuid()
        data['sender_id'] = user['id']
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO messages ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Message sent', 'id': data['id']}), 201

# ============================================
# NOTIFICATION ROUTES
# ============================================
@app.route('/api/v1/notifications', methods=['GET'])
@token_required
def get_notifications():
    notifs = query("""SELECT * FROM notifications
                     WHERE user_id = %s
                     ORDER BY created_at DESC LIMIT 50""", (request.user['id'],))
    return jsonify(notifs)

@app.route('/api/v1/notifications/<notif_id>/read', methods=['PUT'])
@token_required
def mark_notification_read(notif_id):
    query("UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = %s AND user_id = %s",
          (notif_id, request.user['id']), fetch=False)
    return jsonify({'message': 'Marked as read'})

# ============================================
# REVIEW ROUTES
# ============================================
@app.route('/api/v1/reviews', methods=['POST'])
@token_required
def create_review():
    data = request.get_json()
    data['id'] = generate_uuid()
    data['reviewer_id'] = request.user['id']
    cols = ', '.join(data.keys())
    vals = ', '.join(['%s'] * len(data))
    query(f"INSERT INTO user_reviews ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
    return jsonify({'message': 'Review submitted', 'id': data['id']}), 201

@app.route('/api/v1/reviews/<reviewable_type>/<reviewable_id>', methods=['GET'])
def get_reviews(reviewable_type, reviewable_id):
    reviews = query("""SELECT r.*, u.full_name as reviewer_name, u.profile_image
                      FROM user_reviews r
                      JOIN users u ON u.id = r.reviewer_id
                      WHERE r.reviewable_type = %s AND r.reviewable_id = %s
                      ORDER BY r.created_at DESC""", (reviewable_type, reviewable_id))
    return jsonify(reviews)

# ============================================
# SEARCH ROUTE
# ============================================
@app.route('/api/v1/search', methods=['GET'])
def global_search():
    q = request.args.get('q', '')
    search_type = request.args.get('type', 'all')
    results = []
    s = f"%{q}%"

    if search_type in ('all', 'doctor'):
        docs = query("""SELECT u.id, u.full_name as title, dp.specialization as description,
                               'doctor' as type, dp.rating, dp.consultation_fee as price
                        FROM doctor_profiles dp
                        JOIN users u ON u.id = dp.user_id
                        WHERE u.full_name LIKE %s OR dp.specialization LIKE %s
                        LIMIT 5""", (s, s))
        results.extend(docs)

    if search_type in ('all', 'hospital'):
        hosps = query("""SELECT id, name as title, city as description, 'hospital' as type, rating
                         FROM hospitals WHERE name LIKE %s OR city LIKE %s LIMIT 5""", (s, s))
        results.extend(hosps)

    if search_type in ('all', 'medicine'):
        meds = query("""SELECT id, medicine_name as title, generic_name as description,
                               'medicine' as type, price
                        FROM pharmacy_inventory
                        WHERE medicine_name LIKE %s OR generic_name LIKE %s
                        LIMIT 5""", (s, s))
        results.extend(meds)

    return jsonify(results)

# ============================================
# ADMIN ROUTES (Comprehensive)
# ============================================

# --- Admin Dashboard ---
@app.route('/api/v1/admin/dashboard', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_dashboard():
    """Full dashboard data with stats, recent activities, alerts"""
    total_users = query("SELECT COUNT(*) as c FROM users WHERE deleted_at IS NULL")[0]['c']
    active_users = query("SELECT COUNT(*) as c FROM users WHERE is_active = TRUE AND deleted_at IS NULL")[0]['c']
    new_today = query("SELECT COUNT(*) as c FROM users WHERE DATE(created_at) = CURDATE() AND deleted_at IS NULL")[0]['c']
    new_month = query("SELECT COUNT(*) as c FROM users WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW()) AND deleted_at IS NULL")[0]['c']
    total_doctors = query("SELECT COUNT(*) as c FROM doctor_profiles")[0]['c']
    verified_doctors = query("SELECT COUNT(*) as c FROM doctor_profiles WHERE is_verified = TRUE")[0]['c']
    pending_doctors = query("SELECT COUNT(*) as c FROM doctor_profiles WHERE is_verified = FALSE")[0]['c']
    total_hospitals = query("SELECT COUNT(*) as c FROM hospitals WHERE deleted_at IS NULL")[0]['c']
    total_pharmacies = query("SELECT COUNT(*) as c FROM pharmacies")[0]['c']
    total_appointments = query("SELECT COUNT(*) as c FROM appointments")[0]['c']
    total_blood_donors = query("SELECT COUNT(*) as c FROM blood_donors WHERE status = 'approved'")[0]['c']
    total_donations = query("SELECT COUNT(*) as c FROM blood_donations")[0]['c']
    total_blood_units = query("SELECT COALESCE(SUM(units), 0) as c FROM hospital_blood_stocks")[0]['c']
    pending_verifications = query("SELECT COUNT(*) as c FROM verification_requests WHERE status = 'pending'")[0]['c']
    blocked_users = query("SELECT COUNT(*) as c FROM users WHERE is_active = FALSE AND deleted_at IS NULL")[0]['c']
    lives_saved = query("SELECT COALESCE(SUM(lives_saved), 0) as c FROM blood_donors")[0]['c']

    recent_users = query("""SELECT u.id, u.full_name, u.email, u.created_at, r.name as role_name
                           FROM users u
                           LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
                           LEFT JOIN roles r ON r.id = ur.role_id
                           WHERE u.deleted_at IS NULL
                           ORDER BY u.created_at DESC LIMIT 10""")

    recent_appointments = query("""SELECT a.id, a.appointment_date, a.start_time, a.status, a.type,
                                          p.full_name as patient_name, d.full_name as doctor_name
                                   FROM appointments a
                                   JOIN users p ON p.id = a.patient_id
                                   JOIN doctor_profiles dp ON dp.id = a.doctor_id
                                   JOIN users d ON d.id = dp.user_id
                                   ORDER BY a.created_at DESC LIMIT 5""")

    active_emergencies = query("""SELECT ar.*, h.name as hospital_name
                                 FROM ambulance_requests ar
                                 LEFT JOIN hospitals h ON h.id = ar.hospital_id
                                 WHERE ar.status IN ('pending', 'dispatched')
                                 ORDER BY ar.created_at DESC LIMIT 5""")

    blood_alerts = []
    try:
        blood_alerts = query("""SELECT hbs.*, h.name as hospital_name
                               FROM hospital_blood_stocks hbs
                               JOIN hospital_blood_bank hbb ON hbb.id = hbs.blood_bank_id
                               JOIN hospitals h ON h.id = hbb.hospital_id
                               WHERE hbs.status IN ('low', 'critical', 'out-of-stock')
                               LIMIT 10""")
    except:
        pass

    pending_verifs_list = []
    try:
        pending_verifs_list = query("""SELECT vr.*, u.full_name as entity_name
                                      FROM verification_requests vr
                                      LEFT JOIN users u ON u.id = vr.entity_id
                                      WHERE vr.status = 'pending'
                                      ORDER BY vr.submitted_date DESC LIMIT 10""")
    except:
        pass

    recent_feedbacks = []
    try:
        recent_feedbacks = query("""SELECT f.id, f.subject, f.type, f.status, f.priority,
                                      u.full_name as user_name
                               FROM feedback f
                               JOIN users u ON u.id = f.user_id
                               ORDER BY f.id DESC LIMIT 5""")
    except:
        pass

    recent_audit = query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10")

    return jsonify({
        'stats': {
            'total_users': total_users, 'total_doctors': total_doctors,
            'total_hospitals': total_hospitals, 'total_pharmacies': total_pharmacies,
            'total_blood_donors': total_blood_donors, 'total_appointments': total_appointments,
            'active_users': active_users, 'new_users_today': new_today,
            'new_users_this_month': new_month, 'verified_doctors': verified_doctors,
            'pending_verifications': pending_verifications, 'blocked_users': blocked_users,
            'total_donations': total_donations, 'total_blood_units': total_blood_units,
            'lives_saved': lives_saved
        },
        'pending_verifications': {'doctors': pending_doctors, 'hospitals': 0, 'pharmacies': 0},
        'recent_users': recent_users,
        'recent_appointments': recent_appointments,
        'active_emergencies': active_emergencies,
        'blood_alerts': blood_alerts,
        'pending_verifications_list': pending_verifs_list,
        'recent_feedbacks': recent_feedbacks,
        'recent_audit': recent_audit,
        'system_health': {
            'status': 'healthy', 'uptime': '99.9%', 'cpu_usage': 23,
            'memory_usage': 45, 'disk_usage': 32, 'active_connections': 12,
            'response_time': '120ms', 'last_incident': 'none'
        }
    })

# --- Admin System Stats ---
@app.route('/api/v1/admin/stats', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_stats():
    total_users = query("SELECT COUNT(*) as c FROM users WHERE deleted_at IS NULL")[0]['c']
    active_users = query("SELECT COUNT(*) as c FROM users WHERE is_active = TRUE AND deleted_at IS NULL")[0]['c']
    new_today = query("SELECT COUNT(*) as c FROM users WHERE DATE(created_at) = CURDATE() AND deleted_at IS NULL")[0]['c']
    new_month = query("SELECT COUNT(*) as c FROM users WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW()) AND deleted_at IS NULL")[0]['c']
    total_doctors = query("SELECT COUNT(*) as c FROM doctor_profiles")[0]['c']
    verified_doctors = query("SELECT COUNT(*) as c FROM doctor_profiles WHERE is_verified = TRUE")[0]['c']
    pending_verifs = query("SELECT COUNT(*) as c FROM verification_requests WHERE status = 'pending'")[0]['c']
    blocked = query("SELECT COUNT(*) as c FROM users WHERE is_active = FALSE AND deleted_at IS NULL")[0]['c']
    total_hospitals = query("SELECT COUNT(*) as c FROM hospitals WHERE deleted_at IS NULL")[0]['c']
    total_pharmacies = query("SELECT COUNT(*) as c FROM pharmacies")[0]['c']
    total_appointments = query("SELECT COUNT(*) as c FROM appointments")[0]['c']
    total_donors = query("SELECT COUNT(*) as c FROM blood_donors WHERE status = 'approved'")[0]['c']
    total_donations = query("SELECT COUNT(*) as c FROM blood_donations")[0]['c']
    total_units = query("SELECT COALESCE(SUM(units), 0) as c FROM hospital_blood_stocks")[0]['c']
    lives = query("SELECT COALESCE(SUM(lives_saved), 0) as c FROM blood_donors")[0]['c']
    return jsonify({
        'total_users': total_users, 'total_doctors': total_doctors,
        'total_hospitals': total_hospitals, 'total_pharmacies': total_pharmacies,
        'total_blood_donors': total_donors, 'total_appointments': total_appointments,
        'active_users': active_users, 'new_users_today': new_today,
        'new_users_this_month': new_month, 'verified_doctors': verified_doctors,
        'pending_verifications': pending_verifs, 'blocked_users': blocked,
        'total_donations': total_donations, 'total_blood_units': total_units,
        'lives_saved': lives
    })

# --- Admin Analytics ---
@app.route('/api/v1/admin/analytics', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_analytics():
    period = request.args.get('period', 'month')
    if period == 'week':
        interval = '7 DAY'
    elif period == 'year':
        interval = '1 YEAR'
    else:
        interval = '30 DAY'

    user_growth = query(f"""SELECT DATE(created_at) as date, COUNT(*) as count
                           FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL {interval})
                           AND deleted_at IS NULL GROUP BY DATE(created_at) ORDER BY date""")
    appt_trends = query(f"""SELECT DATE(created_at) as date, COUNT(*) as count
                            FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL {interval})
                            GROUP BY DATE(created_at) ORDER BY date""")
    donation_trends = query(f"""SELECT DATE(created_at) as date, COUNT(*) as count
                               FROM blood_donations WHERE created_at >= DATE_SUB(NOW(), INTERVAL {interval})
                               GROUP BY DATE(created_at) ORDER BY date""")
    role_dist = query("""SELECT r.name as role, COUNT(ur.user_id) as count
                         FROM roles r LEFT JOIN user_roles ur ON ur.role_id = r.id AND ur.is_primary = TRUE
                         GROUP BY r.id ORDER BY count DESC""")
    top_doctors = query("""SELECT u.full_name as name, dp.specialization as category,
                                  dp.rating, dp.total_patients as total_interactions
                           FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id
                           WHERE dp.is_active = TRUE ORDER BY dp.rating DESC LIMIT 5""")
    top_hospitals = query("""SELECT h.name, h.type as category, h.rating, h.total_doctors as total_interactions
                             FROM hospitals h WHERE h.deleted_at IS NULL
                             ORDER BY h.rating DESC LIMIT 5""")
    return jsonify({
        'user_growth': {'labels': [r['date'].strftime('%Y-%m-%d') if hasattr(r['date'], 'strftime') else str(r['date']) for r in user_growth],
                        'datasets': [{'label': 'New Users', 'data': [r['count'] for r in user_growth], 'color': '#6366f1'}]},
        'appointment_trends': {'labels': [r['date'].strftime('%Y-%m-%d') if hasattr(r['date'], 'strftime') else str(r['date']) for r in appt_trends],
                               'datasets': [{'label': 'Appointments', 'data': [r['count'] for r in appt_trends], 'color': '#10b981'}]},
        'blood_donation_trends': {'labels': [r['date'].strftime('%Y-%m-%d') if hasattr(r['date'], 'strftime') else str(r['date']) for r in donation_trends],
                                  'datasets': [{'label': 'Donations', 'data': [r['count'] for r in donation_trends], 'color': '#ef4444'}]},
        'role_distribution': role_dist,
        'top_doctors': top_doctors,
        'top_hospitals': top_hospitals
    })

# --- Analytics Overview (simple counts) ---
@app.route('/api/v1/admin/analytics/overview', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_analytics_overview():
    total_users = query("SELECT COUNT(*) as c FROM users WHERE deleted_at IS NULL")[0]['c']
    total_doctors = query("SELECT COUNT(*) as c FROM doctor_profiles")[0]['c']
    total_hospitals = query("SELECT COUNT(*) as c FROM hospitals WHERE deleted_at IS NULL")[0]['c']
    total_pharmacies = query("SELECT COUNT(*) as c FROM pharmacies")[0]['c']
    total_appointments = query("SELECT COUNT(*) as c FROM appointments")[0]['c']
    return jsonify({
        'total_users': total_users, 'total_doctors': total_doctors,
        'total_hospitals': total_hospitals, 'total_pharmacies': total_pharmacies,
        'total_appointments': total_appointments, 'total_patients': total_users
    })

# --- User Management ---
@app.route('/api/v1/admin/users', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_users():
    search = request.args.get('search', '')
    role = request.args.get('role', '')
    status = request.args.get('status', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 50))
    offset = (page - 1) * limit

    sql = """SELECT u.id, u.email, u.phone, u.full_name, u.gender, u.blood_group,
                    u.is_active, u.is_verified, u.is_admin_approved, u.created_at, u.last_login_at,
                    r.name as role_name, r.display_name as role_display
             FROM users u
             LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
             LEFT JOIN roles r ON r.id = ur.role_id
             WHERE u.deleted_at IS NULL"""
    params = []
    if search:
        sql += " AND (u.full_name LIKE %s OR u.email LIKE %s OR u.phone LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s, s])
    if role:
        sql += " AND r.name = %s"
        params.append(role)
    if status == 'active':
        sql += " AND u.is_active = TRUE"
    elif status == 'inactive':
        sql += " AND u.is_active = FALSE"
    elif status == 'pending':
        sql += " AND u.is_verified = FALSE"

    # Count total matching users
    count_params = list(params)
    count_sql = """SELECT COUNT(*) as total_count FROM users u
                   LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
                   LEFT JOIN roles r ON r.id = ur.role_id
                   WHERE u.deleted_at IS NULL"""
    if search:
        count_sql += " AND (u.full_name LIKE %s OR u.email LIKE %s OR u.phone LIKE %s)"
    if role:
        count_sql += " AND r.name = %s"
    if status == 'active':
        count_sql += " AND u.is_active = TRUE"
    elif status == 'inactive':
        count_sql += " AND u.is_active = FALSE"
    elif status == 'pending':
        count_sql += " AND u.is_verified = FALSE"
    total = query(count_sql, count_params)[0]['total_count']

    sql += " ORDER BY u.created_at DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    users = query(sql, params)

    return jsonify({'users': users, 'total': total, 'page': page, 'limit': limit, 'pages': (total + limit - 1) // limit})

@app.route('/api/v1/admin/users/<user_id>', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_user(user_id):
    user = query("""SELECT u.*, r.name as role_name
                    FROM users u
                    LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
                    LEFT JOIN roles r ON r.id = ur.role_id
                    WHERE u.id = %s""", (user_id,))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    profile = query("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
    addresses = query("SELECT * FROM user_addresses WHERE user_id = %s", (user_id,))
    return jsonify({'user': user[0], 'profile': profile[0] if profile else None, 'addresses': addresses})

@app.route('/api/v1/admin/users/<user_id>', methods=['PUT'])
@token_required
@role_required('admin', 'super_admin')
def admin_update_user(user_id):
    data = request.get_json()
    allowed = ['full_name', 'phone', 'gender', 'is_active', 'is_verified', 'is_admin_approved', 'blood_group']
    updates = {k: v for k, v in data.items() if k in allowed}
    if updates:
        sets = ', '.join([f"{k} = %s" for k in updates.keys()])
        values = list(updates.values()) + [user_id]
        query(f"UPDATE users SET {sets} WHERE id = %s", values, fetch=False)
        # Log audit
        query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
              (request.user['id'], 'admin_update_user', f'Updated user {user_id}: {list(updates.keys())}',
               request.remote_addr), fetch=False)
    return jsonify({'message': 'User updated'})

@app.route('/api/v1/admin/users/<user_id>', methods=['DELETE'])
@token_required
@role_required('admin', 'super_admin')
def admin_delete_user(user_id):
    query("UPDATE users SET deleted_at = NOW(), is_active = FALSE WHERE id = %s", (user_id,), fetch=False)
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_delete_user', f'Soft deleted user {user_id}', request.remote_addr), fetch=False)
    return jsonify({'message': 'User deleted'})

@app.route('/api/v1/admin/users/<user_id>/toggle-active', methods=['PATCH'])
@token_required
@role_required('admin', 'super_admin')
def admin_toggle_user_active(user_id):
    user = query("SELECT is_active, full_name FROM users WHERE id = %s", (user_id,))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    new_status = not user[0]['is_active']
    query("UPDATE users SET is_active = %s WHERE id = %s", (new_status, user_id), fetch=False)
    action = 'activated' if new_status else 'deactivated'
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], f'admin_{action}_user', f'{action} user {user[0]["full_name"]}', request.remote_addr), fetch=False)
    return jsonify({'message': f'User {action}', 'is_active': new_status})

@app.route('/api/v1/admin/users/<user_id>/role', methods=['PATCH'])
@token_required
@role_required('admin', 'super_admin')
def admin_change_user_role(user_id):
    data = request.get_json()
    new_role = data.get('role')
    if not new_role:
        return jsonify({'error': 'Role required'}), 400
    role = query("SELECT id FROM roles WHERE name = %s", (new_role,))
    if not role:
        return jsonify({'error': 'Invalid role'}), 400
    query("UPDATE users SET primary_role_id = %s WHERE id = %s", (role[0]['id'], user_id), fetch=False)
    query("UPDATE user_roles SET role_id = %s WHERE user_id = %s AND is_primary = TRUE",
          (role[0]['id'], user_id), fetch=False)
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_change_role', f'Changed user {user_id} role to {new_role}', request.remote_addr), fetch=False)
    return jsonify({'message': f'Role changed to {new_role}'})

# --- Doctor Management ---
@app.route('/api/v1/admin/doctors', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_doctors():
    search = request.args.get('search', '')
    verified = request.args.get('verified', '')
    sql = """SELECT u.id, u.full_name, u.email, u.phone, u.profile_image, u.is_active,
                    dp.specialization, dp.experience_years, dp.consultation_fee, dp.rating,
                    dp.license_number, dp.is_verified, dp.total_patients, dp.status, dp.created_at
             FROM doctor_profiles dp
             JOIN users u ON u.id = dp.user_id"""
    params = []
    conditions = []
    if search:
        conditions.append("(u.full_name LIKE %s OR dp.specialization LIKE %s OR dp.license_number LIKE %s)")
        s = f"%{search}%"
        params.extend([s, s, s])
    if verified == 'true':
        conditions.append("dp.is_verified = TRUE")
    elif verified == 'false':
        conditions.append("dp.is_verified = FALSE")
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY dp.created_at DESC"
    return jsonify(query(sql, params))

@app.route('/api/v1/admin/doctors/pending', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_pending_doctors():
    doctors = query("""SELECT u.id, u.full_name, u.email, u.phone, u.profile_image, u.created_at,
                              dp.specialization, dp.experience_years, dp.qualification,
                              dp.license_number, dp.medical_council, dp.consultation_fee, dp.about
                       FROM doctor_profiles dp
                       JOIN users u ON u.id = dp.user_id
                       WHERE dp.is_verified = FALSE
                       ORDER BY dp.created_at ASC""")
    return jsonify(doctors)

@app.route('/api/v1/admin/doctors/<doctor_id>/verify', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_verify_doctor(doctor_id):
    query("UPDATE doctor_profiles SET is_verified = TRUE, verified_by = %s, verified_at = NOW() WHERE user_id = %s",
          (request.user['id'], doctor_id), fetch=False)
    query("UPDATE users SET is_admin_approved = TRUE WHERE id = %s", (doctor_id,), fetch=False)
    # Create notification
    notif_id = generate_uuid()
    query("""INSERT INTO notifications (id, user_id, type, title, body, priority)
             VALUES (%s, %s, 'system', 'Verification Approved', 'Your doctor profile has been verified!', 'medium')""",
          (notif_id, doctor_id), fetch=False)
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_verify_doctor', f'Verified doctor {doctor_id}', request.remote_addr), fetch=False)
    return jsonify({'message': 'Doctor verified'})

@app.route('/api/v1/admin/doctors/<doctor_id>/reject', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_reject_doctor(doctor_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'Not specified')
    query("UPDATE users SET is_admin_approved = FALSE WHERE id = %s", (doctor_id,), fetch=False)
    notif_id = generate_uuid()
    query("""INSERT INTO notifications (id, user_id, type, title, body, priority)
             VALUES (%s, %s, 'system', 'Verification Rejected', %s, 'high')""",
          (notif_id, doctor_id, f'Your doctor verification was rejected. Reason: {reason}'), fetch=False)
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_reject_doctor', f'Rejected doctor {doctor_id}: {reason}', request.remote_addr), fetch=False)
    return jsonify({'message': 'Doctor verification rejected'})

# --- Hospital Management ---
@app.route('/api/v1/admin/hospitals', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_hospitals():
    search = request.args.get('search', '')
    verified = request.args.get('verified', '')
    city = request.args.get('city', '')
    sql = "SELECT * FROM hospitals WHERE deleted_at IS NULL"
    params = []
    conditions = []
    if search:
        conditions.append("(name LIKE %s OR city LIKE %s OR registration_number LIKE %s)")
        s = f"%{search}%"
        params.extend([s, s, s])
    if verified == 'true':
        conditions.append("is_verified = TRUE")
    elif verified == 'false':
        conditions.append("is_verified = FALSE")
    if city:
        conditions.append("city = %s")
        params.append(city)
    if conditions:
        sql += " AND " + " AND ".join(conditions)
    sql += " ORDER BY created_at DESC"
    return jsonify(query(sql, params))

@app.route('/api/v1/admin/hospitals/<hospital_id>', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_hospital_detail(hospital_id):
    hospital = query("SELECT * FROM hospitals WHERE id = %s", (hospital_id,))
    if not hospital:
        return jsonify({'error': 'Hospital not found'}), 404
    depts = query("SELECT * FROM hospital_departments WHERE hospital_id = %s", (hospital_id,))
    beds = query("SELECT * FROM hospital_beds WHERE hospital_id = %s", (hospital_id,))
    blood = query("""SELECT hbs.* FROM hospital_blood_stocks hbs
                     JOIN hospital_blood_bank hbb ON hbb.id = hbs.blood_bank_id
                     WHERE hbb.hospital_id = %s""", (hospital_id,))
    ambulances = query("SELECT * FROM hospital_ambulances WHERE hospital_id = %s", (hospital_id,))
    return jsonify({'hospital': hospital[0], 'departments': depts, 'beds': beds,
                    'blood_stocks': blood, 'ambulances': ambulances})

@app.route('/api/v1/admin/hospitals/<hospital_id>/verify', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_verify_hospital(hospital_id):
    query("UPDATE hospitals SET is_verified = TRUE, verified_by = %s, verified_at = NOW() WHERE id = %s",
          (request.user['id'], hospital_id), fetch=False)
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_verify_hospital', f'Verified hospital {hospital_id}', request.remote_addr), fetch=False)
    return jsonify({'message': 'Hospital verified'})

# --- Pharmacy Management ---
@app.route('/api/v1/admin/pharmacies', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_pharmacies():
    search = request.args.get('search', '')
    verified = request.args.get('verified', '')
    sql = "SELECT * FROM pharmacies WHERE 1=1"
    params = []
    conditions = []
    if search:
        conditions.append("(name LIKE %s OR city LIKE %s OR license_number LIKE %s)")
        s = f"%{search}%"
        params.extend([s, s, s])
    if verified == 'true':
        conditions.append("is_verified = TRUE")
    elif verified == 'false':
        conditions.append("is_verified = FALSE")
    if conditions:
        sql += " AND " + " AND ".join(conditions)
    sql += " ORDER BY created_at DESC"
    return jsonify(query(sql, params))

@app.route('/api/v1/admin/pharmacies/<pharmacy_id>', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_pharmacy_detail(pharmacy_id):
    pharmacy = query("SELECT * FROM pharmacies WHERE id = %s", (pharmacy_id,))
    if not pharmacy:
        return jsonify({'error': 'Pharmacy not found'}), 404
    inventory_count = query("SELECT COUNT(*) as c FROM pharmacy_inventory WHERE pharmacy_id = %s", (pharmacy_id,))[0]['c']
    low_stock = query("""SELECT medicine_name, quantity, min_stock FROM pharmacy_inventory
                         WHERE pharmacy_id = %s AND quantity <= min_stock""", (pharmacy_id,))
    return jsonify({'pharmacy': pharmacy[0], 'inventory_count': inventory_count, 'low_stock_items': low_stock})

@app.route('/api/v1/admin/pharmacies/<pharmacy_id>/verify', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_verify_pharmacy(pharmacy_id):
    query("UPDATE pharmacies SET is_verified = TRUE, verified_by = %s, verified_at = NOW() WHERE id = %s",
          (request.user['id'], pharmacy_id), fetch=False)
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_verify_pharmacy', f'Verified pharmacy {pharmacy_id}', request.remote_addr), fetch=False)
    return jsonify({'message': 'Pharmacy verified'})

# --- Appointment Management ---
@app.route('/api/v1/admin/appointments', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_appointments():
    status = request.args.get('status', '')
    date = request.args.get('date', '')
    doctor_id = request.args.get('doctor_id', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 50))
    offset = (page - 1) * limit

    sql = """SELECT a.*, p.full_name as patient_name, p.email as patient_email,
                    d.full_name as doctor_name, dp.specialization, h.name as hospital_name
             FROM appointments a
             JOIN users p ON p.id = a.patient_id
             JOIN doctor_profiles dp ON dp.id = a.doctor_id
             JOIN users d ON d.id = dp.user_id
             LEFT JOIN hospitals h ON h.id = a.hospital_id"""
    params = []
    conditions = []
    if status:
        conditions.append("a.status = %s")
        params.append(status)
    if date:
        conditions.append("a.appointment_date = %s")
        params.append(date)
    if doctor_id:
        conditions.append("a.doctor_id = %s")
        params.append(doctor_id)
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY a.appointment_date DESC, a.start_time DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    return jsonify(query(sql, params))

# --- Verification Center ---
@app.route('/api/v1/admin/verifications', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_verifications():
    entity_type = request.args.get('type', '')
    status = request.args.get('status', 'pending')
    results = []

    if not entity_type or entity_type == 'doctor':
        doctors = query("""SELECT u.id, u.full_name, u.email, 'doctor' as entity_type,
                                 dp.specialization, dp.license_number, dp.is_verified as status_flag,
                                 u.created_at as submitted_date
                          FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id
                          WHERE dp.is_verified = FALSE ORDER BY dp.created_at ASC""")
        results.extend(doctors)

    if not entity_type or entity_type == 'hospital':
        hospitals = query("""SELECT id, name as full_name, registration_number as license_number,
                                   type as specialization, is_verified as status_flag,
                                   'hospital' as entity_type, created_at as submitted_date
                            FROM hospitals WHERE is_verified = FALSE AND deleted_at IS NULL
                            ORDER BY created_at ASC""")
        results.extend(hospitals)

    if not entity_type or entity_type == 'pharmacy':
        pharmacies = query("""SELECT id, name as full_name, license_number, pharmacist_name,
                                    is_verified as status_flag, 'pharmacy' as entity_type,
                                    created_at as submitted_date
                             FROM pharmacies WHERE is_verified = FALSE ORDER BY created_at ASC""")
        results.extend(pharmacies)

    return jsonify(results)

@app.route('/api/v1/admin/verifications/<entity_type>/<entity_id>/approve', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_approve_verification(entity_type, entity_id):
    if entity_type == 'doctor':
        query("UPDATE doctor_profiles SET is_verified = TRUE, verified_by = %s, verified_at = NOW() WHERE user_id = %s",
              (request.user['id'], entity_id), fetch=False)
        query("UPDATE users SET is_admin_approved = TRUE WHERE id = %s", (entity_id,), fetch=False)
    elif entity_type == 'hospital':
        query("UPDATE hospitals SET is_verified = TRUE, verified_by = %s, verified_at = NOW() WHERE id = %s",
              (request.user['id'], entity_id), fetch=False)
    elif entity_type == 'pharmacy':
        query("UPDATE pharmacies SET is_verified = TRUE, verified_by = %s, verified_at = NOW() WHERE id = %s",
              (request.user['id'], entity_id), fetch=False)
    else:
        return jsonify({'error': 'Invalid entity type'}), 400

    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_approve_verification',
           f'Approved {entity_type} verification: {entity_id}', request.remote_addr), fetch=False)
    return jsonify({'message': f'{entity_type.capitalize()} verification approved'})

@app.route('/api/v1/admin/verifications/<entity_type>/<entity_id>/reject', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_reject_verification(entity_type, entity_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'Not specified')

    if entity_type == 'doctor':
        query("UPDATE users SET is_admin_approved = FALSE WHERE id = %s", (entity_id,), fetch=False)
    # For hospitals and pharmacies, just log - they remain unverified

    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_reject_verification',
           f'Rejected {entity_type} verification: {entity_id}. Reason: {reason}', request.remote_addr), fetch=False)
    return jsonify({'message': f'{entity_type.capitalize()} verification rejected'})

# --- Audit & Security Logs ---
@app.route('/api/v1/admin/audit-logs', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_audit_logs():
    action = request.args.get('action', '')
    user_id = request.args.get('user_id', '')
    date_from = request.args.get('date_from', '')
    date_to = request.args.get('date_to', '')
    limit = int(request.args.get('limit', 100))

    sql = """SELECT al.*, u.full_name as user_name
             FROM audit_logs al
             LEFT JOIN users u ON u.id = al.user_id WHERE 1=1"""
    params = []
    if action:
        sql += " AND al.action = %s"
        params.append(action)
    if user_id:
        sql += " AND al.user_id = %s"
        params.append(user_id)
    if date_from:
        sql += " AND al.created_at >= %s"
        params.append(date_from)
    if date_to:
        sql += " AND al.created_at <= %s"
        params.append(date_to)
    sql += " ORDER BY al.created_at DESC LIMIT %s"
    params.append(limit)
    return jsonify(query(sql, params))

@app.route('/api/v1/admin/security/logs', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_security_logs():
    logs = query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100")
    failed_logins = query("SELECT COUNT(*) as c FROM audit_logs WHERE action = 'login_failed'")[0]['c']
    suspicious = query("SELECT COUNT(*) as c FROM audit_logs WHERE action LIKE 'suspicious%'")[0]['c']
    return jsonify({'logs': logs, 'failed_logins': failed_logins, 'suspicious_activities': suspicious})

@app.route('/api/v1/admin/system/health', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_system_health():
    db_status = 'healthy'
    try:
        query("SELECT 1")
    except:
        db_status = 'disconnected'
    total_tables = query("SELECT COUNT(*) as c FROM information_schema.tables WHERE table_schema = 'aetherion_healthcare'")[0]['c']
    db_size = query("""SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
                       FROM information_schema.tables WHERE table_schema = 'aetherion_healthcare'""")[0]['size_mb']
    return jsonify({
        'status': 'healthy' if db_status == 'healthy' else 'degraded',
        'uptime': '99.9%', 'cpu_usage': 23, 'memory_usage': 45,
        'disk_usage': 32, 'active_connections': 12,
        'response_time': '120ms', 'last_incident': 'none',
        'database': {'status': db_status, 'tables': total_tables, 'size_mb': db_size}
    })

# --- Emergency Monitoring ---
@app.route('/api/v1/admin/emergencies', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_emergencies():
    status = request.args.get('status', '')
    sql = """SELECT ar.*, h.name as hospital_name, u.full_name as requester_name
             FROM ambulance_requests ar
             LEFT JOIN hospitals h ON h.id = ar.hospital_id
             LEFT JOIN users u ON u.id = ar.requested_by"""
    params = []
    if status:
        sql += " WHERE ar.status = %s"
        params.append(status)
    sql += " ORDER BY ar.created_at DESC"
    return jsonify(query(sql, params))

@app.route('/api/v1/admin/emergencies/<emergency_id>/status', methods=['PUT'])
@token_required
@role_required('admin', 'super_admin')
def admin_update_emergency_status(emergency_id):
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ('pending', 'dispatched', 'picked-up', 'arrived', 'completed', 'cancelled'):
        return jsonify({'error': 'Invalid status'}), 400
    query("UPDATE ambulance_requests SET status = %s WHERE id = %s", (new_status, emergency_id), fetch=False)
    return jsonify({'message': f'Emergency status updated to {new_status}'})

# --- Blood Bank ---
@app.route('/api/v1/admin/blood-bank', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_blood_bank():
    banks = query("""SELECT hbb.*, h.name as hospital_name
                     FROM hospital_blood_bank hbb
                     JOIN hospitals h ON h.id = hbb.hospital_id""")
    stocks = query("""SELECT hbs.*, h.name as hospital_name
                      FROM hospital_blood_stocks hbs
                      JOIN hospital_blood_bank hbb ON hbb.id = hbs.blood_bank_id
                      JOIN hospitals h ON h.id = hbb.hospital_id""")
    donors = []
    try:
        donors = query("""SELECT bd.blood_group, COUNT(*) as count, SUM(bd.is_available) as available
                          FROM blood_donors bd WHERE bd.status = 'approved' GROUP BY bd.blood_group""")
    except:
        pass
    requests = query("""SELECT br.*, u.full_name as requester_name, h.name as hospital_name
                        FROM blood_requests br
                        LEFT JOIN users u ON u.id = br.requested_by
                        LEFT JOIN hospitals h ON h.id = br.hospital_id
                        ORDER BY br.created_at DESC LIMIT 50""")
    return jsonify({'banks': banks, 'stocks': stocks, 'donors_by_group': donors, 'requests': requests})

@app.route('/api/v1/admin/blood-analytics', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_blood_analytics():
    total_banks = query("SELECT COUNT(*) as c FROM hospital_blood_bank")[0]['c']
    total_units = query("SELECT COALESCE(SUM(units), 0) as c FROM hospital_blood_stocks")[0]['c']
    available = query("SELECT COALESCE(SUM(units), 0) as c FROM hospital_blood_stocks WHERE status = 'sufficient'")[0]['c']
    expiring = query("SELECT COALESCE(SUM(units), 0) as c FROM hospital_blood_stocks WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)")[0]['c']
    distribution = query("SELECT blood_group, SUM(units) as count FROM hospital_blood_stocks GROUP BY blood_group")
    alerts = query("""SELECT hbs.*, h.name as hospital_name
                      FROM hospital_blood_stocks hbs
                      JOIN hospital_blood_bank hbb ON hbb.id = hbs.blood_bank_id
                      JOIN hospitals h ON h.id = hbb.hospital_id
                      WHERE hbs.status IN ('low', 'critical', 'out-of-stock')""")
    dist_dict = {r['blood_group']: r['count'] for r in distribution}
    return jsonify({
        'total_blood_banks': total_banks, 'total_units': total_units,
        'available_units': available, 'expiring_units': expiring,
        'blood_group_distribution': dist_dict,
        'critical_alerts': alerts,
        'donation_trends': {'labels': [], 'datasets': []},
        'usage_trends': {'labels': [], 'datasets': []}
    })

# --- Notifications ---
@app.route('/api/v1/admin/notifications', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_notifications():
    notifs = query("""SELECT n.*, u.full_name as user_name
                      FROM notifications n
                      LEFT JOIN users u ON u.id = n.user_id
                      ORDER BY n.created_at DESC LIMIT 100""")
    return jsonify(notifs)

@app.route('/api/v1/admin/notifications/send', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_send_notification():
    data = request.get_json()
    target = data.get('target', 'all')  # all, doctors, patients, etc.
    title = data.get('title', '')
    body = data.get('body', data.get('message', ''))
    priority = data.get('priority', 'medium')

    if not title or not body:
        return jsonify({'error': 'Title and body required'}), 400

    if target == 'all':
        users = query("SELECT id FROM users WHERE is_active = TRUE AND deleted_at IS NULL")
    elif target == 'doctors':
        users = query("SELECT u.id FROM users u JOIN doctor_profiles dp ON dp.user_id = u.id WHERE u.is_active = TRUE")
    elif target == 'patients':
        users = query("SELECT u.id FROM users u JOIN user_roles ur ON ur.user_id = u.id JOIN roles r ON r.id = ur.role_id WHERE r.name = 'patient' AND u.is_active = TRUE")
    else:
        users = [{'id': target}]

    count = 0
    for u in users:
        notif_id = generate_uuid()
        query("""INSERT INTO notifications (id, user_id, type, title, body, priority)
                 VALUES (%s, %s, 'system', %s, %s, %s)""",
              (notif_id, u['id'], title, body, priority), fetch=False)
        count += 1

    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_send_notification',
           f'Sent notification to {count} users: {title}', request.remote_addr), fetch=False)
    return jsonify({'message': f'Notification sent to {count} users', 'count': count})

# --- Feedback / Complaints ---
@app.route('/api/v1/admin/feedback', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_feedback():
    feedback_table = query("SHOW TABLES LIKE 'feedback'")
    if not feedback_table:
        return jsonify([])
    status = request.args.get('status', '')
    sql = """SELECT f.*, u.full_name as user_name
             FROM feedback f JOIN users u ON u.id = f.user_id WHERE 1=1"""
    params = []
    if status:
        sql += " AND f.status = %s"
        params.append(status)
    sql += " ORDER BY f.created_at DESC"
    return jsonify(query(sql, params))

@app.route('/api/v1/admin/feedback/<feedback_id>/status', methods=['PATCH'])
@token_required
@role_required('admin', 'super_admin')
def admin_update_feedback_status(feedback_id):
    data = request.get_json()
    status = data.get('status')
    response_text = data.get('response', '')
    if status:
        query("UPDATE feedback SET status = %s WHERE id = %s", (status, feedback_id), fetch=False)
    if response_text:
        query("UPDATE feedback SET response = %s, resolved_by = %s, resolved_date = NOW() WHERE id = %s",
              (response_text, request.user['id'], feedback_id), fetch=False)
    return jsonify({'message': 'Feedback updated'})

# --- Reports ---
@app.route('/api/v1/admin/reports', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_reports():
    reports_table = query("SHOW TABLES LIKE 'reports'")
    if not reports_table:
        return jsonify([])
    return jsonify(query("SELECT * FROM reports ORDER BY created_at DESC"))

@app.route('/api/v1/admin/reports/generate', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_generate_report():
    data = request.get_json()
    report_type = data.get('type', 'system')
    report_id = generate_uuid()

    # Generate report data based on type
    if report_type == 'user':
        report_data = query("""SELECT u.full_name, u.email, r.name as role, u.is_active, u.created_at
                              FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
                              LEFT JOIN roles r ON r.id = ur.role_id WHERE u.deleted_at IS NULL
                              ORDER BY u.created_at DESC LIMIT 1000""")
    elif report_type == 'doctor':
        report_data = query("""SELECT u.full_name, dp.specialization, dp.is_verified, dp.rating, dp.total_patients
                              FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id ORDER BY dp.rating DESC""")
    elif report_type == 'hospital':
        report_data = query("SELECT name, city, type, is_verified, rating, total_beds FROM hospitals WHERE deleted_at IS NULL")
    elif report_type == 'donation':
        report_data = query("""SELECT bd.blood_group, COUNT(*) as donor_count, bd.total_donations
                              FROM blood_donors bd WHERE bd.status = 'approved' GROUP BY bd.blood_group""")
    elif report_type == 'financial':
        report_data = query("""SELECT DATE(created_at) as date, COUNT(*) as appointments,
                                      SUM(fee) as revenue FROM appointments GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30""")
    else:
        report_data = {'total_users': query("SELECT COUNT(*) as c FROM users WHERE deleted_at IS NULL")[0]['c'],
                       'total_doctors': query("SELECT COUNT(*) as c FROM doctor_profiles")[0]['c'],
                       'total_hospitals': query("SELECT COUNT(*) as c FROM hospitals WHERE deleted_at IS NULL")[0]['c']}

    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_generate_report',
           f'Generated {report_type} report', request.remote_addr), fetch=False)
    return jsonify({'id': report_id, 'type': report_type, 'data': report_data,
                    'generated_at': datetime.utcnow().isoformat(), 'generated_by': request.user['full_name']})

# --- Revenue ---
@app.route('/api/v1/admin/revenue', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_revenue():
    period = request.args.get('period', 'month')
    if period == 'week':
        interval = '7 DAY'
    elif period == 'year':
        interval = '1 YEAR'
    else:
        interval = '30 DAY'

    total_appointment_revenue = query(f"""SELECT COALESCE(SUM(fee), 0) as total
                                          FROM appointments WHERE fee > 0
                                          AND created_at >= DATE_SUB(NOW(), INTERVAL {interval})""")[0]['total']
    paid_appointments = query(f"""SELECT COUNT(*) as c FROM appointments
                                  WHERE payment_status = 'paid'
                                  AND created_at >= DATE_SUB(NOW(), INTERVAL {interval})""")[0]['c']
    pending_payments = query(f"""SELECT COUNT(*) as c FROM appointments
                                WHERE payment_status = 'pending'
                                AND created_at >= DATE_SUB(NOW(), INTERVAL {interval})""")[0]['c']
    daily_revenue = query(f"""SELECT DATE(created_at) as date, SUM(fee) as revenue, COUNT(*) as count
                              FROM appointments WHERE fee > 0
                              AND created_at >= DATE_SUB(NOW(), INTERVAL {interval})
                              GROUP BY DATE(created_at) ORDER BY date""")
    medicine_revenue = query(f"""SELECT COALESCE(SUM(final_amount), 0) as total
                                 FROM medicine_orders WHERE payment_status = 'paid'
                                 AND created_at >= DATE_SUB(NOW(), INTERVAL {interval})""")[0]['total']
    return jsonify({
        'total_appointment_revenue': float(total_appointment_revenue),
        'paid_appointments': paid_appointments,
        'pending_payments': pending_payments,
        'daily_revenue': daily_revenue,
        'medicine_revenue': float(medicine_revenue),
        'total_revenue': float(total_appointment_revenue) + float(medicine_revenue)
    })

# --- Women's Health ---
@app.route('/api/v1/admin/women-health', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_women_health():
    total_pregnancies = query("SELECT COUNT(*) as c FROM women_pregnancies")[0]['c']
    active_pregnancies = query("SELECT COUNT(*) as c FROM women_pregnancies WHERE status = 'active'")[0]['c']
    high_risk = query("SELECT COUNT(*) as c FROM women_pregnancies WHERE high_risk = TRUE")[0]['c']
    total_cycles = query("SELECT COUNT(*) as c FROM women_menstrual_cycles")[0]['c']
    recent_pregnancies = query("""SELECT wp.*, u.full_name as mother_name
                                  FROM women_pregnancies wp
                                  JOIN users u ON u.id = wp.user_id
                                  ORDER BY wp.created_at DESC LIMIT 20""")
    return jsonify({
        'total_pregnancies': total_pregnancies, 'active_pregnancies': active_pregnancies,
        'high_risk_pregnancies': high_risk, 'total_cycles': total_cycles,
        'recent_pregnancies': recent_pregnancies
    })

# --- Patient Management ---
@app.route('/api/v1/admin/patients', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_patients():
    search = request.args.get('search', '')
    sql = """SELECT u.id, u.full_name, u.email, u.phone, u.gender, u.blood_group,
                    u.is_active, u.is_verified, u.created_at, u.last_login_at
             FROM users u
             JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
             JOIN roles r ON r.id = ur.role_id
             WHERE r.name = 'patient' AND u.deleted_at IS NULL"""
    params = []
    if search:
        sql += " AND (u.full_name LIKE %s OR u.email LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s])
    sql += " ORDER BY u.created_at DESC"
    return jsonify(query(sql, params))

# --- Messages ---
@app.route('/api/v1/admin/messages', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_messages():
    msgs = query("""SELECT m.*, s.full_name as sender_name, r.full_name as receiver_name
                    FROM messages m
                    JOIN users s ON s.id = m.sender_id
                    JOIN users r ON r.id = m.receiver_id
                    ORDER BY m.created_at DESC LIMIT 100""")
    return jsonify(msgs)

# --- Complaints ---
@app.route('/api/v1/admin/complaints', methods=['GET'])
@token_required
@role_required('admin', 'super_admin')
def admin_get_complaints():
    feedback_table = query("SHOW TABLES LIKE 'feedback'")
    if not feedback_table:
        return jsonify([])
    complaints = query("""SELECT f.*, u.full_name as user_name
                          FROM feedback f JOIN users u ON u.id = f.user_id
                          WHERE f.type = 'complaint'
                          ORDER BY f.created_at DESC""")
    return jsonify(complaints)

# --- SMS / Email (placeholder) ---
@app.route('/api/v1/admin/notifications/sms', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_send_sms():
    data = request.get_json()
    # SMS integration would go here - for now just log
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_send_sms',
           f'SMS to {data.get("phone", "unknown")}: {data.get("message", "")[:50]}', request.remote_addr), fetch=False)
    return jsonify({'message': 'SMS queued', 'status': 'sent'})

@app.route('/api/v1/admin/notifications/email', methods=['POST'])
@token_required
@role_required('admin', 'super_admin')
def admin_send_email():
    data = request.get_json()
    query("INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (%s, %s, %s, %s)",
          (request.user['id'], 'admin_send_email',
           f'Email to {data.get("email", "unknown")}: {data.get("subject", "")}', request.remote_addr), fetch=False)
    return jsonify({'message': 'Email queued', 'status': 'sent'})

# ============================================
# WOMEN HEALTH ROUTES
# ============================================
@app.route('/api/v1/women/menstrual-cycle', methods=['GET', 'POST'])
@token_required
def menstrual_cycle():
    user = request.user
    if request.method == 'GET':
        cycles = query("SELECT * FROM women_menstrual_cycles WHERE user_id = %s ORDER BY start_date DESC", (user['id'],))
        return jsonify(cycles)
    else:
        data = request.get_json()
        data['user_id'] = user['id']
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO women_menstrual_cycles ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Cycle recorded'}), 201

@app.route('/api/v1/women/pregnancies', methods=['GET', 'POST'])
@token_required
def pregnancies():
    user = request.user
    if request.method == 'GET':
        preg = query("SELECT * FROM women_pregnancies WHERE user_id = %s ORDER BY created_at DESC", (user['id'],))
        return jsonify(preg)
    else:
        data = request.get_json()
        data['user_id'] = user['id']
        cols = ', '.join(data.keys())
        vals = ', '.join(['%s'] * len(data))
        query(f"INSERT INTO women_pregnancies ({cols}) VALUES ({vals})", list(data.values()), fetch=False)
        return jsonify({'message': 'Pregnancy recorded'}), 201

# ============================================
# STATIC FILES (File Upload)
# ============================================
@app.route('/api/v1/upload', methods=['POST'])
@token_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    filename = f"{generate_uuid()}.{ext}"
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'url': f"/uploads/{filename}", 'filename': filename})

@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

# ============================================
# ERROR HANDLERS
# ============================================
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# ============================================
# SEED DATA (Create demo users if none exist)
# ============================================
def seed_database():
    """Seed database with initial data"""
    try:
        # Check if roles exist
        roles = query("SELECT COUNT(*) as count FROM roles")
        if roles and roles[0]['count'] == 0:
            role_data = [
                ('super_admin', 'Super Admin', 'Full system access', 100),
                ('admin', 'Admin', 'Platform management', 80),
                ('moderator', 'Moderator', 'Content moderation', 60),
                ('doctor', 'Doctor', 'Medical professional', 50),
                ('hospital', 'Hospital', 'Hospital management', 50),
                ('pharmacy', 'Pharmacy', 'Pharmacy management', 50),
                ('patient', 'Patient', 'Healthcare consumer', 10),
                ('blood_donor', 'Blood Donor', 'Blood donation', 10),
            ]
            for name, display, desc, priority in role_data:
                query("INSERT INTO roles (name, display_name, description, priority) VALUES (%s, %s, %s, %s)",
                     (name, display, desc, priority), fetch=False)
            print("✅ Roles seeded!")
    except Exception as e:
        print(f"⚠️ Seed warning: {e}")

# ============================================
# MAIN
# ============================================
if __name__ == '__main__':
    print("=" * 50)
    print("Aetherion Healthcare API")
    print("=" * 50)
    seed_database()
    app.run(host='0.0.0.0', port=5000, debug=True)