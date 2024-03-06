const db = require('../utils/database');

const addListing = async (listing) => {
  try {
    const connection = await db.getConnection();

    if(listing.expirationDate === 'null') {
      listing.expirationDate = null;
    }

    // Insert the listing into the listing table
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

    // Close the connection to database
    await db.closeConnection(connection);

    // Return success
    return listingID;
  } catch (error) {
    console.error("An error occurred while posting this listing:", error);
    throw error;
  }
};

const getListings = async (searchQuery) => {
  try {
    const connection = await db.getConnection();
    let query = "SELECT * FROM listings";

    // If there is a search query, modify the SQL query to include a WHERE clause
    if (searchQuery) {
      query += ` WHERE title LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%'`;
    }

    const [results, fields] = await connection.execute(query);

    // Close the connection to database
    await db.closeConnection(connection);

    return results;
  } catch (error) {
    console.error("An error occurred while fetching listings:", error);
    throw error;
  }
};

const getListingByID = async (listingID) => {
  try {
    const connection = await db.getConnection();
    // Construct SQL query to fetch the listing by its ID
    const query = "SELECT * FROM listings WHERE listingID = ?";
    const [results, fields] = await connection.execute(query, [listingID]);

    // Close the connection to database
    await db.closeConnection(connection);

    return results;
  } catch (error) {
    console.error("An error occurred while fetching the listing:", error);
    throw error;
  }
};

module.exports = {
  addListing,
  getListings,
  getListingByID
};
