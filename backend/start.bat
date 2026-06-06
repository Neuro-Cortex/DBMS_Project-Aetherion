@echo off
REM Aetherion Healthcare - Backend Startup Script (Windows)
REM ==========================================================

echo.
echo =========================================
echo   Aetherion Healthcare - Backend Server
echo =========================================
echo.

REM Check if virtual environment exists
IF NOT EXIST "venv" (
    echo [!] Virtual environment not found. Creating one...
    python -m venv venv
    echo [✓] Virtual environment created
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo [*] Installing dependencies...
pip install -q -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    echo [✗] Failed to install dependencies
    pause
    exit /b 1
)
echo [✓] Dependencies installed

REM Check database connection
echo.
echo [*] Checking database connection...
python -c "from app.core.database import check_database_connection; exit(0 if check_database_connection() else 1)"
IF %ERRORLEVEL% NEQ 0 (
    echo [✗] Database connection failed!
    echo     Make sure MySQL is running and database 'aethion_db' exists
    pause
    exit /b 1
)
echo [✓] Database connection successful

REM Start the server
echo.
echo [✓] Starting server...
echo.
echo =========================================
echo   Server will be available at:
echo     - API: http://localhost:8000
echo     - Docs: http://localhost:8000/docs
echo     - Health: http://localhost:8000/health
echo =========================================
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause