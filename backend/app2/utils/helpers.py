# utils/helpers.py - Helper utilities
import json
from flask import jsonify as flask_jsonify

def make_response(data=None, message='Success', status=200):
    """Standard API response format"""
    body = {'success': True, 'message': message}
    if data is not None:
        body['data'] = data
    return flask_jsonify(body), status

def make_error(message='Error', status=400):
    """Standard error response format"""
    return flask_jsonify({'success': False, 'error': message}), status

def paginate(query, params=None, page=1, per_page=20):
    """Add pagination to a query"""
    from ..database import DB
    offset = (page - 1) * per_page
    
    # Get total count
    count_sql = f"SELECT COUNT(*) as total FROM ({query}) as counted"
    total = DB.fetch_one(count_sql, params or ())['total']
    
    # Get paginated results
    paginated_query = f"{query} LIMIT %s OFFSET %s"
    p = list(params or []) + [per_page, offset]
    results = DB.fetch_all(paginated_query, p)
    
    return {
        'items': results,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }