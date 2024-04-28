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
    
        res.status(201).send(req.body);
      } 
      catch (error) {
        console.error("Error adding listing:", error);
        res.status(500).json({ error: "Failed to add listing" });
      }
});

// Bookmark a listing.
router.post("/:listingID/bookmark/", async (req, res) => {
  console.log("Received body when bookmarking listing: ", req.body);
  console.log(".userID: ", req.body.userID);
  console.log(".listingID", req.body.listingID);
  console.log(".title", req.body.title);
  try {
    // Add new relationship to bookmark table.
    await addBookmark(req.body.userID, req.body.listingID, req.body.title);
    res.status(201).send
  }
  catch (error) {
    console.error("Error adding bookmark: ", error);
    res.status(500).json({ error: "Failed to add bookmark." });
  }
});


// Retrieve listings with pagination and optional query parameters
router.get("/", async (req, res) => {
  try {
    const { q, page } = req.query;
    const itemsPerPage = 30; // Define how many items to return per page

    let query = "SELECT * FROM listings";

    // If there is a search query, modify the SQL query to include a WHERE clause
    if (q) {
      query += ` WHERE "title" LIKE '%${q}%' OR "description" LIKE '%${q}%'`;
    }

    // Calculate offset based on the requested page
    const offset = (page - 1) * itemsPerPage;

    // Append LIMIT and OFFSET to the query for pagination
    query += ` LIMIT ${itemsPerPage} OFFSET ${offset}`;

    const connection = createConnection();
    const { rows } = await connection.query(query);
    res.status(200).send(rows);
    await connection.end();
  } catch (error) {
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
        res.status(200).send(rows);
        await connection.end();
      }
      catch (error) {
        console.error("An error occurred while fetching the listing:", error);
        res.status(500).send("An error occurred while fetching the listing");
      }
});

router.delete("/:listingID/", async (req, res) => {
  try {
      // Extract listingID from query parameters.
      const { listingID } = req.params;

      // Retrieve listing details from database if listing exists.
      const connection = createConnection();
      const result = await connection.query(
        'DELETE FROM listings WHERE "listingID" =  $1',
        [listingID]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).send("Listing not found");
      }

      res.status(204).send(); // successful delete
      await connection.end();
    }
    catch (error) {
      console.error("An error occurred while deleting the listing:", error);
      res.status(500).send("An error occurred while deleting the listing");
    }
});

router.delete("/:listingID/bookmark/", async (req, res) => {
  console.log("Delete bookmark paramaters:", req.query)

  try {
    const connection = createConnection();
    const result = await connection.query(
      'DELETE FROM bookmarks WHERE "userID" = $1 AND "listingID" = $2',
      [req.query.userID, req.query.listingID]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Bookmark not found.");
    }

    // Successful deletion.
    res.status(204).send();
  }
  catch (error) {
    console.error("An error occurred while deleting the bookmark: ", error);
    res.status(500).send("An error occurred while deleting the listing.");
  }
})


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

// TODO: Add route for checking if a bookmark exists or not.
// Check if a bookmark exists between a user and listing.
router.get("/:listingID/bookmark/", async (req, res) => {
  console.log("Get bookmark parameters:", req.query);

  try {
    const connection = createConnection();
    const { rows } = await connection.query('SELECT * FROM bookmarks WHERE "userID" = $1 AND "listingID" = $2',
      [
        req.query.userID,
        req.query.listingID
      ])

    console.log("Returned rows from select call in bookmark backend.")
    if ( rows.length > 0 ) {
      const bookmarked = true;
      res.status(200).send(bookmarked);
    }
    else {
      const bookmarked = false;
      res.status(204).send(bookmarked);
    }
    await connection.end();
  }
  catch (error) {
    console.error("An error occurred while checking for a bookmark: ", error);
    res.status(500).send("An error occurred while checking for a bookmark.");
  }
})

router.get("/bookmark/:userID", async (req, res) => {
  console.log("Get bookmark parameters:", req.params);

  try {
    const connection = createConnection();
    const { rows } = await connection.query('SELECT * FROM bookmarks WHERE "userID" = $1',
      [
        req.params.userID
      ]);

    console.log("Returned the bookmarks belonging to a particular user")
    res.status(200).send(rows);
    await connection.end();
  }
  catch (error) {
    console.error("An error occurred while checking for a bookmark: ", error);
    res.status(500).send("An error occurred while checking for a bookmark.");
  }
})

// Retrieve listings for given userID.
router.get("/:userID", async (req, res) => {
  try {
      // Retrieve image list from database if listing exists.
      const connection = createConnection();
      const { rows } = await connection.query('SELECT * FROM listings WHERE "userID" = $1', 
        [
          req.params.userID
        ]);
      
      res.status(200).send(rows);
      await connection.end();
    } 
    catch (error) {
      console.error("An error occurred while fetching the images:", error);
      res.status(500).send("An error occurred while fetching the images");
    }
});

router.put("/:listingID", async (req, res) => {
  try {
    const { listingID } = req.params;
    const { title, description, price, expirationDate, quantity } = req.body;

    if (!title || !price) {
      return res.status(400).send("Title and price are required for updating the listing.");
    }

    const connection = createConnection();
    const result = await connection.query(
      `UPDATE listings 
       SET "title" = $1, 
           "description" = $2, 
           "price" = $3, 
           "expirationDate" = $4, 
           "quantity" = $5
       WHERE "listingID" = $6`,
      [title, description, price, expirationDate, quantity, listingID]
    );

    // Check if the listing was updated successfully.
    if (result.rowCount === 0) {
      await connection.end();
      return res.status(404).send("Listing not found");
    }
    res.status(200).send("Listing updated successfully");
    await connection.end();
  } catch (error) {
    console.error("An error occurred while updating the listing:", error);
    res.status(500).send("An error occurred while updating the listing");
  }
});

router.put("/images/:listingID", upload.array('image'), async (req, res) => {
  try {
    const { listingID } = req.params;
    const images = req.files;

    const connection = createConnection();
    /*
    // Delete existing images associated with the listingID
    await connection.query(
      `DELETE FROM images WHERE "listingID" = $1`,
      [listingID]
    );
      */
    // Insert new images into the database using addImages function
    await addImages(listingID, images.length);

  
    // Upload all images to S3 under a folder named after the listingID
    let i = 0;
    for (const image of images) {
      // Images are labeled image0, image1, etc.
      await uploadImageToS3(`${listingID}/image${i}`, image.buffer);
      i++;
    }

    // Send success response
    res.status(201).send(req.body);
  } catch (error) {
    console.error("An error occurred while updating listing images:", error);
    res.status(500).send("An error occurred while updating listing images");
  }
});

router.delete("/images/:listingID/:imageURL", async (req, res) => {
  try {
    const { listingID, imageURL } = req.params;

    const connection = createConnection();

    await connection.query(
      `DELETE FROM images WHERE "listingID" = $1 AND "imageURL" = $2`,
      [listingID, imageURL]
    );

    res.status(200).send("Image deleted successfully");
  } catch (error) {
    console.error("An error occurred while deleting image:", error);
    res.status(500).send("An error occurred while deleting image");
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
          `https://haggleimgs.s3.amazonaws.com/${listingID}/image${i}?rand=${Math.floor(Math.random()*100000)}`,
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

// Function to bookmark a listing.
async function addBookmark(userID, listingID, title) {
  try {
    const connection = createConnection();
    const { rows } = await connection.query(
      'INSERT INTO bookmarks ("userID", "listingID", title) VALUES ($1, $2, $3)',
      [
        userID,
        listingID,
        title,
      ]
    )

    await connection.end();
    return;
  }
  catch (error) {
    console.error("An error occured while bookmarking this listing:", error);
    throw error;
  }
}





module.exports = router;