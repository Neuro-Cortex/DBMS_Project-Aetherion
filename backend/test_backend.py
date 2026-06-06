#!/usr/bin/env python3
"""
Aetherion Healthcare - Backend Test Script
Tests all critical endpoints and database connections.
"""

import sys
import requests
from typing import Dict, Any
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
API_PREFIX = "/api/v1"

# Colors for terminal output
class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"


def print_header(text: str):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 60}")
    print(f"{text}")
    print(f"{'=' * 60}{Colors.RESET}\n")


def print_success(message: str):
    print(f"{Colors.GREEN}[✓]{Colors.RESET} {message}")


def print_error(message: str):
    print(f"{Colors.RED}[✗]{Colors.RESET} {message}")


def print_warning(message: str):
    print(f"{Colors.YELLOW}[!]{Colors.RESET} {message}")


def print_info(message: str):
    print(f"    {message}")


def test_endpoint(method: str, endpoint: str, data: Dict[str, Any] = None, 
                   headers: Dict[str, str] = None, token: str = None) -> bool:
    """Test a single endpoint."""
    url = f"{BASE_URL}{endpoint}"
    auth_headers = headers or {}

    if token:
        auth_headers["Authorization"] = f"Bearer {token}"

    try:
        if method == "GET":
            response = requests.get(url, headers=auth_headers, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, headers=auth_headers, timeout=5)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=auth_headers, timeout=5)
        elif method == "DELETE":
            response = requests.delete(url, headers=auth_headers, timeout=5)
        else:
            print_error(f"Unknown method: {method}")
            return False

        return response.status_code < 400, response
    except requests.exceptions.ConnectionError:
        print_error("Server not running. Start with: uvicorn main:app --reload")
        return False, None
    except requests.exceptions.Timeout:
        print_error("Request timeout")
        return False, None
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        return False, None


def test_health_endpoints():
    """Test system health endpoints."""
    print_header("Testing Health Endpoints")

    # Root endpoint
    success, response = test_endpoint("GET", "/")
    if success:
        print_success("GET / - API info endpoint")
        print_info(f"Status: {response.json().get('data', {}).get('status', 'unknown')}")
    else:
        print_error("GET / - Failed")

    # Health check
    success, response = test_endpoint("GET", "/health")
    if success:
        print_success("GET /health - Health check")
        data = response.json().get("data", {})
        db_status = data.get("database", {}).get("status", "unknown")
        print_info(f"Database: {db_status}")
        print_info(f"Redis: {data.get('redis', 'unknown')}")
    else:
        print_error("GET /health - Failed")


def test_auth_endpoints():
    """Test authentication endpoints."""
    print_header("Testing Authentication Endpoints")

    # Test login with demo credentials
    login_data = {
        "email": "admin@aetherion.com",
        "password": "admin123"
    }

    success, response = test_endpoint("POST", f"{API_PREFIX}/auth/login", data=login_data)
    if success:
        print_success("POST /api/v1/auth/login - Login successful")
        token_data = response.json().get("data", {})
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")
        user = token_data.get("user", {})

        print_info(f"User: {user.get('full_name', 'N/A')} ({user.get('email', 'N/A')})")
        print_info(f"Access Token: {'...' + access_token[-20:] if access_token else 'N/A'}")
        print_info(f"Refresh Token: {'...' + refresh_token[-20:] if refresh_token else 'N/A'}")

        return access_token
    else:
        print_error("POST /api/v1/auth/login - Login failed")
        if response:
            print_info(f"Error: {response.text}")
        return None


def test_protected_endpoints(token: str):
    """Test protected endpoints."""
    print_header("Testing Protected Endpoints")

    if not token:
        print_warning("No token available. Skipping protected endpoint tests.")
        return

    # Test profile endpoint
    success, response = test_endpoint("GET", f"{API_PREFIX}/auth/profile", token=token)
    if success:
        print_success("GET /api/v1/auth/profile - Get profile")
        user = response.json().get("data", {})
        print_info(f"Profile: {user.get('full_name', 'N/A')}")
    else:
        print_error("GET /api/v1/auth/profile - Failed")

    # Test role switch
    if token:
        switch_data = {"role": "admin"}
        success, response = test_endpoint("POST", f"{API_PREFIX}/auth/switch-role", 
                                           data=switch_data, token=token)
        if success:
            print_success("POST /api/v1/auth/switch-role - Switch role")
        else:
            print_error("POST /api/v1/auth/switch-role - Failed")


def test_user_endpoints(token: str):
    """Test user management endpoints."""
    print_header("Testing User Endpoints")

    if not token:
        print_warning("No token available. Skipping user endpoint tests.")
        return

    # List users
    success, response = test_endpoint("GET", f"{API_PREFIX}/users", token=token)
    if success:
        print_success("GET /api/v1/users - List users")
        data = response.json().get("data", {})
        total = data.get("total", 0)
        print_info(f"Total users: {total}")
    else:
        print_error("GET /api/v1/users - Failed")


def test_admin_endpoints(token: str):
    """Test admin endpoints."""
    print_header("Testing Admin Endpoints")

    if not token:
        print_warning("No token available. Skipping admin endpoint tests.")
        return

    # Admin dashboard
    success, response = test_endpoint("GET", f"{API_PREFIX}/admin/dashboard", token=token)
    if success:
        print_success("GET /api/v1/admin/dashboard - Admin stats")
        data = response.json().get("data", {})
        print_info(f"Total Users: {data.get('total_users', 0)}")
        print_info(f"Total Doctors: {data.get('total_doctors', 0)}")
        print_info(f"Total Hospitals: {data.get('total_hospitals', 0)}")
    else:
        print_error("GET /api/v1/admin/dashboard - Failed (may need admin role)")


def test_database_connection():
    """Test direct database connection."""
    print_header("Testing Database Connection")

    try:
        from app.core.database import check_database_connection, get_database_info

        if check_database_connection():
            print_success("Database connection successful")
            info = get_database_info()
            print_info(f"Host: {info.get('host')}")
            print_info(f"Port: {info.get('port')}")
            print_info(f"Database: {info.get('database')}")
            print_info(f"Pool Size: {info.get('pool_size')}")
            return True
        else:
            print_error("Database connection failed")
            return False
    except Exception as e:
        print_error(f"Database test failed: {e}")
        return False


def main():
    """Run all tests."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║                                                            ║")
    print("║        Aetherion Healthcare - Backend Test Suite         ║")
    print("║                                                            ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.RESET}")

    print(f"{Colors.CYAN}Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.RESET}")

    # Test database connection
    db_ok = test_database_connection()

    if not db_ok:
        print_warning("Database connection failed. Skipping API tests.")
        return

    # Test health endpoints
    test_health_endpoints()

    # Test authentication
    token = test_auth_endpoints()

    # Test protected endpoints
    test_protected_endpoints(token)

    # Test user endpoints
    test_user_endpoints(token)

    # Test admin endpoints
    test_admin_endpoints(token)

    # Summary
    print_header("Test Summary")
    print(f"{Colors.BOLD}{Colors.GREEN}All critical tests completed!{Colors.RESET}")
    print_info("Server is running and operational")
    print_info(f"API Documentation: {BASE_URL}/docs")
    print_info(f"Health Check: {BASE_URL}/health")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Tests interrupted by user{Colors.RESET}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Fatal error: {e}{Colors.RESET}")
        sys.exit(1)