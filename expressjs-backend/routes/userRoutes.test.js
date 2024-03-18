const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

let server; // Declare server variable to store the reference to the Express server

beforeAll(() => {
  app.use(bodyParser.json());
  app.use('/api/users', userRoutes);
  server = app.listen(3000); // Start the Express server
});

afterAll((done) => {
  server.close(done); // Close the Express server after all tests are done
});

describe('POST /api/users/check', () => {
  test('should return 200 and no conflicts', async () => {
    const userData = {
      username: '(non-existent)',  // these credidentials are not in the database
      email: '(non-existent)',
      phoneNumber: '(non-existent)'
    };

    await request(app)
      .post('/api/users/check')
      .send(userData)
      .expect(200)
      .then((response) => {
        expect(response.body.exists).toBe(false);
        expect(response.body.message).toBe('No conflicts with username, email, or phone number.');
      });
  });

  test('should return 409 with conflict (username)', async () => {
    const userData = {
      username: 'testing', // existing username 
      email: '(non-existent)',
      phoneNumber: '00000000000'
    };

    await request(app)
      .post('/api/users/check')
      .send(userData)
      .expect(409)
      .then((response) => {
        expect(response.body.exists).toBe(true);
        expect(response.body.message).toBe('Username already exists.');
      });
  });

  test('should return 409 with conflict (email)', async () => {
    const userData = {
      username: '(non-existent)', 
      email: 'testuser@email.com', // existing email
      phoneNumber: '(non-existent)'
    };

    await request(app)
      .post('/api/users/check')
      .send(userData)
      .expect(409)
      .then((response) => {
        expect(response.body.exists).toBe(true);
        expect(response.body.message).toBe('Email already exists.');
      });    
  });

  test('should return 409 with conflict (username)', async () => {
    const userData = {
      username: '(non-existent)', 
      email: '(non-existent)', // existing email
      phoneNumber: '0000000000'
    };

    await request(app)
      .post('/api/users/check')
      .send(userData)
      .expect(409)
      .then((response) => {
        expect(response.body.exists).toBe(true);
        expect(response.body.message).toBe('Phone Number already exists.');
      });    
  });

  test('should return 500 for internal server error', async () => {
    // Mocking request body to trigger an error
    const userData = {
      username: null,  // Passing null username to trigger an error
      email: '(non-existent)',
      phoneNumber: '(non-existent)'
    };

    await request(app)
      .post('/api/users/check')
      .send(userData)
      .expect(500)
      .then((response) => {
        expect(response.body.error).toBe('Failed to check user details');
      });
    });
  // Write more tests for different scenarios, such as conflicts with username, email, or phone number
});

describe('POST /api/users/login', () => {
    test('should return 200 and a token on successful login', async () => {
      const userData = {
        username: 'testuser',
        password: 'Password1!Test'
      };
  
      await request(app)
        .post('/api/users/login')
        .send(userData)
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe('User logged in successfully');
          expect(response.body.token).toBeDefined();
        });
    });
  
    test('should return 401 for invalid password', async () => {
      const userData = {
        username: 'testing',
        password: 'invalidPassword'
      };
  
      await request(app)
        .post('/api/users/login')
        .send(userData)
        .expect(401)
        .then((response) => {
          expect(response.body.error).toBe('Invalid password');
        });
    });
  
    test('should return 404 for user not found', async () => {
      const userData = {
        username: '(nonexistent)',
        password: 'invalidPassword'
      };
  
      await request(app)
        .post('/api/users/login')
        .send(userData)
        .expect(404)
        .then((response) => {
          expect(response.body.error).toBe('User not found');
        });
    });
  
    test('should return 500 for internal server error', async () => {
        const userData = {
          username: null
        };
    
        await request(app)
          .post('/api/users/login')
          .send(userData)
          .expect(500)
          .then((response) => {
            expect(response.body.error).toBe('Failed to log in');
        });
    });
  });

  describe('GET /api/users/profile', () => {
  let authToken; // Declare authToken variable outside the test blocks to make it accessible across tests

  beforeAll(async () => {
    // Perform the login to obtain the token
    const userData = {
      username: 'testuser',
      password: 'Password1!Test'
    };

    await request(app)
      .post('/api/users/login')
      .send(userData)
      .expect(200)
      .then((response) => {
        authToken = response.body.token; // Store the token for later use
      });
  });

  test('should return user profile for authenticated user', async () => {
    // Ensure authToken is defined before proceeding
    expect(authToken).toBeDefined();

    await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.username).toBe('testuser');
        // Adjust the expectations based on your user's profile data
      });
  });
  // You can write more test cases to cover other scenarios such as unauthorized access, server errors, etc.
});

describe('GET /api/users/userID', () => {
    test('should return userID for existing user', async () => {
      // Assuming you have an existing user in your database
      const userData = {
        username: 'admin'
      };
  
      await request(app)
        .get('/api/users/userID')
        .query(userData)
        .expect(200)
        .then((response) => {
          expect(response.body.userID).toBe('1055');
          // Adjust expectations based on the structure of your response
        });
    });
  
    test('should return 404 for non-existing user', async () => {
      // Assuming the user does not exist in your database
      const userData = {
        username: 'nonexistentuser'
      };
  
      await request(app)
        .get('/api/users/userID')
        .query(userData)
        .expect(404)
        .then((response) => {
          expect(response.body.error).toBe('User not found');
        });
    });

    test('should return 500 for internal server error', async () => {
        const userData = {
          username: null
        };
    
        await request(app)
          .get('/api/users/userID')
          .send(userData)
          .expect(500)
          .then((response) => {
            expect(response.body.error).toBe('Failed to fetch userID');
        });
    });
});

describe('POST /api/users/register', () => {  
    test('should return 201 for successful entry', async () => {
        // Assuming the user already exists in the database
        const existingUser = {
          username: 'mynewuser00000000000000000011111111111111',
          full_name: 'random name',
          password: 'mypass',
          email: 'myemail',
          phoneNum: '1232141242121412'
        };
    
        const response = await request(app)
          .post('/api/users/register')
          .send(existingUser);
    
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
      });

    test('should return 500 for internal server error', async () => {
      // Assuming the user already exists in the database
      const existingUser = {
        username: null,
        full_name: null,
        password: null,
        email: null,
        phoneNum: null
      };
  
      const response = await request(app)
        .post('/api/users/register')
        .send(existingUser);
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to register user');
    });
});


describe('DELETE /api/users/delete-account', () => {
    test('should return 401 for wrong password', async () => {
        const userData = {
          username: 'mynewuser00000000000000000011111111111111',
          password: 'wrongpassword'
        };
    
        // Log in to get a token first
        const response = await request(app)
          .delete('/api/users/delete')
          .send(userData);
          expect(response.status).toBe(401);
      });

    test('should return 404 non-existent account', async () => {
    const userData = {
        username: 'does not exit username 11111',
        password: 'wrongpassword'
    };

    // Log in to get a token first
    const response = await request(app)
        .delete('/api/users/delete')
        .send(userData);
        expect(response.status).toBe(404);
    });

    test('should return 200 and a success message on successful account deletion', async () => {
      const userData = {
        username: 'mynewuser00000000000000000011111111111111',
        password: 'mypass'
      };
  
      // Log in to get a token first
      const response = await request(app)
        .delete('/api/users/delete')
        .send(userData);
        expect(response.status).toBe(200);
    });
});
