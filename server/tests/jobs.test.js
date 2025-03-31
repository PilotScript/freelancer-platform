import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import Job from '../models/Job';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

// Mock data
const testClient = {
  name: 'Test Client',
  email: 'client@example.com',
  password: 'password123',
  role: 'client'
};

const testFreelancer = {
  name: 'Test Freelancer',
  email: 'freelancer@example.com',
  password: 'password123',
  role: 'freelancer'
};

const testJob = {
  title: 'Test Job',
  description: 'This is a test job description that is long enough to pass validation.',
  budget: 1000,
  paymentType: 'fixed',
  duration: 'medium',
  location: 'Remote',
  category: 'Programming',
  skills: ['JavaScript', 'React', 'Node.js']
};

let clientToken;
let clientId;
let freelancerToken;
let freelancerId;
let jobId;

describe('Jobs API Endpoints', () => {
  // Connect to test database before tests
  beforeAll(async () => {
    // Use a test database
    const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/freelancer-platform-test';
    await mongoose.connect(MONGO_URI);
    
    // Clear collections
    await User.deleteMany({});
    await Job.deleteMany({});
    
    // Create test client
    const client = await User.create(testClient);
    clientId = client._id;
    clientToken = generateToken(clientId);
    
    // Create test freelancer
    const freelancer = await User.create(testFreelancer);
    freelancerId = freelancer._id;
    freelancerToken = generateToken(freelancerId);
  });

  // Disconnect after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test create job
  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(testJob);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', testJob.title);
      expect(res.body.data).toHaveProperty('budget', testJob.budget);
      expect(res.body.data).toHaveProperty('client', clientId.toString());
      
      // Save job ID for later tests
      jobId = res.body.data._id;
    });

    it('should not create a job without authentication', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send(testJob);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not allow freelancers to create jobs', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${freelancerToken}`)
        .send(testJob);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not create a job with invalid data', async () => {
      const invalidJob = {
        title: 'Test',
        description: 'Too short',
        budget: 'not a number'
      };
      
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(invalidJob);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test get all jobs
  describe('GET /api/jobs', () => {
    it('should get all jobs', async () => {
      const res = await request(app)
        .get('/api/jobs');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 1);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0]).toHaveProperty('title', testJob.title);
    });

    it('should filter jobs by search term', async () => {
      const res = await request(app)
        .get('/api/jobs?search=Test Job');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 1);
      expect(res.body.data[0]).toHaveProperty('title', testJob.title);
      
      const noResultRes = await request(app)
        .get('/api/jobs?search=NonExistentJob');
      
      expect(noResultRes.statusCode).toEqual(200);
      expect(noResultRes.body).toHaveProperty('success', true);
      expect(noResultRes.body).toHaveProperty('count', 0);
      expect(noResultRes.body.data).toBeInstanceOf(Array);
      expect(noResultRes.body.data.length).toBe(0);
    });

    it('should filter jobs by category', async () => {
      const res = await request(app)
        .get('/api/jobs?category=Programming');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('count', 1);
      expect(res.body.data[0]).toHaveProperty('category', 'Programming');
      
      const noResultRes = await request(app)
        .get('/api/jobs?category=Design');
      
      expect(noResultRes.statusCode).toEqual(200);
      expect(noResultRes.body).toHaveProperty('success', true);
      expect(noResultRes.body).toHaveProperty('count', 0);
    });
  });

  // Test get single job
  describe('GET /api/jobs/:id', () => {
    it('should get a job by ID', async () => {
      const res = await request(app)
        .get(`/api/jobs/${jobId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', testJob.title);
      expect(res.body.data).toHaveProperty('description', testJob.description);
      expect(res.body.data).toHaveProperty('client');
      expect(res.body.data.client).toHaveProperty('name', testClient.name);
    });

    it('should return 404 for non-existent job ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/jobs/${fakeId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test update job
  describe('PUT /api/jobs/:id', () => {
    it('should update a job', async () => {
      const updatedJob = {
        title: 'Updated Job Title',
        budget: 1500
      };
      
      const res = await request(app)
        .put(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(updatedJob);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', updatedJob.title);
      expect(res.body.data).toHaveProperty('budget', updatedJob.budget);
      expect(res.body.data).toHaveProperty('description', testJob.description);
    });

    it('should not update a job without authentication', async () => {
      const res = await request(app)
        .put(`/api/jobs/${jobId}`)
        .send({ title: 'Another Title' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not allow a different client to update the job', async () => {
      // Create another client
      const anotherClient = await User.create({
        name: 'Another Client',
        email: 'another@example.com',
        password: 'password123',
        role: 'client'
      });
      
      const anotherToken = generateToken(anotherClient._id);
      
      const res = await request(app)
        .put(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Unauthorized Update' });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test delete job
  describe('DELETE /api/jobs/:id', () => {
    it('should not allow a different client to delete the job', async () => {
      // Use the previously created "another client"
      const anotherClient = await User.findOne({ email: 'another@example.com' });
      const anotherToken = generateToken(anotherClient._id);
      
      const res = await request(app)
        .delete(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${anotherToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should delete a job', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${jobId}`)
        .set('Authorization', `Bearer ${clientToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data', {});
      
      // Verify job is deleted
      const checkRes = await request(app)
        .get(`/api/jobs/${jobId}`);
      
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});
