import mysql.connector
from fastapi import FastAPI

app = FastAPI()

# 1. Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="aethion_db"
)

print("DB connected successfully ✅")

# 2. Cursor তৈরি
cursor = db.cursor()

# 3. SQL query চালানো
cursor.execute("SELECT * FROM admin_users")

# 4. সব data আনা
result = cursor.fetchall()

# 5. data print করা
for row in result:
    print(row)