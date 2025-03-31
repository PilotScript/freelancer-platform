import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

// Mock data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'freelancer'
};

let token;
let userId;

describe('Auth API Endpoints', () => {
  // Connect to test database before tests
  beforeAll(async () => {
    // Use a test database
    const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/freelancer-platform-test';
    await mongoose.connect(MONGO_URI);
    
    // Clear users collection
    await User.deleteMany({});
  });

  // Disconnect after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test user registration
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('name', testUser.name);
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body.data).toHaveProperty('role', testUser.role);
      
      // Save user ID for later tests
      userId = res.body.data._id;
    });

    it('should not register a user with an existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not register a user with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: '123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test user login
  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      
      // Save token for later tests
      token = res.body.token;
    });

    it('should not login a user with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not login a user with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test get current user
  describe('GET /api/auth/me', () => {
    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', testUser.name);
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body.data).toHaveProperty('role', testUser.role);
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test update user details
  describe('PUT /api/auth/updatedetails', () => {
    it('should update user details', async () => {
      const updatedDetails = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };
      
      const res = await request(app)
        .put('/api/auth/updatedetails')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedDetails);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', updatedDetails.name);
      expect(res.body.data).toHaveProperty('email', updatedDetails.email);
    });

    it('should not update user details without token', async () => {
      const res = await request(app)
        .put('/api/auth/updatedetails')
        .send({
          name: 'Another Name'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test update password
  describe('PUT /api/auth/updatepassword', () => {
    it('should update user password', async () => {
      const passwordData = {
        currentPassword: testUser.password,
        newPassword: 'newpassword123'
      };
      
      const res = await request(app)
        .put('/api/auth/updatepassword')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      
      // Update token for later tests
      token = res.body.token;
    });

    it('should not update password with incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'anothernewpassword'
      };
      
      const res = await request(app)
        .put('/api/auth/updatepassword')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test logout
  describe('GET /api/auth/logout', () => {
    it('should logout a user', async () => {
      const res = await request(app)
        .get('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
    });
  });
});
