// listingRoutes.test.js

// Import dependencies
const express = require("express");
const request = require("supertest");
const {Pool} = require("pg");
const {uploadImageToS3} = require("../util/s3");
const router = require("./listingRoutes");
const fs = require("fs");
const path = require("path");

// Mocks
jest.mock("../util/s3");
jest.mock("pg", () => {
	const {Client} = jest.requireActual("pg");
	return {
		Pool: jest.fn(() => ({
			query: jest.fn(),
			end: jest.fn()
		}))
	};
});




// Create a mock Express app
const app = express();
app.use(express.json());
app.use("/", router);

// Mock response for get requests
const mockListing =
    {
    listingID: '825',
    userID: '1060',
    title: "jimmy's laptop",
    price: '2000',
    description: 'really cool gaming laptop 2021 G15',
    postDate: '2024-03-17:57:26.776',
    expirationDate: null,
    bookmarkCount: null,
    quantity: '1',
    location: null
    }

// Mock image files
const mockFiles = [
	{
		fieldname: "image",
		originalname: "image1.jpg",
		encoding: "7bit",
		mimetype: "image/jpeg",
		buffer: fs.readFileSync(path.join(__dirname, "dummyImage1.jpg"))
	},
	{
		fieldname: "image",
		originalname: "image2.jpg",
		encoding: "7bit",
		mimetype: "image/jpeg",
		buffer: fs.readFileSync(path.join(__dirname, "dummyImage2.jpg"))
	}
	// Add more mock files as needed
];

// Mock error for failed queries
const mockError = new Error("Database error");

beforeEach(() => {
  // Reset the mocks before each test
  Pool.mockClear();
  Pool().query.mockClear();
  Pool().end.mockClear();
  uploadImageToS3.mockClear();
});



test('Posting a listing', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
      query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1 }] }),
      end: jest.fn()
  }));
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(),
    end: jest.fn()
  }));
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue(),
    end: jest.fn()
  }));

  const response = await request(app)
  .post('/')
  .field('userID', mockListing.userID)
  .field('title', mockListing.title)
  .field('price', mockListing.price)
  .field('description', mockListing.description)
  .field('quantity', mockListing.quantity)
  .attach(mockFiles[0].fieldname, mockFiles[0].buffer, mockFiles[0].originalname)
  .attach(mockFiles[1].fieldname, mockFiles[1].buffer, mockFiles[1].originalname)
  
  .expect(201);

  expect(uploadImageToS3).toHaveBeenCalledTimes(2); // Expect 2 images to be uploaded
});

test('Bookmarking a listing', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1 }] }),
    end: jest.fn()
  }));
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ result: [{ listingID: 1 }] }),
    end: jest.fn()
  }));

  const response = await request(app)
  .post(`/${mockListing.listingID}/bookmark`)
  .send({
    userID: mockListing.userID,
    listingID: mockListing.listingID,
    title: mockListing.title
  })

  
  .expect(201);

});

test('Get all listings without a query', async () => {
  const returnVal =  [{ listingID: 1}];
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1}] }),
    end: jest.fn()
  }));

  const response = await request(app)
  .get("/")
  .expect(200);

  expect(response.body).toEqual(returnVal);

});

test('Get all listings with query', async () => {
  const returnVal =  [{ listingID: 1}];
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1}] }),
    end: jest.fn()
  }));
  const q = "bruh";
  const page = 2;

  const response = await request(app)
  .get("/")
  .query({ q, page })
  .expect(200);

  expect(response.body).toEqual(returnVal);
});

test('Get my listings using userID', async () => {
  const returnVal =  [{ listingID: 1}];
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1}] }),
    end: jest.fn()
  }));


  const response = await request(app)
  .get(`/mylistings/${mockListing.userID}`)
  .expect(200);

  expect(response.body).toEqual(returnVal);
});


test('Get all images for a given listing', async () => {
  const returnVal =  [{ imageURL: "bruh"}];
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ imageURL: "bruh"}] }),
    end: jest.fn()
  }));

  const response = await request(app)
  .get(`/images/${mockListing.listingID}/`)
  .expect(200);

  expect(response.body).toEqual(returnVal);
});

test('Retrieving a single listing', async () => {
  const returnVal = [{ listingID: 1 }];
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1 }] }),
    end: jest.fn()
  }));

  const response = await request(app)
    .get(`/${mockListing.listingID}/`)
    .expect(200);

  expect(response.body).toEqual(returnVal);
});

test('Deleting a listing', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rowCount: 1 }), // Assuming successful deletion
    end: jest.fn()
  }));

  const response = await request(app)
    .delete(`/${mockListing.listingID}/`)
    .expect(204);
});

test('Deleting a non-existent listing', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rowCount: 0 }), // Assuming successful deletion
    end: jest.fn()
  }));

  const response = await request(app)
    .delete(`/${mockListing.listingID}/`)
    .expect(404);
});

test('Deleting a bookmark', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rowCount: 1 }), // Assuming successful deletion
    end: jest.fn()
  }));
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rowCount: 1 }), // Assuming successful decrement of bookmarkCount
    end: jest.fn()
  }));

  const response = await request(app)
    .delete(`/${mockListing.listingID}/bookmark/`)
    .query({ userID: mockListing.userID, listingID: mockListing.listingID })
    .expect(204);
});

test('Deleting a non-existent bookmark', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rowCount: 0 }), // Assuming successful deletion
    end: jest.fn()
  }));

  const response = await request(app)
    .delete(`/${mockListing.listingID}/bookmark/`)
    .query({ userID: mockListing.userID, listingID: mockListing.listingID })
    .expect(404);
});

test('Bookmark exists route', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ userID: mockListing.userID, listingID: mockListing.listingID }] }), // Assuming bookmark exists
    end: jest.fn()
  }));

  const response = await request(app)
    .get(`/${mockListing.listingID}/bookmark/`)
    .query({ userID: mockListing.userID, listingID: mockListing.listingID })
    .expect(200);
  expect(response.body).toEqual(true);
});

test('Bookmark doesnt exist route', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [] }), // Assuming bookmark exists
    end: jest.fn()
  }));

  const response = await request(app)
    .get(`/${mockListing.listingID}/bookmark/`)
    .query({ userID: mockListing.userID, listingID: mockListing.listingID })
    .expect(200);
  expect(response.body).toEqual(false);
});

test('Retrieving bookmarks for a user', async () => {
  const returnVal = [{ listingID: 1 }];
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rows: [{ listingID: 1 }] }),
    end: jest.fn()
  }));

  const response = await request(app)
    .get(`/bookmark/${mockListing.userID}`)
    .expect(200);

  expect(response.body).toEqual(returnVal);
});

test('Updating a listing', async () => {
  // Mock database queries
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({ rowCount: 1 }), // Assuming successful update
    end: jest.fn()
  }));

  const response = await request(app)
    .put(`/${mockListing.listingID}`)
    .send({
      title: mockListing.title,
      description: mockListing.description,
      price: mockListing.price,
      expirationDate: mockListing.expirationDate,
      quantity: mockListing.quantity,
      category: mockListing.category
    })
    .expect(200);
});

test('Updating listing images', async () => {
  // Mock database queries

  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockResolvedValue({}), // Mock delete call
    end: jest.fn()
  }));
  const response = await request(app)
    .put(`/images/${mockListing.listingID}`)
    .query({ imagesToRemove: ['https://example.com/image1', 'https://example.com/image2'] })
    .attach(mockFiles[0].fieldname, mockFiles[0].buffer, mockFiles[0].originalname)
    .attach(mockFiles[1].fieldname, mockFiles[1].buffer, mockFiles[1].originalname)
    .expect(201);
});

test('Error when posting a listing', async () => {
  // Mock database queries to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  const response = await request(app)
    .post('/')
    .field('userID', mockListing.userID)
    .field('title', mockListing.title)
    .field('price', mockListing.price)
    .field('description', mockListing.description)
    .field('quantity', mockListing.quantity)
    .attach(mockFiles[0].fieldname, mockFiles[0].buffer, mockFiles[0].originalname)
    .attach(mockFiles[1].fieldname, mockFiles[1].buffer, mockFiles[1].originalname)
    .expect(500);

  expect(response.body).toEqual({ error: "Failed to add listing" });
});

test('Error when bookmarking a listing', async () => {
  // Mock database queries to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  const response = await request(app)
    .post(`/${mockListing.listingID}/bookmark`)
    .send({
      userID: mockListing.userID,
      listingID: mockListing.listingID,
      title: mockListing.title
    })
    .expect(500);

  expect(response.body).toEqual({ error: "Failed to add bookmark." });
});

test('Error when retrieving all listings', async () => {
  // Mock database queries to throw an error
  Pool.mockImplementationOnce(() => ({
    query: jest.fn().mockRejectedValue(mockError),
    end: jest.fn()
  }));

  const response = await request(app)
    .get("/")
    .expect(500);

  expect(response.text).toBe("An error occurred while fetching listings");
});



