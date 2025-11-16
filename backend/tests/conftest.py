"""
Pytest configuration and fixtures for testing
"""
import pytest
from unittest.mock import Mock, MagicMock
from database import DB
from models import User
from auth import hash_password


@pytest.fixture
def mock_db():
    """Create a mock database for testing"""
    db = Mock(spec=DB)
    return db


@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "password_hash": hash_password("testpassword123"),
        "age": 30,
        "current_income": 75000.0,
        "current_savings": 50000.0,
        "risk_profile": "moderate",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": None
    }


@pytest.fixture
def sample_user(sample_user_data):
    """Create a sample User object"""
    return User.from_dict(sample_user_data)


@pytest.fixture
def user_without_password():
    """Create a user without password hash (for backward compatibility testing)"""
    user_data = {
        "id": 2,
        "name": "Old User",
        "email": "old@example.com",
        "password_hash": None,
        "age": 35,
        "current_income": 80000.0,
        "current_savings": 60000.0,
        "risk_profile": "conservative",
        "created_at": "2023-01-01T00:00:00",
        "updated_at": None
    }
    return User.from_dict(user_data)

