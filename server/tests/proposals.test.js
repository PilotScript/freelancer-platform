import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import Job from '../models/Job';
import User from '../models/User';
import Proposal from '../models/Proposal';
import { generateToken } from '../utils/generateToken';

// Mock data
const testClient = {
  name: 'Test Client',
  email: 'client_proposals@example.com',
  password: 'password123',
  role: 'client'
};

const testFreelancer = {
  name: 'Test Freelancer',
  email: 'freelancer_proposals@example.com',
  password: 'password123',
  role: 'freelancer'
};

const testJob = {
  title: 'Test Job for Proposals',
  description: 'This is a test job description that is long enough to pass validation.',
  budget: 1000,
  paymentType: 'fixed',
  duration: 'medium',
  location: 'Remote',
  category: 'Programming',
  skills: ['JavaScript', 'React', 'Node.js']
};

const testProposal = {
  coverLetter: 'This is a detailed cover letter explaining why I am the best candidate for this job. I have extensive experience with the required technologies and can deliver high-quality work within the specified timeframe.',
  proposedAmount: 950,
  estimatedDuration: '2_to_4_weeks'
};

let clientToken;
let clientId;
let freelancerToken;
let freelancerId;
let jobId;
let proposalId;

describe('Proposals API Endpoints', () => {
  // Connect to test database before tests
  beforeAll(async () => {
    // Use a test database
    const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/freelancer-platform-test';
    await mongoose.connect(MONGO_URI);
    
    // Clear collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await Proposal.deleteMany({});
    
    // Create test client
    const client = await User.create(testClient);
    clientId = client._id;
    clientToken = generateToken(clientId);
    
    // Create test freelancer
    const freelancer = await User.create(testFreelancer);
    freelancerId = freelancer._id;
    freelancerToken = generateToken(freelancerId);
    
    // Create test job
    const job = await Job.create({
      ...testJob,
      client: clientId
    });
    jobId = job._id;
  });

  // Disconnect after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test create proposal
  describe('POST /api/jobs/:jobId/proposals', () => {
    it('should create a new proposal', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/proposals`)
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send(testProposal);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('coverLetter', testProposal.coverLetter);
      expect(res.body.data).toHaveProperty('proposedAmount', testProposal.proposedAmount);
      expect(res.body.data).toHaveProperty('freelancer', freelancerId.toString());
      expect(res.body.data).toHaveProperty('job', jobId.toString());
      
      // Save proposal ID for later tests
      proposalId = res.body.data._id;
    });

    it('should not create a proposal without authentication', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/proposals`)
        .send(testProposal);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not allow clients to create proposals', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/proposals`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(testProposal);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not create a proposal with invalid data', async () => {
      const invalidProposal = {
        coverLetter: 'Too short',
        proposedAmount: 'not a number'
      };
      
      const res = await request(app)
        .post(`/api/jobs/${jobId}/proposals`)
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send(invalidProposal);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not allow multiple proposals from the same freelancer', async () => {
      const res = await request(app)
        .post(`/api/jobs/${jobId}/proposals`)
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send(testProposal);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test get proposals for a job
  describe('GET /api/jobs/:jobId/proposals', () => {
    it('should allow job owner to get all proposals', async () => {
      const res = await request(app)
        .get(`/api/jobs/${jobId}/proposals`)
        .set('Authorization', `Bearer ${clientToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 1);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0]).toHaveProperty('coverLetter', testProposal.coverLetter);
      expect(res.body.data[0]).toHaveProperty('freelancer');
      expect(res.body.data[0].freelancer).toHaveProperty('name', testFreelancer.name);
    });

    it('should not allow other users to get proposals', async () => {
      // Create another freelancer
      const anotherFreelancer = await User.create({
        name: 'Another Freelancer',
        email: 'another_freelancer@example.com',
        password: 'password123',
        role: 'freelancer'
      });
      
      const anotherToken = generateToken(anotherFreelancer._id);
      
      const res = await request(app)
        .get(`/api/jobs/${jobId}/proposals`)
        .set('Authorization', `Bearer ${anotherToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should allow a freelancer to see their own proposal', async () => {
      const res = await request(app)
        .get(`/api/jobs/${jobId}/proposals/me`)
        .set('Authorization', `Bearer ${freelancerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('coverLetter', testProposal.coverLetter);
      expect(res.body.data).toHaveProperty('proposedAmount', testProposal.proposedAmount);
    });
  });

  // Test get single proposal
  describe('GET /api/proposals/:id', () => {
    it('should get a proposal by ID for the job owner', async () => {
      const res = await request(app)
        .get(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${clientToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('coverLetter', testProposal.coverLetter);
      expect(res.body.data).toHaveProperty('freelancer');
      expect(res.body.data.freelancer).toHaveProperty('name', testFreelancer.name);
    });

    it('should get a proposal by ID for the proposal owner', async () => {
      const res = await request(app)
        .get(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${freelancerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('coverLetter', testProposal.coverLetter);
    });

    it('should not allow unauthorized users to view a proposal', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another_user@example.com',
        password: 'password123',
        role: 'freelancer'
      });
      
      const anotherToken = generateToken(anotherUser._id);
      
      const res = await request(app)
        .get(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${anotherToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test update proposal
  describe('PUT /api/proposals/:id', () => {
    it('should update a proposal', async () => {
      const updatedProposal = {
        coverLetter: 'This is an updated cover letter with more details about my experience and approach to the project.',
        proposedAmount: 980
      };
      
      const res = await request(app)
        .put(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send(updatedProposal);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('coverLetter', updatedProposal.coverLetter);
      expect(res.body.data).toHaveProperty('proposedAmount', updatedProposal.proposedAmount);
      expect(res.body.data).toHaveProperty('estimatedDuration', testProposal.estimatedDuration);
    });

    it('should not allow other users to update a proposal', async () => {
      const res = await request(app)
        .put(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ proposedAmount: 800 });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test change proposal status
  describe('PUT /api/proposals/:id/status', () => {
    it('should allow job owner to change proposal status', async () => {
      const statusUpdate = {
        status: 'accepted'
      };
      
      const res = await request(app)
        .put(`/api/proposals/${proposalId}/status`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(statusUpdate);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'accepted');
    });

    it('should not allow freelancers to change proposal status', async () => {
      const statusUpdate = {
        status: 'rejected'
      };
      
      const res = await request(app)
        .put(`/api/proposals/${proposalId}/status`)
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send(statusUpdate);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test delete proposal
  describe('DELETE /api/proposals/:id', () => {
    it('should not allow job owner to delete a proposal', async () => {
      const res = await request(app)
        .delete(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${clientToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should allow freelancer to delete their own proposal', async () => {
      const res = await request(app)
        .delete(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${freelancerToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data', {});
      
      // Verify proposal is deleted
      const checkRes = await request(app)
        .get(`/api/proposals/${proposalId}`)
        .set('Authorization', `Bearer ${clientToken}`);
      
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});
