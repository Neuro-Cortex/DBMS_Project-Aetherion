# run.py - Flask Application Entry Point
# ============================================
# 🏥 AETHERION HEALTHCARE - Flask Backend
# ============================================

from dotenv import load_dotenv
load_dotenv()

from app2 import create_app
from app2.config import Config

app = create_app()

if __name__ == '__main__':
    print("=" * 50)
    print("🏥 Aetherion Healthcare API")
    print(f"   Host: {Config.FLASK_HOST}")
    print(f"   Port: {Config.FLASK_PORT}")
    print(f"   Debug: {Config.FLASK_DEBUG}")
    print("=" * 50)
    
    app.run(
        host=Config.FLASK_HOST,
        port=Config.FLASK_PORT,
        debug=Config.FLASK_DEBUG
    )