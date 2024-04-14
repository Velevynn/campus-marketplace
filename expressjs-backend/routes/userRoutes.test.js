const express = require('express');
const request = require('supertest');
const { Pool } = require('pg');
const router = require('./userRoutes');

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
  phoneNum: '1234567890',
};

//(username, "fullName", password, email, "phoneNumber") VALUES ($1, $2, $3, $4, $5)',
// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/users', router); // Update the base URL for router

describe('POST /users/check', () => {
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
});


describe('POST /users/register', () => {
  test('test for successful registration 201', async () => {
    const mockGetQueryResponse = {
      rows: '1'
    };
    // Mock database query
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockGetQueryResponse),
      end: jest.fn()
    }));
    console.log(mockRequestBody);
    const response = await request(app)
    .post('/users/register')
    .send(mockRequestBody)
    .expect(201); 
  });
});


/*

*/
