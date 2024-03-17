// listingRoutes.test.js

// Import dependencies
const express = require('express');
const request = require('supertest');
const { Pool } = require('pg');
const { uploadImageToS3 } = require('../util/s3');
const router = require('./listingRoutes');
const fs = require('fs');
const path = require('path');


// Mocks
jest.mock('../util/s3');
jest.mock('pg', () => {
  const { Client } = jest.requireActual('pg');
  return {
    Pool: jest.fn(() => ({
      query: jest.fn(),
      end: jest.fn()
    }))
  };
});

// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/', router);

// Mock request body and files for POST request
const mockRequestBody = {
  userID: '1',
  title: 'Test Listing',
  price: '100',
  description: 'Test description',
  quantity: '1'
};

const mockGetQueryResponse = {rows:
    [{
    listingID: '825',
    userID: '1060',
    title: "jimmy's laptop",
    price: '2000',
    description: 'really cool gaming laptop 2021 G15',
    postDate: '2024-03-17:57:26.776',
    expirationDate: null,
    bookmarkCount: null,
    quantity: '1',
    location: null
    }]
};

const mockFiles = [
    {
      fieldname: 'image',
      originalname: 'image1.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: fs.readFileSync(path.join(__dirname, 'dummyImage1.jpg'))
    },
    {
      fieldname: 'image',
      originalname: 'image2.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: fs.readFileSync(path.join(__dirname, 'dummyImage2.jpg'))
    }
    // Add more mock files as needed
  ];

// Mock query response for POST requests
const mockQueryResponse = {
  rows: [{ listingID: 1 }]
};


// Mock error for failed queries
const mockError = new Error('Database error');


test('POST / should add a new listing', async () => {
    // Mock database query
    Pool.mockImplementationOnce(() => ({
        query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1 }] }),
        end: jest.fn()
    }));

    const response = await request(app)
    .post('/')
    .field('userID', mockRequestBody.userID)
    .field('title', mockRequestBody.title)
    .field('price', mockRequestBody.price)
    .field('description', mockRequestBody.description)
    .field('quantity', mockRequestBody.quantity)
    .attach('image', '') // Pass an empty file for the image field
    .expect(201);

    expect(response.body).toEqual(mockRequestBody);
    expect(Pool).toHaveBeenCalled();
    expect(uploadImageToS3).toHaveBeenCalledTimes(0); // Expect no image to be uploaded
});

test('POST / should add a new listing with images', async () => {
    // Mock database query
    Pool.mockImplementationOnce(() => ({
        query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1 }] }),
        end: jest.fn()
    }));

    const response = await request(app)
    .post('/')
    .field('userID', mockRequestBody.userID)
    .field('title', mockRequestBody.title)
    .field('price', mockRequestBody.price)
    .field('description', mockRequestBody.description)
    .field('quantity', mockRequestBody.quantity)
    .attach(mockFiles[0].fieldname, mockFiles[0].buffer, mockFiles[0].originalname)
    .attach(mockFiles[1].fieldname, mockFiles[1].buffer, mockFiles[1].originalname)
    
    .expect(201);

    expect(response.body).toEqual(mockRequestBody);
    expect(Pool).toHaveBeenCalled();
    expect(uploadImageToS3).toHaveBeenCalledTimes(2); // Expect 2 images to be uploaded
});



test('POST / should return 500 if an error occurs', async () => {
  // Mock database query to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  await request(app)
    .post('/')
    .send(mockRequestBody)
    .expect(500);
});

test('GET / should return listings', async () => {
  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockGetQueryResponse),
    end: jest.fn()
  }));

  const response = await request(app).get('/').expect(200);
  console.log(response.body);
  expect(response.body).toEqual(mockGetQueryResponse.rows);
  expect(Pool).toHaveBeenCalled();
});



test('GET / should return 500 if an error occurs', async () => {
  // Mock database query to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  await request(app).get('/').expect(500);
});

test('GET /:listingID should return a listing by its ID', async () => {
  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockQueryResponse),
    end: jest.fn()
  }));

  const response = await request(app).get('/1').expect(200);

  expect(response.body).toEqual(mockQueryResponse.rows);
  expect(Pool).toHaveBeenCalled();
});

test('GET /:listingID should return 500 if an error occurs', async () => {
  // Mock database query to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  await request(app).get('/1').expect(500);
});

test('GET /images/:listingID should return images for a listing by its ID', async () => {
  // Mock database query
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(mockQueryResponse),
    end: jest.fn()
  }));

  const response = await request(app).get('/images/1').expect(200);

  expect(response.body).toEqual(mockQueryResponse.rows);
  expect(Pool).toHaveBeenCalled();
});

test('GET /images/:listingID should return 500 if an error occurs', async () => {
  // Mock database query to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  await request(app).get('/images/1').expect(500);
});
