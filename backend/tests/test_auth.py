"""
Unit tests for password authentication utilities
"""
import pytest
from auth import hash_password, verify_password


class TestHashPassword:
    """Tests for hash_password function"""
    
    def test_hash_password_returns_string(self):
        """Test that hash_password returns a string"""
        password = "testpassword123"
        hashed = hash_password(password)
        assert isinstance(hashed, str)
        assert len(hashed) > 0
    
    def test_hash_password_different_salts(self):
        """Test that same password produces different hashes (due to salt)"""
        password = "testpassword123"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        # Hashes should be different due to random salt
        assert hash1 != hash2
    
    def test_hash_password_empty_string(self):
        """Test hashing empty string"""
        hashed = hash_password("")
        assert isinstance(hashed, str)
        assert len(hashed) > 0
    
    def test_hash_password_special_characters(self):
        """Test hashing password with special characters"""
        password = "P@ssw0rd!#$%^&*()"
        hashed = hash_password(password)
        assert isinstance(hashed, str)
        assert len(hashed) > 0
    
    def test_hash_password_unicode(self):
        """Test hashing password with unicode characters"""
        password = "密码123"
        hashed = hash_password(password)
        assert isinstance(hashed, str)
        assert len(hashed) > 0


class TestVerifyPassword:
    """Tests for verify_password function"""
    
    def test_verify_password_correct(self):
        """Test that correct password verifies successfully"""
        password = "testpassword123"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self):
        """Test that incorrect password fails verification"""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = hash_password(password)
        assert verify_password(wrong_password, hashed) is False
    
    def test_verify_password_case_sensitive(self):
        """Test that password verification is case sensitive"""
        password = "TestPassword123"
        hashed = hash_password(password)
        assert verify_password("testpassword123", hashed) is False
        assert verify_password("TestPassword123", hashed) is True
    
    def test_verify_password_empty_string(self):
        """Test verifying empty password"""
        password = ""
        hashed = hash_password(password)
        assert verify_password("", hashed) is True
        assert verify_password("notempty", hashed) is False
    
    def test_verify_password_special_characters(self):
        """Test verifying password with special characters"""
        password = "P@ssw0rd!#$%^&*()"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True
        assert verify_password("P@ssw0rd", hashed) is False
    
    def test_verify_password_invalid_hash(self):
        """Test that invalid hash format returns False"""
        password = "testpassword123"
        invalid_hash = "notavalidhash"
        assert verify_password(password, invalid_hash) is False
    
    def test_verify_password_none_hash(self):
        """Test that None hash returns False"""
        password = "testpassword123"
        assert verify_password(password, None) is False
    
    def test_verify_password_round_trip(self):
        """Test complete round trip: hash then verify"""
        test_passwords = [
            "simple",
            "Complex123!@#",
            "verylongpasswordthatshouldworkfine123456789",
            "  password with spaces  ",
            "123456",
        ]
        
        for password in test_passwords:
            hashed = hash_password(password)
            assert verify_password(password, hashed) is True
            assert verify_password(password + "x", hashed) is False

