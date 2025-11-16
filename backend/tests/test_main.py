"""
Unit tests for main.py API endpoints related to authentication
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from main import app, get_db
from models import User
from auth import hash_password, verify_password


@pytest.fixture
def client(mock_db):
    """Create a test client with mocked database"""
    # Use starlette's TestClient directly
    from starlette.testclient import TestClient
    # Override the database dependency
    app.dependency_overrides[get_db] = lambda: mock_db
    yield TestClient(app)
    # Clean up after test
    app.dependency_overrides.clear()


@pytest.fixture
def mock_db():
    """Create a mock database"""
    db = Mock()
    return db


class TestLoginEndpoint:
    """Tests for /api/auth/login endpoint"""
    
    def test_login_success(self, client, mock_db, sample_user):
        """Test successful login with correct credentials"""
        # Setup mock
        mock_db.get_user_by_email.return_value = sample_user
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.json()}"
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
        assert "password_hash" not in data  # Password hash should not be in response
        assert "password" not in data  # Password should not be in response
    
    def test_login_invalid_email(self, client, mock_db):
        """Test login with non-existent email"""
        mock_db.get_user_by_email.return_value = None
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "anypassword"
            }
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_login_invalid_password(self, client, mock_db, sample_user):
        """Test login with incorrect password"""
        mock_db.get_user_by_email.return_value = sample_user
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_login_user_without_password(self, client, mock_db, user_without_password):
        """Test login attempt for user created before password auth"""
        mock_db.get_user_by_email.return_value = user_without_password
        
        response = client.post(
            "/api/auth/login",
            json={
                "email": "old@example.com",
                "password": "anypassword"
            }
        )
        
        assert response.status_code == 401
        assert "before password authentication" in response.json()["detail"]
    
    def test_login_missing_email(self, client):
        """Test login with missing email field"""
        response = client.post(
            "/api/auth/login",
            json={"password": "testpassword123"}
        )
        assert response.status_code == 422
    
    def test_login_missing_password(self, client):
        """Test login with missing password field"""
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com"}
        )
        assert response.status_code == 422
    
    def test_login_invalid_email_format(self, client):
        """Test login with invalid email format"""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "notanemail",
                "password": "testpassword123"
            }
        )
        assert response.status_code == 422


class TestCreateUserEndpoint:
    """Tests for /api/users endpoint (user creation with password)"""
    
    def test_create_user_success(self, client, mock_db, sample_user_data):
        """Test successful user creation with password"""
        # Mock: user doesn't exist yet
        mock_db.get_user_by_email.return_value = None
        
        # Mock: create_user returns the created user
        created_user = User.from_dict({**sample_user_data, "id": 1})
        mock_db.create_user.return_value = created_user
        
        response = client.post(
                "/api/users",
                json={
                    "name": "Test User",
                    "email": "test@example.com",
                    "password": "testpassword123",
                    "age": 30,
                    "current_income": 75000.0,
                    "current_savings": 50000.0,
                    "risk_profile": "moderate"
                }
            )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
        assert "password" not in data  # Password should not be in response
        assert "password_hash" not in data  # Password hash should not be in response
        
        # Verify that create_user was called with a hashed password
        mock_db.create_user.assert_called_once()
        call_args = mock_db.create_user.call_args[0][0]
        assert call_args.password_hash is not None
        assert call_args.password_hash != "testpassword123"  # Should be hashed
        # Verify the hash is correct
        assert verify_password("testpassword123", call_args.password_hash) is True
    
    def test_create_user_duplicate_email(self, client, mock_db, sample_user):
        """Test user creation with duplicate email"""
        mock_db.get_user_by_email.return_value = sample_user
        
        response = client.post(
                "/api/users",
                json={
                    "name": "Another User",
                    "email": "test@example.com",
                    "password": "newpassword123",
                    "age": 25,
                    "current_income": 60000.0,
                    "current_savings": 30000.0,
                    "risk_profile": "aggressive"
                }
            )
        
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
        mock_db.create_user.assert_not_called()
    
    def test_create_user_missing_password(self, client):
        """Test user creation without password"""
        response = client.post(
            "/api/users",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "age": 30,
                "current_income": 75000.0,
                "current_savings": 50000.0,
                "risk_profile": "moderate"
            }
        )
        assert response.status_code == 422
    
    def test_create_user_missing_fields(self, client):
        """Test user creation with missing required fields"""
        response = client.post(
            "/api/users",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        assert response.status_code == 422
    
    def test_create_user_password_is_hashed(self, client, mock_db):
        """Test that password is properly hashed before storage"""
        mock_db.get_user_by_email.return_value = None
        
        created_user_data = {
            "id": 1,
            "name": "Test User",
            "email": "test@example.com",
            "password_hash": hash_password("testpassword123"),
            "age": 30,
            "current_income": 75000.0,
            "current_savings": 50000.0,
            "risk_profile": "moderate"
        }
        created_user = User.from_dict(created_user_data)
        mock_db.create_user.return_value = created_user
        
        response = client.post(
                "/api/users",
                json={
                    "name": "Test User",
                    "email": "test@example.com",
                    "password": "testpassword123",
                    "age": 30,
                    "current_income": 75000.0,
                    "current_savings": 50000.0,
                    "risk_profile": "moderate"
                }
            )
        
        assert response.status_code == 200
        # Verify the password was hashed
        call_args = mock_db.create_user.call_args[0][0]
        assert call_args.password_hash != "testpassword123"
        assert verify_password("testpassword123", call_args.password_hash) is True


class TestPasswordSecurity:
    """Tests for password security features"""
    
    def test_password_not_in_response(self, client, mock_db, sample_user):
        """Test that password hash is never returned in API responses"""
        mock_db.get_user_by_email.return_value = sample_user
        
        # Test login response
        response = client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "testpassword123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "password" not in data
        assert "password_hash" not in data
    
    def test_different_passwords_different_hashes(self, client, mock_db):
        """Test that different passwords produce different hashes"""
        mock_db.get_user_by_email.return_value = None
        
        # Create first user
        user1_data = {
            "id": 1,
            "name": "User 1",
            "email": "user1@example.com",
            "password_hash": hash_password("password1"),
            "age": 30,
            "current_income": 75000.0,
            "current_savings": 50000.0,
            "risk_profile": "moderate"
        }
        user1 = User.from_dict(user1_data)
        mock_db.create_user.return_value = user1
        
        response1 = client.post(
                "/api/users",
                json={
                    "name": "User 1",
                    "email": "user1@example.com",
                    "password": "password1",
                    "age": 30,
                    "current_income": 75000.0,
                    "current_savings": 50000.0,
                    "risk_profile": "moderate"
                }
            )
        
        hash1 = mock_db.create_user.call_args[0][0].password_hash
        
        # Create second user with different password
        user2_data = {**user1_data, "id": 2, "email": "user2@example.com"}
        user2 = User.from_dict(user2_data)
        mock_db.create_user.return_value = user2
        
        response2 = client.post(
                "/api/users",
                json={
                    "name": "User 2",
                    "email": "user2@example.com",
                    "password": "password2",
                    "age": 30,
                    "current_income": 75000.0,
                    "current_savings": 50000.0,
                    "risk_profile": "moderate"
                }
            )
        
        hash2 = mock_db.create_user.call_args[0][0].password_hash
        
        # Hashes should be different
        assert hash1 != hash2

