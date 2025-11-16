# Frontend Tests

## Running Tests

### Run all tests:
```bash
cd frontend
npm test
```

### Run tests in watch mode:
```bash
npm test -- --watch
```

### Run tests with coverage:
```bash
npm test -- --coverage
```

## Test Structure

- `components/__tests__/LoginScreen.test.js` - Tests for login component with password field
- `components/__tests__/UserProfile.test.js` - Tests for user profile creation with password
- `services/__tests__/api.test.js` - Tests for API service login method

## Test Coverage

### LoginScreen Component
- ✅ Password field rendering and input handling
- ✅ Form submission with email and password
- ✅ Error handling and validation
- ✅ Loading states

### UserProfile Component
- ✅ Password field in registration form
- ✅ Password validation (minLength, required)
- ✅ Form submission with password included

### API Service
- ✅ Login method with email and password
- ✅ Error handling for failed logins
- ✅ User creation with password

