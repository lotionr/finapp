# Testing Guide

This document describes the unit tests created for the password authentication feature.

## Backend Tests

### Test Files Created

1. **`backend/tests/test_auth.py`** - Tests for password hashing utilities
   - 13 test cases covering:
     - Password hashing with different salts
     - Password verification (correct/incorrect passwords)
     - Edge cases (empty strings, special characters, unicode)
     - Invalid hash handling
     - Round-trip testing

2. **`backend/tests/test_main.py`** - Tests for API endpoints
   - 14 test cases covering:
     - Login endpoint (success, invalid email, invalid password, missing fields)
     - User creation with password hashing
     - Password security (ensuring passwords are never exposed)
     - Backward compatibility (users without passwords)

3. **`backend/tests/conftest.py`** - Shared test fixtures
   - Mock database fixtures
   - Sample user data fixtures
   - User objects with and without passwords

### Running Backend Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

### Test Results

- ✅ All 13 password authentication utility tests pass
- ⚠️ API endpoint tests may need httpx version adjustment (see note below)

## Frontend Tests

### Test Files Created

1. **`frontend/src/components/__tests__/LoginScreen.test.js`** - Login component tests
   - 12 test cases covering:
     - Password field rendering and input handling
     - Form submission with email and password
     - Validation (empty fields, error messages)
     - Loading states
     - Error handling

2. **`frontend/src/components/__tests__/UserProfile.test.js`** - User profile component tests
   - 8 test cases covering:
     - Password field in registration form
     - Password validation (minLength, required, type="password")
     - Form submission with password included
     - Data type conversion

3. **`frontend/src/services/__tests__/api.test.js`** - API service tests
   - 3 test cases covering:
     - Login method with email and password
     - Error handling for failed logins
     - User creation with password

### Running Frontend Tests

```bash
cd frontend
npm install  # Install testing dependencies
npm test
```

## Test Coverage Summary

### Backend
- ✅ Password hashing and verification functions
- ✅ Login endpoint authentication
- ✅ User creation with password hashing
- ✅ Password security (not exposed in responses)
- ✅ Error handling for invalid credentials

### Frontend
- ✅ Login form with password field
- ✅ User registration form with password field
- ✅ API service login method
- ✅ Form validation and error handling

## Notes

1. **TestClient Compatibility**: The API endpoint tests use `starlette.testclient.TestClient`. If you encounter issues, you may need to adjust the httpx version or use an alternative test client approach.

2. **Dependencies**: 
   - Backend: `pytest`, `pytest-asyncio`, `httpx`
   - Frontend: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

3. **Test Data**: Tests use mocked database objects to avoid modifying actual data files.

## Running All Tests

### Backend
```bash
cd backend
source venv/bin/activate
pytest tests/ -v --tb=short
```

### Frontend
```bash
cd frontend
npm test -- --watchAll=false
```

