# ============================================
# 🏥 AETHERION HEALTHCARE - Database Connection
# ============================================

import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="aetherion_healthcare"
)

cursor = db.cursor()

# ============================================
# TEST CONNECTION
# ============================================
if __name__ == "__main__":
    try:
        cursor.execute("SELECT DATABASE()")
        result = cursor.fetchone()
        print(f"✅ Connected to database: {result[0]}")
        
        # Show all tables
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"📊 Total tables: {len(tables)}")
        for table in tables:
            print(f"   - {table[0]}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
    finally:
        cursor.close()
        db.close()