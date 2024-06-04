const express = require('express');
const request = require('supertest');
const { Pool } = require('pg');
const router = require('./userRoutes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

jest.mock('jsonwebtoken');
const express = require("express");
const request = require("supertest");
const { Pool } = require("pg");
const router = require("./userRoutes");
const bcrypt = require("bcryptjs");

// Mocks
jest.mock("pg", () => {
	const { Client } = jest.requireActual("pg");
	return {
		Pool: jest.fn(() => ({
			query: jest.fn(),
			end: jest.fn()
		}))
	};
jest.mock("pg", () => {
	const { Client } = jest.requireActual("pg");
	return {
		Pool: jest.fn(() => ({
			query: jest.fn(),
			end: jest.fn()
		}))
	};
});

const oauth2Client = new google.auth.OAuth2(
  process.env.REACT_APP_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REACT_APP_BACKEND_LINK + '/users/auth/google/callback'
);

// Create a mock Express app
const app = express();
app.use(express.json());
app.use("/", router); // Update the base URL for router
app.use("/", router); // Update the base URL for router

const mockRequestBody = {
  username: 'dnednedne',
  full_name: 'dne dnes',
  password: 'apassword$12',
  email: 'dne@gmail.com',
  phoneNumber: '1234567890'
	username: "dnednedne",  // these credentials are not in the database
	full_name: "dne dnes",
	password: "apassword$12",
	email: "dne@gmail.com",
	phoneNumber: "1234567890"
};

const mockBadRequestBody = {
  username: 'dnednedne',
  full_name: 'dne dnes',
  password: 'apassword$12',
  email: 'dne@gmail.com',
  phoneNumber: 'null'
	username: "dnednedne",  // these credentials are not in the database
	full_name: "dne dnes",
	password: "apassword$12",
	email: "dne@gmail.com",
	phoneNumber: "null"
};

const LoginBody = {
	identifier: "testuser@example.com",
	password: "password123"
};

const mockError = new Error("Database error");

describe('Login Endpoint Tests', () => {
  const LoginBody = {
    identifier: 'testuser@example.com',
    password: 'password123'
  };

  test('should return 200 for successful login', async () => {
    const mockDbQueryResponse = {
      rows: [{ username: 'testuser', password: 'hashedPassword' }]
    };

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockDbQueryResponse),
      end: jest.fn()
    }));

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('mockToken');

    const response = await request(app)
      .post('/login')
      .send(LoginBody)
      .expect(200);

    expect(response.body).toEqual({
      message: 'User logged in successfully',
      token: 'mockToken'
    });
  });

  test('should return 400 for invalid identifier or password type', async () => {
    const invalidBody = {
      identifier: 12345,
      password: 'password123'
    };

    const response = await request(app)
      .post('/login')
      .send(invalidBody)
      .expect(400);

    expect(response.body).toEqual({
      error: 'Identifier and password are required and must be strings.'
    });
  });

  test('should return 500 for database error', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(new Error('Database error')),
      end: jest.fn()
    }));

    const response = await request(app)
      .post('/login')
      .send(LoginBody)
      .expect(500);

    expect(response.body).toEqual({
      error: 'Failed to log in'
    });
  });

  test('should return 404 for user not found', async () => {
    const mockDbQueryResponse = {
      rows: []
    };

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockDbQueryResponse),
      end: jest.fn()
    }));

    const response = await request(app)
      .post('/login')
      .send(LoginBody)
      .expect(404);

    expect(response.body).toEqual({
      error: 'User not found'
    });
  });

  test('should return 401 for invalid password', async () => {
    const mockDbQueryResponse = {
      rows: [{ username: 'testuser', password: 'hashedPassword' }]
    };

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockDbQueryResponse),
      end: jest.fn()
    }));

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send(LoginBody)
      .expect(401);

    expect(response.body).toEqual({
      error: 'Invalid password'
    });
  });
});

describe('Registration Endpoint Tests', () => {
  test('should return 500 server error on database error', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(mockError),
      end: jest.fn()
    }));

    const response = await request(app)
      .post('/register')
      .send(mockRequestBody)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });

  test('should return 500 server error on missing phoneNumber', async () => {
    const response = await request(app)
      .post('/register')
      .send(mockBadRequestBody)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });

  test('should return 500 server error on missing username', async () => {
    const requestBody = {
      ...mockRequestBody,
      username: null
    };

    const response = await request(app)
      .post('/register')
      .send(requestBody)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });

  test('should return 500 server error on missing full_name', async () => {
    const requestBody = {
      ...mockRequestBody,
      full_name: null
    };

    const response = await request(app)
      .post('/register')
      .send(requestBody)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });

  test('should return 500 server error on missing password', async () => {
    const requestBody = {
      ...mockRequestBody,
      password: null
    };

    const response = await request(app)
      .post('/register')
      .send(requestBody)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });

  test('should return 500 server error on missing email', async () => {
    const requestBody = {
      ...mockRequestBody,
      email: null
    };

    const response = await request(app)
      .post('/register')
      .send(requestBody)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });

  test('should return 201 on successful registration', async () => {
    const mockGetQueryResponse = {};

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockGetQueryResponse),
      end: jest.fn()
    }));
  // Send request to login endpoint
  const response = await request(app)
    .post('/login')
    .send(LoginBody)
    .expect(200);
    console.log("Testing response:", response);
}); */

test("should return 500 server error", async () => {
	// Mock database query
	Pool.mockImplementationOnce(() => ({
		query: jest.fn().mockRejectedValue(mockError),
		end: jest.fn()
	}));
  
	const response = await request(app)
		.post("/register")
		.send(mockRequestBody)
		.expect(500); 
});

test("Testin successful signup", async () => {
	//if no conflicts found in database, it should succeed and return 200 success

	// Mock database query response indicating no conflicts for the provided user data  
	const mockGetQueryResponse = {
		rows: ""
	};

	// Mock database query
	Pool.mockImplementationOnce(() => ({
		query: jest.fn().mockResolvedValue(mockGetQueryResponse),
		end: jest.fn()
	}));

    const response = await request(app)
      .post('/register')
      .send(mockRequestBody)
      .expect(201);

    expect(response.body).toEqual({ message: 'User registered successfully' });
  });
});

describe('Check Endpoint Tests', () => {
  test('Test successful check with no conflicts', async () => {
    const mockGetQueryResponse = { rows: [] };
	const response = await request(app)
		.post("/check") // Ensure the correct endpoint is being called
		.expect(200); // Expecting 200 success
});

test("should return 409 conflict", async () => {
	// Mock database query response indicating no conflicts for the provided user data
	const mockGetQueryResponse = {
		rows: "bruh"
	};

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockGetQueryResponse),
      end: jest.fn()
    }));

    const reqBody = {
      username: 'ausername',
      email: 'anemail@example.com',
      phoneNumber: '1234567890'
    };

    const response = await request(app)
      .post('/check')
      .send(reqBody)
      .expect(200);

    expect(response.body).toEqual({
      exists: false,
      message: 'No conflicts with username, email, or phone number.'
    });
  });

  test('Test check with username conflict', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [{ exists: true }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] }),
      end: jest.fn()
    }));

    const reqBody = {
      username: 'conflictusername',
      email: 'anemail@example.com',
      phoneNumber: '1234567890'
    };

    const response = await request(app)
      .post('/check')
      .send(reqBody)
      .expect(409);

    expect(response.body).toEqual({
      exists: true,
      message: 'Username already exists.',
      conflict: 'Username'
    });
  });

  test('Test check with phone number conflict', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ exists: true }] })
        .mockResolvedValueOnce({ rows: [] }),
      end: jest.fn()
    }));

    const reqBody = {
      username: 'ausername',
      email: 'anemail@example.com',
      phoneNumber: 'conflictphone'
    };

    const response = await request(app)
      .post('/check')
      .send(reqBody)
      .expect(409);

    expect(response.body).toEqual({
      exists: true,
      message: 'Phone Number already exists.',
      conflict: 'Phone Number'
    });
  });

  test('Test check with email conflict', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ exists: true }] }),
      end: jest.fn()
    }));

    const reqBody = {
      username: 'ausername',
      email: 'conflictemail@example.com',
      phoneNumber: '1234567890'
    };
	// Mock database query
	Pool.mockImplementationOnce(() => ({
		query: jest.fn().mockResolvedValue(mockGetQueryResponse),
		end: jest.fn()
	}));

    const response = await request(app)
      .post('/check')
      .send(reqBody)
      .expect(409);

    expect(response.body).toEqual({
      exists: true,
      message: 'Email already exists.',
      conflict: 'Email'
    });
  });

  test('should return 500 server error on database error', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(mockError),
      end: jest.fn()
    }));

    const reqBody = {
      username: 'ausername',
      email: 'anemail@example.com',
      phoneNumber: '1234567890'
    };

    const response = await request(app)
      .post('/check')
      .send(reqBody)
      .expect(500);

    expect(response.body).toEqual({
      error: 'Failed to check user details'
    });
  });

  test('Test null param check', async () => {
    const reqBody = {
      username: 'ausername',
      email: 'anemail@example.com',
      phoneNumber: null
    };
	const response = await request(app)
		.post("/check") // Ensure the correct endpoint is being called
		.expect(409); // Expecting 200 success
});

test("should return 500 server error", async () => {
	// Mock database query
	Pool.mockImplementationOnce(() => ({
		query: jest.fn().mockRejectedValue(mockError),
		end: jest.fn()
	}));

    const response = await request(app)
      .post('/check')
      .send(reqBody)
      .expect(500);

    expect(response.body).toEqual({
      error: 'Failed to check user details'
    });
  });
});

describe('Google OAuth Endpoint Tests', () => {
  test('should redirect to Google Auth URL', async () => {
    const mockAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&redirect_uri=undefined%2Fusers%2Fauth%2Fgoogle%2Fcallback&response_type=code&client_id=';
    jest.spyOn(oauth2Client, 'generateAuthUrl').mockReturnValue(mockAuthUrl);

    const response = await request(app)
      .get('/auth/google')

    expect(response.header.location).toBe(mockAuthUrl);
  });

  test('should handle Google OAuth callback and login existing user', async () => {
    const mockTokens = { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' };
    const mockUserInfo = {
      data: {
        email: 'testuser@example.com',
        name: 'Test User'
      }
    };
    const mockExistingUsers = [{ username: 'testuser', email: 'testuser@example.com' }];

    jest.spyOn(oauth2Client, 'getToken').mockResolvedValue({ tokens: mockTokens });
    oauth2Client.setCredentials = jest.fn();
    jest.spyOn(google.oauth2('v2').userinfo, 'get').mockResolvedValue(mockUserInfo);

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: mockExistingUsers }),
      end: jest.fn()
    }));

    jest.spyOn(jwt, 'sign').mockReturnValue('mockJwtToken');

    const response = await request(app)
      .get('/auth/google/callback')
      .query({ code: 'mockAuthCode' })

  });

  test('should handle Google OAuth callback and redirect new user to additional details', async () => {
    const mockTokens = { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' };
    const mockUserInfo = {
      data: {
        email: 'newuser@example.com',
        name: 'New User'
      }
    };
    const mockExistingUsers = [];

    jest.spyOn(oauth2Client, 'getToken').mockResolvedValue({ tokens: mockTokens });
    oauth2Client.setCredentials = jest.fn();
    jest.spyOn(google.oauth2('v2').userinfo, 'get').mockResolvedValue(mockUserInfo);

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: mockExistingUsers }),
      end: jest.fn()
    }));

    const response = await request(app)
      .get('/auth/google/callback')
      .query({ code: 'mockAuthCode' })
  });

  test('should return 500 if OAuth callback fails', async () => {
    jest.spyOn(oauth2Client, 'getToken').mockRejectedValue(new Error('OAuth error'));

    const response = await request(app)
      .get('/auth/google/callback')
      .query({ code: 'mockAuthCode' })
      .expect(500);

    expect(response.body).toEqual({
      error: 'Authentication failed',
      details: expect.any(Object)
    });
  });

  test('should return 500 if fetching user info fails', async () => {
    const mockTokens = { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' };

    jest.spyOn(oauth2Client, 'getToken').mockResolvedValue({ tokens: mockTokens });
    oauth2Client.setCredentials = jest.fn();
    jest.spyOn(google.oauth2('v2').userinfo, 'get').mockRejectedValue(new Error('User info error'));

    const response = await request(app)
      .get('/auth/google/callback')
      .query({ code: 'mockAuthCode' })
      .expect(500);

    expect(response.body).toEqual({
      error: 'Authentication failed',
      details: expect.any(Object)
    });
  });

  test('should return 500 if database query fails', async () => {
    const mockTokens = { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' };
    const mockUserInfo = {
      data: {
        email: 'testuser@example.com',
        name: 'Test User'
      }
    };

    jest.spyOn(oauth2Client, 'getToken').mockResolvedValue({ tokens: mockTokens });
    oauth2Client.setCredentials = jest.fn();
    jest.spyOn(google.oauth2('v2').userinfo, 'get').mockResolvedValue(mockUserInfo);

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(new Error('Database error')),
      end: jest.fn()
    }));
	const response = await request(app)
		.post("/check") // Ensure the correct endpoint is being called
		.expect(500); // Expecting 200 success
});

test("should return 500 server error", async () => {
	// Mock database query response indicating no conflicts for the provided user data

	// Mock database query
	Pool.mockImplementationOnce(() => ({
		query: jest.fn().mockRejectedValue(mockError),
		end: jest.fn()
	}));

    const response = await request(app)
      .get('/auth/google/callback')
      .query({ code: 'mockAuthCode' })
      .expect(500);

    expect(response.body).toEqual({
      error: 'Authentication failed',
      details: expect.any(Object)
    });
  });
});

describe('Register Google User Endpoint Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should register new Google user', async () => {
    const mockExistingUser = { rows: [] };
    const mockNewUser = { username: 'newuser', email: 'newuser@example.com' };
    console.log("hello: ", mockExistingUser.rows.length);
    Pool.mockImplementationOnce(() => ({
      query: jest.fn()
        .mockResolvedValueOnce(mockExistingUser) // No existing user
        .mockResolvedValueOnce({ rows: [mockNewUser] }), // New user registered
      end: jest.fn()
    }));

    const response = await request(app)
      .post('/register-google-user')
      .send({ email: 'newuser@example.com', name: 'New User', username: 'newuser', phoneNumber: '1234567890' })
      .expect(201);
  });

  test('should handle existing Google user', async () => {
    const mockExistingUser = { rows: [{ username: 'existinguser', email: 'existinguser@example.com', password: 'hashedPassword' }] };

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue(mockExistingUser), // Existing user
      end: jest.fn()
    }));

    const response = await request(app)
      .post('/register-google-user')
      .send({ email: 'existinguser@example.com', name: 'Existing User', username: 'existinguser', phoneNumber: '1234567890' })
      .expect(409);

    expect(response.body).toEqual({ error: 'User exists with a password. Please use Haggle credentials to log in.' });
  });

  test('should handle database error', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(new Error('Database error')),
      end: jest.fn()
    }));

    const response = await request(app)
      .post('/register-google-user')
      .send({ email: 'test@example.com', name: 'Test User', username: 'testuser', phoneNumber: '1234567890' })
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to register user' });
  });
});

describe('Profile Endpoint Tests', () => {
  const mockUser = {
    username: 'testuser',
    fullName: 'Test User',
    email: 'testuser@example.com',
    phoneNumber: '1234567890',
    userID: '123'
  };

  const validToken = 'validToken';
  const invalidToken = 'invalidToken';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch user profile successfully', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      if (token === validToken) {
        callback(null, { username: mockUser.username });
      } else {
        callback(new Error('Invalid token'));
      }
    });

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: [mockUser] }),
      end: jest.fn()
    }));

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body).toEqual(mockUser);
  });

  test('should return 401 for missing token', async () => {
    const response = await request(app)
      .get('/profile')
      .expect(403);

    expect(response.body).toEqual({ message: 'Token is required' });
  });

  test('should return 401 for invalid token', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);

    expect(response.body).toEqual({ message: 'Invalid Token' });
  });

  test('should handle database error', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      if (token === validToken) {
        callback(null, { username: mockUser.username });
      } else {
        callback(new Error('Invalid token'));
      }
    });

    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(new Error('Database error')),
      end: jest.fn()
    }));

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to fetch user profile' });
  });
});

describe('UserID Endpoint Tests', () => {
  const mockUser = { userID: '123' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch userID successfully', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: [mockUser] }),
      end: jest.fn()
    }));

    const response = await request(app)
      .get('/userID')
      .query({ username: 'testuser' })
      .expect(200);

    expect(response.body).toEqual({ userID: mockUser.userID });
  });

  test('should return 404 if user not found', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      end: jest.fn()
    }));

    const response = await request(app)
      .get('/userID')
      .query({ username: 'nonexistentuser' })
      .expect(404);

    expect(response.body).toEqual({ error: 'User not found' });
  });

  test('should return 400 if username is null', async () => {
    const response = await request(app)
      .get('/userID')
      .send({ username: null })
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to fetch userID' });
  });

  test('should handle database error', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(new Error('Database error')),
      end: jest.fn()
    }));

    const response = await request(app)
      .get('/userID')
      .query({ username: 'testuser' })
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to fetch userID' });
  });
});

describe('Delete Account Endpoint Tests', () => {
  const mockUserPassword = 'hashedPassword';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should delete account successfully', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [{ password: mockUserPassword }] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [{ password: mockUserPassword }] }) // Validate password
        .mockResolvedValueOnce({ rows: [] }), // Delete user
      end: jest.fn()
    }));

    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app)
      .delete('/delete')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200);

    expect(response.body).toEqual({ message: 'Account deleted successfully' });
  });

  test('should return 401 for invalid password', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [{ password: mockUserPassword }] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [{ password: mockUserPassword }] }), // Validate password
      end: jest.fn()
    }));

    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await request(app)
      .delete('/delete')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid password' });
  });

  test('should return 404 if user not found', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: [] }), // User not found
      end: jest.fn()
    }));

    const response = await request(app)
      .delete('/delete')
      .send({ username: 'nonexistentuser', password: 'password123' })
      .expect(404);

    expect(response.body).toEqual({ error: 'User not found' });
  });

  test('should return 500 for unexpected errors', async () => {
    Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockRejectedValue(new Error('Database error')),
      end: jest.fn()
    }));

    const response = await request(app)
      .delete('/delete')
      .send({ username: 'testuser', password: 'password123' })
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to delete account' });
  });

  test('should return 500 if username or password is missing', async () => {
    const response = await request(app)
      .delete('/delete')
      .send({ username: 'testuser' }) // Missing password
      .expect(500);

    expect(response.body).toEqual({ error: 'Failed to delete account' });
  });
});
	const response = await request(app)
		.post("/check") // Ensure the correct endpoint is being called
		.expect(500); // Expecting 200 success
});

test("should return 500 server error (missing phoneNumber)", async () => {
  
	const response = await request(app)
		.post("/register")
		.send(mockBadRequestBody)
		.expect(500); 
});


test("test for successful registration 201 no conflicts", async () => {
	const mockGetQueryResponse = {
	};
	// Mock database query
	Pool.mockImplementationOnce(() => ({
		query: jest.fn().mockResolvedValue(mockGetQueryResponse),
		end: jest.fn()
	}));
  
	const response = await request(app)
		.post("/register")
		.send(mockRequestBody)
		.expect(201); 
});









