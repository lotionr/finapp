/**
 * Unit tests for API service
 */
import { api } from '../api';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockAxios,
  };
});

const axios = require('axios');
const mockedAxios = axios.default;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  describe('login', () => {
    it('calls POST /api/auth/login with email and password', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          current_income: 75000,
          current_savings: 50000,
          risk_profile: 'moderate'
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await api.login('test@example.com', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/auth/login',
        {
          email: 'test@example.com',
          password: 'password123'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('handles login errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            detail: 'Invalid email or password'
          }
        }
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(api.login('test@example.com', 'wrongpassword')).rejects.toEqual(mockError);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/auth/login',
        {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      );
    });

    it('sends email and password in request body', async () => {
      const mockResponse = { data: { id: 1, email: 'test@example.com' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      await api.login('user@example.com', 'mypassword');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/auth/login',
        {
          email: 'user@example.com',
          password: 'mypassword'
        }
      );
    });
  });

  describe('createUser', () => {
    it('includes password in user creation request', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'securepassword123',
        age: 28,
        current_income: 70000,
        current_savings: 40000,
        risk_profile: 'aggressive'
      };

      const mockResponse = {
        data: {
          id: 1,
          ...userData,
          // Password should not be in response
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await api.createUser(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/users',
        userData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

