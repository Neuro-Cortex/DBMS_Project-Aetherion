# app2/__init__.py - Flask Application Factory
from flask import Flask
from flask_cors import CORS
from .config import Config
from . import database

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    database.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.users import users_bp
    from .routes.doctors import doctors_bp
    from .routes.hospitals import hospitals_bp
    from .routes.pharmacies import pharmacies_bp
    from .routes.blood_donors import blood_bp
    from .routes.appointments import appointments_bp
    from .routes.women_health import women_bp
    from .routes.search import search_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(doctors_bp, url_prefix='/api/v1/doctors')
    app.register_blueprint(hospitals_bp, url_prefix='/api/v1/hospitals')
    app.register_blueprint(pharmacies_bp, url_prefix='/api/v1/pharmacies')
    app.register_blueprint(blood_bp, url_prefix='/api/v1/blood')
    app.register_blueprint(appointments_bp, url_prefix='/api/v1/appointments')
    app.register_blueprint(women_bp, url_prefix='/api/v1/women')
    app.register_blueprint(search_bp, url_prefix='/api/v1/search')
    
    # Health check
    @app.route('/')
    def root():
        return {'name': 'Aetherion Healthcare API', 'version': '1.0.0', 'status': 'running'}
    
    @app.route('/health')
    def health():
        try:
            from .database import get_db
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            db.close()
            return {'status': 'healthy', 'database': 'connected'}
        except Exception as e:
            return {'status': 'degraded', 'database': str(e)}, 500
    
    return app