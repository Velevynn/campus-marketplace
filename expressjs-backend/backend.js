const express = require('express');

const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: 'localhost:3000',
}));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/users', userRoutes);  // user-related routes are in listingRoutes.js
app.use('/listings', listingRoutes);  // listing-related routes are handled in userRoutes.js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});  // listen on PORT 8000
