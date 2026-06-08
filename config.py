# app2/config.py - Application Configuration
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'aetherion_healthcare')
    
    # JWT
    JWT_SECRET = os.getenv('JWT_SECRET', 'aetherion-super-secret-key-2024')
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
    JWT_ACCESS_EXPIRY_HOURS = int(os.getenv('JWT_ACCESS_EXPIRY_HOURS', 24))
    
    # Server
    FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # CORS
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    CORS_ORIGINS = ['*']
    
    # MySQL connection string for Flask-MySQL
    MYSQL_HOST = DB_HOST
    MYSQL_PORT = DB_PORT
    MYSQL_USER = DB_USER
    MYSQL_PASSWORD = DB_PASSWORD
    MYSQL_DB = DB_NAME
    MYSQL_CURSORCLASS = 'DictCursor'