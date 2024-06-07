const express = require("express");

const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
var cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes); // user-related routes are in userRoutes.js
app.use("/listings", listingRoutes); // listing-related routes are handled in listingRoutes.js
app.use("/conversations", conversationRoutes); 
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
