// listingRoutes.js
const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const { Pool } = require('pg');
const { uploadImageToS3 } = require('../util/s3');
require('dotenv').config();

const connectionString = process.env.DB_CONNECTION_STRING;

// Create connection pool to connect to the database.
function createConnection() {
  const pool = new Pool({
    connectionString: connectionString,
  });
  return pool
}

// Post listing and listing images to relevant databases.
router.post("/", upload.array('image'), async (req, res) => {
    try {
        // Access uploaded images.
        const images = req.files;
    
        // Add listing to the database, returning the new listingID.
        const listingID = await addListing(req.body);

        // Add images to the cloud database.
        await addImages(listingID, images.length);
    
        // Upload all images to s3 under folder named listingID.
        let i = 0;
        for (const image of images) {
          // Images are labeled image0, image1, etc.
          await uploadImageToS3(`${listingID}/image${i}`, image.buffer);
          i++;
        }

    
        res.status(201).send(listingToAdd);
      } 
      catch (error) {
        console.error("Error adding listing:", error);
        res.status(500).json({ error: "Failed to add listing" });
      }
});

// Retrieve listings, optionally according to query parameters.
router.get("/", async (req, res) => {
    try {
        // Extract the search query parameter
        const { q } = req.query;

        let query = "SELECT * FROM listings";
    
        // If there is a search query, modify the SQL query to include a WHERE clause
        if (q) {
          query += ` WHERE "title" LIKE '%${q}%' OR "description" LIKE '%${q}%'`;
        }

        const connection = createConnection();
        const { rows } = await connection.query(query);
        res.status(200).send(rows);
        await connection.end();
      }
      catch (error) {
        console.error("An error occurred while fetching listings:", error);
        res.status(500).send("An error occurred while fetching listings");
      }
});

// Retrieve listing details for given listingID.
router.get("/:listingID/", async (req, res) => {
    try {
        // Extract listingID from query parameters.
        const { listingID } = req.params;

        // Retrieve listing details from database if listing exists.
        const connection = createConnection();
        const { rows } = await connection.query(
          'SELECT * FROM listings WHERE "listingID" =  $1 LIMIT 1',
          [listingID]
        );

        await connection.end();
        res.status(200).send(rows);
        await connection.end();
      }
      catch (error) {
        console.error("An error occurred while fetching the listing:", error);
        res.status(500).send("An error occurred while fetching the listing");
      }
});

// Retrieve images for given listingID.
router.get("/images/:listingID/", async (req, res) => {
  try {
      // Extract the listingID from query parameters.
      const { listingID } = req.params;
      
      // Retrieve image list from database if listing exists.
      const connection = createConnection();
      const { rows } = await connection.query('SELECT * FROM images WHERE "listingID" = $1', 
        [listingID]
      );
      
      res.status(200).send(rows);
      await connection.end();
    } 
    catch (error) {
      console.error("An error occurred while fetching the images:", error);
      res.status(500).send("An error occurred while fetching the images");
    }
});

// Function to add one or multiple images to database.
async function addImages(listingID, numImages) {
  try {
    const connection = createConnection();

    // Insert each image into the database, one at a time.
    for (i = 0; i < numImages; i++) {
      await connection.query(
        'INSERT INTO images ("listingID", "imageURL") VALUES ($1, $2)',
        [
          listingID,
          `https://haggleimgs.s3.amazonaws.com/${listingID}/image${i}`,
        ],
      );
    }
    
    await connection.end();
  }
  catch (error) {
    console.error("An error occured while inserting images", error);
    throw error;
  }
}

// Function to add listing to the database.
async function addListing(listing) {
    try {
      // Set expirationDate to null if string null is passed in.
      if(listing.expirationDate === 'null') {
        listing.expirationDate = null;
      }

      // Insert listing details into database, returning the new listingID.
      const connection = createConnection();
      const { rows } = await connection.query(
        'INSERT INTO listings ("userID", title, price, description, "expirationDate", quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING "listingID"',
        [
          listing.userID,
          listing.title,
          listing.price,
          listing.description,
          listing.expirationDate,
          listing.quantity,
        ],
      );

      // Retrieve new listingID.
      const listingID = rows[0].listingID;

      await connection.end();
      return listingID;
    }
    catch (error) {
      console.error("An error occured while posting this listing:", error);
      throw error;
    }
  }

module.exports = router;