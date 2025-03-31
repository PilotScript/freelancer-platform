import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Mock the axios module
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true, token: 'test-token' } }))
}));

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Check if the login form elements are rendered
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Try to submit the form without filling in the fields
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
    
    // Fill in the email field with an invalid email
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'invalid-email' }
    });
    
    // Try to submit the form again
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if email validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid inputs', async () => {
    const axios = require('axios');
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Fill in the form with valid inputs
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if the API was called with the correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Check if the token was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    });
  });

  test('handles login error', async () => {
    const axios = require('axios');
    
    // Mock axios to return an error
    axios.post.mockImplementationOnce(() => 
      Promise.reject({ response: { data: { error: 'Invalid credentials' } } })
    );
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
