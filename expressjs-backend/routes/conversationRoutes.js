const express = require("express");
const router = express.Router();
const {Pool} = require("pg");
require("dotenv").config();

const connectionString = process.env.DB_CONNECTION_STRING; // stores supabase db connection string, allowing us to connect to supabase db

const secretKey = process.env.JWT_SECRET_KEY; // stores jwt secret key

function createConnection() {
	// Pool is a cache of database connections. Allows pre-established connections to be reused instead of constantly opening/closing connections
	const pool = new Pool({
		connectionString: connectionString
	});
	return pool;
}

router.post("/create", async (req, res) => {
    const { userID, otherID } = req.body;
    try {
        if (!userID || !otherID) {
            res.status(400).json({ error: "Missing userID or otherID" });
            return;
        }
        
        const connection = createConnection();

        const result = await connection.query(
            "INSERT INTO conversations (\"userID\", \"otherID\") VALUES ($1, $2)",
            [userID, otherID]
        );

        await connection.end();
        res.status(201).json({ message: "Conversation added successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to add conversation" });
    }
});

router.get("/:userID/", async (req, res) => {
	try {
		// Extract userID from query parameters.
		const {userID} = req.params;

		// Retrieve user details from database if user exists.
		const connection = createConnection();
		const {rows} = await connection.query(
			"SELECT * FROM conversations WHERE \"userID\" =  $1 OR \"otherID\" = $1",
			[userID]
		);
		res.status(200).send(rows);
		await connection.end();
	} catch (error) {
		console.error("An error occurred while fetching the user:", error);
		res.status(500).send("An error occurred while fetching the user");
	}
});

module.exports = router;