const express = require('express');
const request = require('supertest');
const { Pool } = require('pg');
const router = require('./userRoutes');
const bcrypt = require('bcrypt');

// Mocks
jest.mock('pg', () => {
  const { Client } = jest.requireActual('pg');
  return {
    Pool: jest.fn(() => ({
      query: jest.fn(),
      end: jest.fn()
    }))
  };
});

const mockRequestBody = {
  username: 'dnednedne',  // these credentials are not in the database
  full_name: 'dne dnes',
  password: 'apassword$12',
  email: 'dne@gmail.com',
  phoneNumber: '1234567890'
};

const mockBadRequestBody = {
  username: 'dnednedne',  // these credentials are not in the database
  full_name: 'dne dnes',
  password: 'apassword$12',
  email: 'dne@gmail.com',
  phoneNumber: null
};

const mockRequestLoginBody = {
  identifier: 'testuser@example.com',
  password: 'password123'
};

const mockError = new Error('Database error');

//(username, "fullName", password, email, "phoneNumber") VALUES ($1, $2, $3, $4, $5)',
// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/users', router); // Update the base URL for router

beforeEach(() => {
  jest.clearAllMocks();
});

test('successful login 201', async () => {
  // Mock request body


  // Mock database query response
  const mockDbQueryResponse = {
    rows: [{ username: 'testuser', password: 'hashedPassword' }] // Add hashed password to mock user data
  };

  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockDbQueryResponse),
    end: jest.fn()
  }));

  // Mock bcrypt.compare to always return true
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

  // Send request to login endpoint
  const response = await request(app)
    .post('/users/login')
    .send(mockRequestLoginBody)
    .expect(200);
});

test('should return 200 success if user data does not exist', async () => {
  // Mock database query response indicating no conflicts for the provided user data  
  const mockGetQueryResponse = {
    rows: ''
  };

  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockGetQueryResponse),
    end: jest.fn()
  }));

  const response = await request(app)
    .post('/users/check') // Ensure the correct endpoint is being called
    .expect(200); // Expecting 200 success
});

test('should return 409 conflict', async () => {
  // Mock database query response indicating no conflicts for the provided user data

  const mockGetQueryResponse = {
    rows: '1'
  };

  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockGetQueryResponse),
    end: jest.fn()
  }));

  const response = await request(app)
    .post('/users/check') // Ensure the correct endpoint is being called
    .expect(409); // Expecting 200 success
});

test('should return 500 server error', async () => {
  // Mock database query response indicating no conflicts for the provided user data

  const mockGetQueryResponse = {
    rows: '1'
  };

  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  const response = await request(app)
    .post('/users/check') // Ensure the correct endpoint is being called
    .expect(500); // Expecting 200 success
});


test('test for successful registration 201', async () => {
  const mockGetQueryResponse = {
    rows: ''
  };
  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockGetQueryResponse),
    end: jest.fn()
  }));
  
  const response = await request(app)
    .post('/users/register')
    .send(mockRequestBody)
    .expect(201); 
});

test('should return 500 server error', async () => {
  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));
  
  const response = await request(app)
    .post('/users/register')
    .send(mockRequestBody)
    .expect(500); 
});

test('should return 500 server error (missing phoneNumber)', async () => {
  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockError),
    end: jest.fn()
  }));
  
  const response = await request(app)
    .post('/users/register')
    .send(mockBadRequestBody)
    .expect(500); 
});

test('Internal Server Error', async () => {
  // Mock database query response
  const mockDbQueryResponse = {
    rows: [{ username: 'testuser', password: 'hashedPassword' }] // Add hashed password to mock user data
  };

  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockDbQueryResponse),
    end: jest.fn()
  }));

  // Mock bcrypt.compare to always return true
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

  // Send request to login endpoint
  const response = await request(app)
    .post('/users/login')
    .send(mockRequestLoginBody)
    .expect(500);
});

