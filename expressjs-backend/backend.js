const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const { setupDatabase } = require('./util/database');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);  // user-related routes are in listingRoutes.js
app.use('/listings', listingRoutes);  // listing-related routes are handled in userRoutes.js

setupDatabase();  // run database

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});  // listen on PORT 8000
