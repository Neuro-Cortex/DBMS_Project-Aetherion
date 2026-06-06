# app2/routes/search.py - Global Search Route
from flask import Blueprint, request, jsonify
from ..database import DB

search_bp = Blueprint('search', __name__)

@search_bp.route('', methods=['GET'])
def global_search():
    q = request.args.get('q', '')
    search_type = request.args.get('type', 'all')
    results = []
    s = f"%{q}%"

    if search_type in ('all', 'doctor'):
        docs = DB.fetch_all("""SELECT u.id, u.full_name as title, dp.specialization as description,
            'doctor' as type, dp.rating, CAST(dp.consultation_fee AS CHAR) as price
            FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id
            WHERE u.full_name LIKE %s OR dp.specialization LIKE %s LIMIT 5""", (s, s))
        results.extend(docs)

    if search_type in ('all', 'hospital'):
        hosps = DB.fetch_all("SELECT id, name as title, city as description, 'hospital' as type, rating FROM hospitals WHERE name LIKE %s OR city LIKE %s LIMIT 5", (s, s))
        results.extend(hosps)

    if search_type in ('all', 'medicine'):
        meds = DB.fetch_all("SELECT id, medicine_name as title, generic_name as description, 'medicine' as type, CAST(price AS CHAR) as price FROM pharmacy_inventory WHERE medicine_name LIKE %s OR generic_name LIKE %s LIMIT 5", (s, s))
        results.extend(meds)

    return jsonify(results)