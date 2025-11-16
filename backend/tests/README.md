# Backend Tests

## Running Tests

### Run all tests:
```bash
cd backend
source venv/bin/activate
pytest
```

### Run specific test file:
```bash
pytest tests/test_auth.py
pytest tests/test_main.py
```

### Run with verbose output:
```bash
pytest -v
```

### Run with coverage:
```bash
pytest --cov=. --cov-report=html
```

## Test Structure

- `test_auth.py` - Tests for password hashing and verification utilities
- `test_main.py` - Tests for API endpoints (login, user creation)
- `conftest.py` - Shared fixtures and test configuration

## Test Coverage

### Password Authentication (`test_auth.py`)
- ✅ Password hashing with different salts
- ✅ Password verification (correct/incorrect)
- ✅ Edge cases (empty strings, special characters, unicode)
- ✅ Invalid hash handling

### API Endpoints (`test_main.py`)
- ✅ Login endpoint (success, invalid credentials, missing fields)
- ✅ User creation with password hashing
- ✅ Password security (not exposed in responses)
- ✅ Backward compatibility (users without passwords)

