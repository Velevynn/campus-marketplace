// app.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { setupDatabase } = require('./util/database');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');

const app = express();
const PORT = 8000;

setupDatabase();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/listings', listingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
