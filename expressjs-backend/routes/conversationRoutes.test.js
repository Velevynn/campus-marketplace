/* eslint-env jest */

const express = require("express");
const request = require("supertest");
const {Pool} = require("pg");
const router = require("./conversationRoutes");

// Mock Pool and its methods
jest.mock("pg", () => {
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

describe("Conversation Routes Tests", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe("POST /create", () => {
		const mockRequestBody = {
			userID: "user123",
			otherID: "other123",
			listingID: "listing123",
			offer: "offer123"
		};

		const mockExistingConversation = {
			rows: [
				{
					userID: "user123",
					otherID: "other123",
					listingID: "listing123",
					offer: "offer123"
				}
			]
		};

		const mockNewConversation = {
			rows: []
		};

		test("should create a new conversation successfully", async () => {
			Pool.mockImplementationOnce(() => ({
				query: jest
					.fn()
					.mockResolvedValueOnce(mockNewConversation) // First call for checking existing conversation
					.mockResolvedValueOnce({}), // Second call for inserting new conversation
				end: jest.fn()
			}));

			const response = await request(app)
				.post("/create")
				.send(mockRequestBody)
				.expect(200);

			expect(response.body).toEqual({
				message: "Conversation added successfully"
			});
		});

		test("should return error for missing parameters", async () => {
			const response = await request(app)
				.post("/create")
				.send({userID: "user123"}) // Missing otherID and listingID
				.expect(400);

			expect(response.body).toEqual({
				error: "Missing userID, otherID, and/or listingID"
			});
		});

		test("should return 200 if conversation already exists", async () => {
			Pool.mockImplementationOnce(() => ({
				query: jest
					.fn()
					.mockResolvedValueOnce(mockExistingConversation),
				end: jest.fn()
			}));

			const response = await request(app)
				.post("/create")
				.send(mockRequestBody)
				.expect(200);

			expect(response.body).toEqual({
				message: "Conversation already exists"
			});
		});

		test("should handle database error during creation", async () => {
			Pool.mockImplementationOnce(() => ({
				query: jest.fn().mockRejectedValue(new Error("Database error")),
				end: jest.fn()
			}));

			const response = await request(app)
				.post("/create")
				.send(mockRequestBody)
				.expect(500);

			expect(response.body).toEqual({
				error: "Failed to add conversation"
			});
		});
	});

	describe("GET /:userID/", () => {
		const mockUserID = "user123";
		const mockConversations = {
			rows: [
				{
					userID: "user123",
					otherID: "other123",
					listingID: "listing123",
					offer: "offer123"
				}
			]
		};

		test("should fetch conversations for a user successfully", async () => {
			Pool.mockImplementationOnce(() => ({
				query: jest.fn().mockResolvedValue(mockConversations),
				end: jest.fn()
			}));

			const response = await request(app)
				.get(`/${mockUserID}/`)
				.expect(200);

			expect(response.body).toEqual(mockConversations.rows);
		});

		test("should handle database error during fetching", async () => {
			Pool.mockImplementationOnce(() => ({
				query: jest.fn().mockRejectedValue(new Error("Database error")),
				end: jest.fn()
			}));

			const response = await request(app)
				.get(`/${mockUserID}/`)
				.expect(500);

			expect(response.text).toEqual(
				"An error occurred while fetching the user"
			);
		});
	});
});
