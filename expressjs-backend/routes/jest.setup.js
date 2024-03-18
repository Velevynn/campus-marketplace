const { app } = require('./app'); // Assuming your Express app is exported from 'app.js'
const supertest = require('supertest');

global.app = app;
global.request = supertest(app);