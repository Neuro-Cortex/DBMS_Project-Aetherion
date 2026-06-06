#!/bin/bash

# Aetherion Healthcare - Backend Startup Script (Linux/Mac)
# ==========================================================

set -e

echo ""
echo "========================================="
echo "  Aetherion Healthcare - Backend Server"
echo "========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "[!] Virtual environment not found. Creating one..."
    python3 -m venv venv
    echo "[✓] Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo ""
echo "[*] Installing dependencies..."
pip install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[✗] Failed to install dependencies"
    exit 1
fi
echo "[✓] Dependencies installed"

# Check database connection
echo ""
echo "[*] Checking database connection..."
python -c "from app.core.database import check_database_connection; exit(0 if check_database_connection() else 1)"
if [ $? -ne 0 ]; then
    echo "[✗] Database connection failed!"
    echo "    Make sure MySQL is running and database 'aethion_db' exists"
    exit 1
fi
echo "[✓] Database connection successful"

# Start the server
echo ""
echo "[✓] Starting server..."
echo ""
echo "========================================="
echo "  Server will be available at:"
echo "    - API: http://localhost:8000"
echo "    - Docs: http://localhost:8000/docs"
echo "    - Health: http://localhost:8000/health"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000