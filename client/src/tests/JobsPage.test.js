import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobsPage from '../pages/JobsPage';

// Mock the axios module
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ 
    data: { 
      jobs: [
        {
          id: '1',
          title: 'React Developer for E-commerce Website',
          description: 'Looking for an experienced React developer to build a modern e-commerce website.',
          budget: 3000,
          paymentType: 'fixed',
          duration: 'medium',
          location: 'Remote',
          category: 'Programming',
          skills: ['React', 'JavaScript', 'CSS'],
          createdAt: '2025-03-25T10:30:00Z',
          client: {
            id: '101',
            name: 'TechSolutions Inc.',
            avatar: 'https://example.com/avatar.jpg'
          }
        },
        {
          id: '2',
          title: 'UI/UX Designer for Mobile App',
          description: 'We need a talented UI/UX designer to create beautiful interfaces.',
          budget: 50,
          paymentType: 'hourly',
          duration: 'short',
          location: 'Remote',
          category: 'Design',
          skills: ['UI Design', 'UX Design', 'Figma'],
          createdAt: '2025-03-26T14:15:00Z',
          client: {
            id: '102',
            name: 'FitTech Solutions',
            avatar: 'https://example.com/avatar2.jpg'
          }
        }
      ]
    } 
  }))
}));

describe('JobsPage Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders jobs page correctly', async () => {
    render(
      <BrowserRouter>
        <JobsPage />
      </BrowserRouter>
    );
    
    // Check if the page title is rendered
    expect(screen.getByText(/Find Jobs/i)).toBeInTheDocument();
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText(/Search jobs by title, description, or skills/i)).toBeInTheDocument();
    
    // Check if the filter button is rendered
    expect(screen.getByRole('button', { name: /Show Filters/i })).toBeInTheDocument();
    
    // Wait for the job cards to be rendered
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.getByText(/UI\/UX Designer for Mobile App/i)).toBeInTheDocument();
    });
  });

  test('filters jobs by search term', async () => {
    render(
      <BrowserRouter>
        <JobsPage />
      </BrowserRouter>
    );
    
    // Wait for the job cards to be rendered
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.getByText(/UI\/UX Designer for Mobile App/i)).toBeInTheDocument();
    });
    
    // Enter a search term
    fireEvent.change(screen.getByPlaceholderText(/Search jobs by title, description, or skills/i), {
      target: { value: 'React' }
    });
    
    // Check if only the React job is displayed
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.queryByText(/UI\/UX Designer for Mobile App/i)).not.toBeInTheDocument();
    });
  });

  test('shows and hides filters', async () => {
    render(
      <BrowserRouter>
        <JobsPage />
      </BrowserRouter>
    );
    
    // Initially, filters should be hidden
    expect(screen.queryByText(/Category/i)).not.toBeInTheDocument();
    
    // Click the Show Filters button
    fireEvent.click(screen.getByRole('button', { name: /Show Filters/i }));
    
    // Check if filters are displayed
    await waitFor(() => {
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
      expect(screen.getByText(/Payment Type/i)).toBeInTheDocument();
      expect(screen.getByText(/Duration/i)).toBeInTheDocument();
      expect(screen.getByText(/Budget Range/i)).toBeInTheDocument();
    });
    
    // Click the Hide Filters button
    fireEvent.click(screen.getByRole('button', { name: /Hide Filters/i }));
    
    // Check if filters are hidden again
    await waitFor(() => {
      expect(screen.queryByText(/Category/i)).not.toBeInTheDocument();
    });
  });

  test('applies category filter', async () => {
    render(
      <BrowserRouter>
        <JobsPage />
      </BrowserRouter>
    );
    
    // Wait for the job cards to be rendered
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.getByText(/UI\/UX Designer for Mobile App/i)).toBeInTheDocument();
    });
    
    // Click the Show Filters button
    fireEvent.click(screen.getByRole('button', { name: /Show Filters/i }));
    
    // Select the Design category
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText(/Design/i));
    
    // Click Apply Filters
    fireEvent.click(screen.getByRole('button', { name: /Apply Filters/i }));
    
    // Check if only the Design job is displayed
    await waitFor(() => {
      expect(screen.queryByText(/React Developer for E-commerce Website/i)).not.toBeInTheDocument();
      expect(screen.getByText(/UI\/UX Designer for Mobile App/i)).toBeInTheDocument();
    });
  });

  test('clears all filters', async () => {
    render(
      <BrowserRouter>
        <JobsPage />
      </BrowserRouter>
    );
    
    // Wait for the job cards to be rendered
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.getByText(/UI\/UX Designer for Mobile App/i)).toBeInTheDocument();
    });
    
    // Enter a search term
    fireEvent.change(screen.getByPlaceholderText(/Search jobs by title, description, or skills/i), {
      target: { value: 'React' }
    });
    
    // Check if only the React job is displayed
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.queryByText(/UI\/UX Designer for Mobile App/i)).not.toBeInTheDocument();
    });
    
    // Click the Show Filters button
    fireEvent.click(screen.getByRole('button', { name: /Show Filters/i }));
    
    // Click Clear Filters
    fireEvent.click(screen.getByRole('button', { name: /Clear Filters/i }));
    
    // Check if both jobs are displayed again
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
      expect(screen.getByText(/UI\/UX Designer for Mobile App/i)).toBeInTheDocument();
    });
  });
});
