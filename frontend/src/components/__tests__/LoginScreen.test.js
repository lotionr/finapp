/**
 * Unit tests for LoginScreen component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  const mockOnLogin = jest.fn();
  const mockOnCreateNew = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates email field when user types', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password field when user types', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'mypassword123' } });

    expect(passwordInput.value).toBe('mypassword123');
  });

  it('calls onLogin with email and password when form is submitted', async () => {
    mockOnLogin.mockResolvedValue();

    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'mypassword123');
    });
  });

  it('trims email and password before calling onLogin', async () => {
    mockOnLogin.mockResolvedValue();

    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: '  test@example.com  ' } });
    fireEvent.change(passwordInput, { target: { value: '  mypassword123  ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'mypassword123');
    });
  });

  it('displays error message from onLogin when login fails', async () => {
    const errorMessage = 'Invalid email or password';
    mockOnLogin.mockRejectedValue({
      response: { data: { detail: errorMessage } }
    });

    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables submit button when loading', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when email or password is empty', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when both email and password are filled', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('calls onCreateNew when create new profile button is clicked', () => {
    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const createButton = screen.getByRole('button', { name: /create new profile/i });
    fireEvent.click(createButton);

    expect(mockOnCreateNew).toHaveBeenCalledTimes(1);
  });

  it('clears error message when form is resubmitted', async () => {
    mockOnLogin
      .mockRejectedValueOnce({
        response: { data: { detail: 'Invalid credentials' } }
      })
      .mockResolvedValueOnce();

    render(
      <LoginScreen
        onLogin={mockOnLogin}
        onCreateNew={mockOnCreateNew}
        loading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // First submission - fails
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Second submission - succeeds
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });
});

