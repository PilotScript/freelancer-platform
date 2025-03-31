import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubmitProposalPage from '../pages/SubmitProposalPage';

// Mock the axios module
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ 
    data: { 
      job: {
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
      }
    } 
  })),
  post: jest.fn(() => Promise.resolve({ data: { success: true, proposalId: '123' } }))
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    jobId: '1'
  })
}));

describe('SubmitProposalPage Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders proposal form correctly', async () => {
    render(
      <BrowserRouter>
        <SubmitProposalPage />
      </BrowserRouter>
    );
    
    // Check if the page title is rendered
    expect(screen.getByText(/Submit a Proposal/i)).toBeInTheDocument();
    
    // Wait for the job details to be loaded
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
    });
    
    // Check if the form elements are rendered
    expect(screen.getByText(/Cover Letter/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write your cover letter here/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Proposed Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Attachments/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Files/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Proposal/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(
      <BrowserRouter>
        <SubmitProposalPage />
      </BrowserRouter>
    );
    
    // Wait for the job details to be loaded
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
    });
    
    // Try to submit the form without filling in the fields
    fireEvent.click(screen.getByRole('button', { name: /Submit Proposal/i }));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/Cover letter is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Proposed amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated duration is required/i)).toBeInTheDocument();
    });
    
    // Fill in the cover letter with insufficient text
    fireEvent.change(screen.getByPlaceholderText(/Write your cover letter here/i), {
      target: { value: 'Short cover letter' }
    });
    
    // Try to submit the form again
    fireEvent.click(screen.getByRole('button', { name: /Submit Proposal/i }));
    
    // Check if cover letter validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/Cover letter should be at least 100 characters/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid inputs', async () => {
    const axios = require('axios');
    
    render(
      <BrowserRouter>
        <SubmitProposalPage />
      </BrowserRouter>
    );
    
    // Wait for the job details to be loaded
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
    });
    
    // Fill in the form with valid inputs
    fireEvent.change(screen.getByPlaceholderText(/Write your cover letter here/i), {
      target: { value: 'This is a detailed cover letter that explains my experience with React development. I have worked on several e-commerce projects and I am confident I can deliver excellent results for your project. I have experience with all the required technologies and can start immediately.' }
    });
    
    fireEvent.change(screen.getByLabelText(/Proposed Amount/i), {
      target: { value: '2800' }
    });
    
    // Select estimated duration
    fireEvent.mouseDown(screen.getByLabelText(/Estimated Duration/i));
    fireEvent.click(screen.getByText(/1-2 weeks/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit Proposal/i }));
    
    // Check if the API was called with the correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        jobId: '1',
        coverLetter: expect.any(String),
        proposedAmount: '2800',
        estimatedDuration: '1_to_2_weeks'
      }));
    });
  });

  test('handles file uploads', async () => {
    render(
      <BrowserRouter>
        <SubmitProposalPage />
      </BrowserRouter>
    );
    
    // Wait for the job details to be loaded
    await waitFor(() => {
      expect(screen.getByText(/React Developer for E-commerce Website/i)).toBeInTheDocument();
    });
    
    // Create a mock file
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    
    // Get the file input and simulate a file upload
    const fileInput = screen.getByLabelText(/Upload Files/i);
    
    // Mock the FileList
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Check if the file is displayed in the list
    await waitFor(() => {
      expect(screen.getByText(/example.pdf/i)).toBeInTheDocument();
    });
    
    // Test removing the file
    fireEvent.click(screen.getByRole('button', { name: /Remove/i }));
    
    // Check if the file is removed
    await waitFor(() => {
      expect(screen.queryByText(/example.pdf/i)).not.toBeInTheDocument();
    });
  });
});
