// listingRoutes.js
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const { dbConfig } = require('../util/database');
const { uploadImageToS3 } = require('../util/s3');

router.post("/", upload.array('image'), async (req, res) => {
    try {
        console.log(req.body); // This will log information about other form fields
        console.log(req.files); // This will log information about uploaded files
    
        const listingToAdd = req.body;
        const images = req.files; // Get the uploaded images
    
        const listingID = await addListing(listingToAdd);
    
    
        for (const image of images) {
          let i = 0;
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

        const connection = await mysql.createConnection(dbConfig);

        let query = "SELECT * FROM listings";
    
        // If there is a search query, modify the SQL query to include a WHERE clause
        if (q) {
          query += ` WHERE title LIKE '%${q}%' OR description LIKE '%${q}%'`;
        }
    
        const [results, fields] = await connection.execute(query);
    
        res.send(results);

        await connection.end();
      } catch (error) {
        console.error("An error occurred while fetching listings:", error);
        res.status(500).send("An error occurred while fetching listings");
      }
});

router.get("/:listingID", async (req, res) => {
    try {
        const { listingID } = req.params; // Extract the listingID from request parameters
        const connection = await mysql.createConnection(dbConfig);
        // Construct SQL query to fetch the listing by its ID
        const query = "SELECT * FROM listings WHERE listingID = ?";
        const [results, fields] = await connection.execute(query, [listingID]);
    
        res.send(results);
    
        await connection.end();
      } catch (error) {
        console.error("An error occurred while fetching the listing:", error);
        res.status(500).send("An error occurred while fetching the listing");
      }
});

async function addListing(listing) {
    try {
      const connection = await mysql.createConnection(dbConfig);
  
      if(listing.expirationDate === 'null') {
        listing.expirationDate = null;
      }
  
      //Insert the listing into the listing table
      const [result] = await connection.execute(
        "INSERT INTO listings (userID, title, price, description, expirationDate, quantity) VALUES (?, ?, ?, ?, ?, ?)",
        [
          listing.userID,
          listing.title,
          listing.price,
          listing.description,
          listing.expirationDate,
          listing.quantity,
        ],
      );
  
      const listingID = result.insertId;
  
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
