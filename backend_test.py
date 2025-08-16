#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Scammer Database
Tests all authentication, public, and protected endpoints
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://scamshield-16.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.created_scammer_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None, auth_required: bool = False) -> requests.Response:
        """Make HTTP request with optional authentication"""
        url = f"{self.base_url}{endpoint}"
        request_headers = headers or {}
        
        if auth_required and self.auth_token:
            request_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=request_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=request_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_auth_login_success(self):
        """Test successful admin login"""
        try:
            response = self.make_request("POST", "/auth/login", {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            })
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.auth_token = data["access_token"]
                    self.log_test("Admin Login (Success)", True, f"Token received, type: {data['token_type']}")
                else:
                    self.log_test("Admin Login (Success)", False, "Missing token fields in response", data)
            else:
                self.log_test("Admin Login (Success)", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin Login (Success)", False, f"Exception: {str(e)}")
    
    def test_auth_login_failure(self):
        """Test login with incorrect credentials"""
        try:
            response = self.make_request("POST", "/auth/login", {
                "username": "wrong_user",
                "password": "wrong_password"
            })
            
            if response.status_code == 401:
                self.log_test("Admin Login (Invalid Credentials)", True, "Correctly rejected invalid credentials")
            else:
                self.log_test("Admin Login (Invalid Credentials)", False, f"Expected 401, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin Login (Invalid Credentials)", False, f"Exception: {str(e)}")
    
    def test_auth_me_with_token(self):
        """Test /auth/me with valid token"""
        if not self.auth_token:
            self.log_test("Get Current User (With Token)", False, "No auth token available")
            return
        
        try:
            response = self.make_request("GET", "/auth/me", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if "username" in data and data["username"] == ADMIN_USERNAME:
                    self.log_test("Get Current User (With Token)", True, f"User: {data['username']}, Role: {data.get('role', 'N/A')}")
                else:
                    self.log_test("Get Current User (With Token)", False, "Invalid user data", data)
            else:
                self.log_test("Get Current User (With Token)", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Current User (With Token)", False, f"Exception: {str(e)}")
    
    def test_auth_me_without_token(self):
        """Test /auth/me without token"""
        try:
            response = self.make_request("GET", "/auth/me")
            
            if response.status_code == 403:
                self.log_test("Get Current User (No Token)", True, "Correctly rejected request without token")
            else:
                self.log_test("Get Current User (No Token)", False, f"Expected 403, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Current User (No Token)", False, f"Exception: {str(e)}")
    
    def test_auth_register(self):
        """Test user registration"""
        test_username = f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        try:
            response = self.make_request("POST", "/auth/register", {
                "username": test_username,
                "password": "testpassword123"
            })
            
            if response.status_code == 200:
                data = response.json()
                if "username" in data and data["username"] == test_username:
                    self.log_test("User Registration", True, f"Created user: {test_username}")
                else:
                    self.log_test("User Registration", False, "Invalid registration response", data)
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")
    
    def test_public_scammers_list(self):
        """Test public scammers endpoint"""
        try:
            response = self.make_request("GET", "/scammers/public")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Public Scammers List", True, f"Retrieved {len(data)} scammer records")
                else:
                    self.log_test("Public Scammers List", False, "Response is not a list", data)
            else:
                self.log_test("Public Scammers List", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Public Scammers List", False, f"Exception: {str(e)}")
    
    def test_public_statistics(self):
        """Test public statistics endpoint"""
        try:
            response = self.make_request("GET", "/statistics")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_records", "active_threats", "verified"]
                if all(field in data for field in required_fields):
                    self.log_test("Public Statistics", True, f"Stats: {data['total_records']} total, {data['active_threats']} active")
                else:
                    self.log_test("Public Statistics", False, "Missing required fields", data)
            else:
                self.log_test("Public Statistics", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Public Statistics", False, f"Exception: {str(e)}")
    
    def test_protected_scammers_list(self):
        """Test protected scammers endpoint"""
        if not self.auth_token:
            self.log_test("Protected Scammers List", False, "No auth token available")
            return
        
        try:
            response = self.make_request("GET", "/scammers", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Protected Scammers List", True, f"Retrieved {len(data)} scammer records with auth")
                else:
                    self.log_test("Protected Scammers List", False, "Response is not a list", data)
            else:
                self.log_test("Protected Scammers List", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Protected Scammers List", False, f"Exception: {str(e)}")
    
    def test_create_scammer(self):
        """Test creating a new scammer"""
        if not self.auth_token:
            self.log_test("Create Scammer", False, "No auth token available")
            return
        
        # Generate a realistic Discord ID (18 digits)
        discord_id = "123456789012345678"
        scammer_data = {
            "discord_id": discord_id,
            "discord_name": "TestScammer#1234",
            "scam_method": "Фишинг",
            "description": "Тестовый мошенник для проверки API"
        }
        
        try:
            response = self.make_request("POST", "/scammers", scammer_data, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["discord_id"] == discord_id:
                    self.created_scammer_id = data["id"]
                    self.log_test("Create Scammer", True, f"Created scammer with ID: {self.created_scammer_id}")
                else:
                    self.log_test("Create Scammer", False, "Invalid creation response", data)
            else:
                self.log_test("Create Scammer", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Create Scammer", False, f"Exception: {str(e)}")
    
    def test_create_scammer_invalid_discord_id(self):
        """Test creating scammer with invalid Discord ID"""
        if not self.auth_token:
            self.log_test("Create Scammer (Invalid Discord ID)", False, "No auth token available")
            return
        
        scammer_data = {
            "discord_id": "invalid_id",  # Invalid format
            "discord_name": "InvalidTest#1234",
            "scam_method": "Фишинг",
            "description": "Тест с неверным Discord ID"
        }
        
        try:
            response = self.make_request("POST", "/scammers", scammer_data, auth_required=True)
            
            if response.status_code == 400:
                self.log_test("Create Scammer (Invalid Discord ID)", True, "Correctly rejected invalid Discord ID")
            else:
                self.log_test("Create Scammer (Invalid Discord ID)", False, f"Expected 400, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Create Scammer (Invalid Discord ID)", False, f"Exception: {str(e)}")
    
    def test_update_scammer(self):
        """Test updating an existing scammer"""
        if not self.auth_token or not self.created_scammer_id:
            self.log_test("Update Scammer", False, "No auth token or scammer ID available")
            return
        
        update_data = {
            "description": "Обновленное описание мошенника",
            "status": "inactive"
        }
        
        try:
            response = self.make_request("PUT", f"/scammers/{self.created_scammer_id}", update_data, auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if data["description"] == update_data["description"]:
                    self.log_test("Update Scammer", True, f"Successfully updated scammer {self.created_scammer_id}")
                else:
                    self.log_test("Update Scammer", False, "Update not reflected in response", data)
            else:
                self.log_test("Update Scammer", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Update Scammer", False, f"Exception: {str(e)}")
    
    def test_get_single_scammer(self):
        """Test getting a single scammer by ID"""
        if not self.auth_token or not self.created_scammer_id:
            self.log_test("Get Single Scammer", False, "No auth token or scammer ID available")
            return
        
        try:
            response = self.make_request("GET", f"/scammers/{self.created_scammer_id}", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if data["id"] == self.created_scammer_id:
                    self.log_test("Get Single Scammer", True, f"Retrieved scammer: {data['discord_name']}")
                else:
                    self.log_test("Get Single Scammer", False, "ID mismatch in response", data)
            else:
                self.log_test("Get Single Scammer", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Single Scammer", False, f"Exception: {str(e)}")
    
    def test_delete_scammer(self):
        """Test deleting a scammer"""
        if not self.auth_token or not self.created_scammer_id:
            self.log_test("Delete Scammer", False, "No auth token or scammer ID available")
            return
        
        try:
            response = self.make_request("DELETE", f"/scammers/{self.created_scammer_id}", auth_required=True)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Delete Scammer", True, f"Successfully deleted scammer {self.created_scammer_id}")
                else:
                    self.log_test("Delete Scammer", False, "Invalid deletion response", data)
            else:
                self.log_test("Delete Scammer", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Delete Scammer", False, f"Exception: {str(e)}")
    
    def test_duplicate_discord_id(self):
        """Test creating scammer with duplicate Discord ID"""
        if not self.auth_token:
            self.log_test("Duplicate Discord ID Prevention", False, "No auth token available")
            return
        
        # First create a scammer
        discord_id = "987654321098765432"
        scammer_data = {
            "discord_id": discord_id,
            "discord_name": "DuplicateTest#1234",
            "scam_method": "Вымогательство",
            "description": "Первый мошенник"
        }
        
        try:
            # Create first scammer
            response1 = self.make_request("POST", "/scammers", scammer_data, auth_required=True)
            
            if response1.status_code == 200:
                # Try to create duplicate
                scammer_data["discord_name"] = "DuplicateTest2#5678"
                scammer_data["description"] = "Попытка дублирования"
                
                response2 = self.make_request("POST", "/scammers", scammer_data, auth_required=True)
                
                if response2.status_code == 400:
                    self.log_test("Duplicate Discord ID Prevention", True, "Correctly prevented duplicate Discord ID")
                    
                    # Clean up - delete the created scammer
                    created_id = response1.json()["id"]
                    self.make_request("DELETE", f"/scammers/{created_id}", auth_required=True)
                else:
                    self.log_test("Duplicate Discord ID Prevention", False, f"Expected 400, got {response2.status_code}", response2.text)
            else:
                self.log_test("Duplicate Discord ID Prevention", False, f"Failed to create first scammer: {response1.status_code}", response1.text)
        except Exception as e:
            self.log_test("Duplicate Discord ID Prevention", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("SCAMMER DATABASE API - COMPREHENSIVE BACKEND TESTING")
        print("=" * 60)
        print(f"Testing against: {self.base_url}")
        print(f"Admin credentials: {ADMIN_USERNAME}/{ADMIN_PASSWORD}")
        print()
        
        # Authentication Tests
        print("🔐 AUTHENTICATION TESTS")
        print("-" * 30)
        self.test_auth_login_success()
        self.test_auth_login_failure()
        self.test_auth_me_with_token()
        self.test_auth_me_without_token()
        self.test_auth_register()
        
        # Public Endpoint Tests
        print("🌐 PUBLIC ENDPOINT TESTS")
        print("-" * 30)
        self.test_public_scammers_list()
        self.test_public_statistics()
        
        # Protected Endpoint Tests
        print("🔒 PROTECTED ENDPOINT TESTS")
        print("-" * 30)
        self.test_protected_scammers_list()
        self.test_create_scammer()
        self.test_create_scammer_invalid_discord_id()
        self.test_update_scammer()
        self.test_get_single_scammer()
        self.test_delete_scammer()
        
        # Data Validation Tests
        print("✅ DATA VALIDATION TESTS")
        print("-" * 30)
        self.test_duplicate_discord_id()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        failed = total - passed
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        print()
        
        if failed > 0:
            print("FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"❌ {result['test']}: {result['details']}")
            print()
        
        print("Testing completed at:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)