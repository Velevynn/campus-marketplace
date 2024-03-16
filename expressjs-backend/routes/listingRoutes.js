// listingRoutes.js
const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const { Pool } = require('pg');
require('dotenv').config();

// Replace the following with your actual connection URI
const connectionString = process.env.DB_CONNECTION_STRING;

function createConnection() {
  const pool = new Pool({
    connectionString: connectionString,
  });
  return pool
}

const { uploadImageToS3 } = require('../util/s3');

router.post("/", upload.array('image'), async (req, res) => {
    try {
        console.log(req.body); // This will log information about other form fields
        console.log(req.files); // This will log information about uploaded files
    
        const listingToAdd = req.body;
        const images = req.files; // Get the uploaded images
    
        const listingID = await addListing(listingToAdd);
        await addImages(listingID, images.length);
    
        let i = 0;
        for (const image of images) {
          // Upload all images to s3 under folder named listingID
          // Images are labeled image0, image1, etc.
          const imageData = image.buffer;
          console.log(imageData);
          await uploadImageToS3(`${listingID}/image${i}`, image.buffer);
          i++;
        }
    
        res.status(201).send(listingToAdd);
      } catch (error) {
        console.error("Error adding listing:", error);
        res.status(500).json({ error: "Failed to add listing" });
      }
});

router.get("/", async (req, res) => {
    try {
        const { q } = req.query; // Extract the search query parameter


        let query = "SELECT * FROM listings";
    
        // If there is a search query, modify the SQL query to include a WHERE clause
        if (q) {
          query += ` WHERE "title" LIKE '%${q}%' OR "description" LIKE '%${q}%'`;
        }
        const connection = createConnection();
        const { rows } = await connection.query(query);
    
        res.send(rows);

      } catch (error) {
        console.error("An error occurred while fetching listings:", error);
        res.status(500).send("An error occurred while fetching listings");
      }
});

router.get("/:listingID/", async (req, res) => {
    try {
        const { listingID } = req.params; // Extract the listingID from request parameters
        // Construct SQL query to fetch the listing by its ID
        const connection = createConnection();
        const { rows } = await connection.query(
          'SELECT * FROM listings WHERE "listingID" =  $1 LIMIT 1',
          [listingID]
        );
        res.send(rows);
      } catch (error) {
        console.error("An error occurred while fetching the listing:", error);
        res.status(500).send("An error occurred while fetching the listing");
      }
});

router.get("/images/:listingID/", async (req, res) => {
  try {
      const { listingID } = req.params; // Extract the listingID from request parameters
      // Construct SQL query to fetch the listing by its ID
      const query = 'SELECT * FROM images WHERE "listingID" = $1 LIMIT 1'
      const connection = createConnection();
      const { rows } = await connection.query(query, [listingID]);
  
      res.send(rows);
  
      await connection.end();
    } catch (error) {
      console.error("An error occurred while fetching the images:", error);
      res.status(500).send("An error occurred while fetching the images");
    }
});

async function addImages(listingID, numImages) {
  try {
    const connection = createConnection();
    for (i = 0; i < numImages; i++) {
      await connection.query(
        'INSERT INTO images ("listingID", "imageURL") VALUES (?, ?)',
        [
          listingID,
          `https://haggleimgs.s3.amazonaws.com/${listingID}/image${i}`,
        ],
      );
    }
    //close connection to database;
    await connection.end();
  } catch (error) {
    console.error("An error occured while inserting images", error);
      throw error;
  }


}

async function addListing(listing) {
    try {
      if(listing.expirationDate === 'null') {
        listing.expirationDate = null;
      }
  
      //Insert the listing into the listing table
      const connection = createConnection();
      const { returnedID } = await connection.query(
        'INSERT INTO listings ("userID", title, price, description, "expirationDate", quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING "listingID"',
        [
          listing.userID,
          listing.title,
          listing.price,
          listing.description,
          listing.expirationDate,
          listing.quantity,
          // listing.location; NOT YET
        ],
      );
  
      const listingID = returnedID;
  
      //Close the connection to database
      await connection.end();
      //return success
      return listingID;
    } catch (error) {
      console.error("An error occured while posting this listing:", error);
      throw error;
    }
  }

module.exports = router;
