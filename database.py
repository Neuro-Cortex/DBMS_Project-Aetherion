# app2/database.py - MySQL Database Connection Pool
import mysql.connector
from mysql.connector import pooling
from .config import Config

_connection_pool = None

def get_connection_pool():
    """Initialize MySQL connection pool"""
    global _connection_pool
    if _connection_pool is None:
        _connection_pool = pooling.MySQLConnectionPool(
            pool_name="aetherion_pool",
            pool_size=10,
            pool_reset_session=True,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci',
        )
    return _connection_pool

def get_db():
    """Get a database connection from the pool"""
    return get_connection_pool().get_connection()

def init_app(app):
    """Initialize the database with Flask app"""
    try:
        get_connection_pool()
        print("✅ Database connection pool initialized")
    except Exception as e:
        print(f"❌ Database pool error: {e}")
        raise

class DB:
    """Database helper class for executing queries"""
    
    @staticmethod
    def fetch_one(sql, params=None):
        """Fetch a single row as dict"""
        db = get_db()
        cursor = db.cursor(dictionary=True)
        try:
            cursor.execute(sql, params or ())
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            db.close()
    
    @staticmethod
    def fetch_all(sql, params=None):
        """Fetch all rows as list of dicts"""
        db = get_db()
        cursor = db.cursor(dictionary=True)
        try:
            cursor.execute(sql, params or ())
            result = cursor.fetchall()
            return result
        finally:
            cursor.close()
            db.close()
    
    @staticmethod
    def execute(sql, params=None):
        """Execute a write query and return lastrowid"""
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute(sql, params or ())
            db.commit()
            return cursor.lastrowid
        except Exception as e:
            db.rollback()
            raise e
        finally:
            cursor.close()
            db.close()
    
    @staticmethod
    def execute_many(sql, params_list):
        """Execute many rows at once"""
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.executemany(sql, params_list)
            db.commit()
            return cursor.rowcount
        except Exception as e:
            db.rollback()
            raise e
        finally:
            cursor.close()
            db.close()