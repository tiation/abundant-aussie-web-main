import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../tests/utils/test-utils';
import Auth from '../Auth';
import { useSupabase } from '../../contexts/SupabaseContext';

// Mock the Supabase context
jest.mock('../../contexts/SupabaseContext');
const mockUseSupabase = useSupabase as jest.MockedFunction<typeof useSupabase>;

// Mock the Capacitor plugins
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: jest.fn(() => 'web'),
    isNativePlatform: jest.fn(() => false),
  },
}));

describe('Auth Component', () => {
  const mockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  };

  beforeEach(() => {
    mockUseSupabase.mockReturnValue(mockSupabaseClient as any);
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<Auth />);
    
    expect(screen.getByText('Sign In to RiggerConnect')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('switches to sign up form when clicked', () => {
    render(<Auth />);
    
    const signUpLink = screen.getByText(/don't have an account/i);
    fireEvent.click(signUpLink);
    
    expect(screen.getByText('Create Your RiggerConnect Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'test@example.com' },
        session: { access_token: 'token' },
      },
      error: null,
    });

    render(<Auth />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message on login failure', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    render(<Auth />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles sign up with validation', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'newuser@example.com' },
        session: null,
      },
      error: null,
    });

    render(<Auth />);
    
    // Switch to sign up form
    fireEvent.click(screen.getByText(/don't have an account/i));
    
    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
          },
        },
      });
    });
  });

  it('validates password confirmation', async () => {
    render(<Auth />);
    
    // Switch to sign up form
    fireEvent.click(screen.getByText(/don't have an account/i));
    
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('handles forgot password', async () => {
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });

    render(<Auth />);
    
    const forgotPasswordLink = screen.getByText(/forgot password/i);
    fireEvent.click(forgotPasswordLink);
    
    const emailInput = screen.getByLabelText(/email/i);
    const resetButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });
  });

  it('validates email format', async () => {
    render(<Auth />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during authentication', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockReturnValue(
      new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<Auth />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<Auth />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
  });
});
