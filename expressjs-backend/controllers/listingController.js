const listingService = require('../services/listingService');

const addListing = async (req, res) => {
  try {
    const listingToAdd = req.body;
    const images = req.files;

    const listingID = await listingService.addListing(listingToAdd);

    for (const image of images) {
      const imageData = image.buffer;
      await uploadImageToS3(`${listingID}/image${i}`, image.buffer);
    }

    res.status(201).json({ message: 'Listing added successfully', listingID });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ error: "Failed to add listing" });
  }
};

const getListings = async (req, res) => {
  try {
    const { q } = req.query;

    const listings = await listingService.getListings(q);

    res.status(200).json(listings);
  } catch (error) {
    console.error("An error occurred while fetching listings:", error);
    res.status(500).json({ error: "An error occurred while fetching listings" });
  }
};

const getListingByID = async (req, res) => {
  try {
    const { listingID } = req.params;
    
    const listing = await listingService.getListingByID(listingID);

    res.status(200).json(listing);
  } catch (error) {
    console.error("An error occurred while fetching the listing:", error);
    res.status(500).json({ error: "An error occurred while fetching the listing" });
  }
};

module.exports = {
  addListing,
  getListings,
  getListingByID
};
