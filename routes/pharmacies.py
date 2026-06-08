# app2/routes/pharmacies.py - Pharmacy Module Routes
from flask import Blueprint, request, jsonify
from ..database import DB
from ..middleware.auth import jwt_token_required, role_required

pharmacies_bp = Blueprint('pharmacies', __name__)

@pharmacies_bp.route('', methods=['GET'])
def list_pharmacies():
    search = request.args.get('q')
    sql = "SELECT * FROM pharmacies WHERE is_active = TRUE"
    params = []
    if search:
        sql += " AND (name LIKE %s OR city LIKE %s)"
        s = f"%{search}%"
        params.extend([s, s])
    sql += " ORDER BY rating DESC"
    return jsonify(DB.fetch_all(sql, params))

@pharmacies_bp.route('/<pharmacy_id>', methods=['GET'])
def get_pharmacy(pharmacy_id):
    pharm = DB.fetch_one("SELECT * FROM pharmacies WHERE id = %s", (pharmacy_id,))
    if not pharm:
        return jsonify({'error': 'Pharmacy not found'}), 404
    inv = DB.fetch_all("SELECT * FROM pharmacy_inventory WHERE pharmacy_id = %s AND is_available = TRUE", (pharmacy_id,))
    return jsonify({'pharmacy': pharm, 'inventory': inv})

@pharmacies_bp.route('/me', methods=['GET', 'PUT'])
@jwt_token_required
@role_required('pharmacy')
def manage_pharmacy():
    user = request.user
    if request.method == 'GET':
        pharm = DB.fetch_one("SELECT * FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
        if not pharm:
            DB.execute("""INSERT INTO pharmacies (id, admin_user_id, name, pharmacist_name, license_number, registration_number)
                VALUES (%s,%s,%s,%s,%s,%s)""",
                (__import__('uuid').uuid4().__str__(), user['id'], user['full_name'] + "'s Pharmacy",
                 user['full_name'], 'PHARM-' + user['id'][:8], 'REG-' + user['id'][:8]))
            pharm = DB.fetch_one("SELECT * FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
        return jsonify(pharm)
    else:
        data = request.get_json()
        pharm = DB.fetch_one("SELECT id FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
        if pharm:
            sets = ', '.join([f"`{k}` = %s" for k in data.keys()])
            DB.execute(f"UPDATE pharmacies SET {sets} WHERE admin_user_id = %s", list(data.values()) + [user['id']])
        else:
            data['id'] = __import__('uuid').uuid4().__str__()
            data['admin_user_id'] = user['id']
            cols = ', '.join([f"`{k}`" for k in data.keys()])
            vals = ', '.join(['%s'] * len(data))
            DB.execute(f"INSERT INTO pharmacies ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Pharmacy updated'})

@pharmacies_bp.route('/me/inventory', methods=['GET', 'POST'])
@jwt_token_required
@role_required('pharmacy')
def manage_inventory():
    user = request.user
    pharm = DB.fetch_one("SELECT id FROM pharmacies WHERE admin_user_id = %s", (user['id'],))
    if not pharm:
        return jsonify({'error': 'No pharmacy found'}), 404
    if request.method == 'GET':
        return jsonify(DB.fetch_all("SELECT * FROM pharmacy_inventory WHERE pharmacy_id = %s ORDER BY medicine_name", (pharm['id'],)))
    else:
        data = request.get_json()
        data['pharmacy_id'] = pharm['id']
        cols = ', '.join([f"`{k}`" for k in data.keys()])
        vals = ', '.join(['%s'] * len(data))
        DB.execute(f"INSERT INTO pharmacy_inventory ({cols}) VALUES ({vals})", list(data.values()))
        return jsonify({'message': 'Item added'}), 201

@pharmacies_bp.route('/me/inventory/<int:item_id>', methods=['PUT', 'DELETE'])
@jwt_token_required
@role_required('pharmacy')
def manage_inventory_item(item_id):
    if request.method == 'DELETE':
        DB.execute("UPDATE pharmacy_inventory SET is_available = FALSE WHERE id = %s", (item_id,))
        return jsonify({'message': 'Item removed'})
    data = request.get_json()
    sets = ', '.join([f"`{k}` = %s" for k in data.keys()])
    DB.execute(f"UPDATE pharmacy_inventory SET {sets} WHERE id = %s", list(data.values()) + [item_id])
    return jsonify({'message': 'Item updated'})