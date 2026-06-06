import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="aethion_db"
    )

if __name__ == "__main__":
    try:
        conn = get_connection()
        if conn.is_connected():
            print("Database connected successfully!")
        conn.close()
    except Exception as e:
        print(f"Failed to connect: {e}")
