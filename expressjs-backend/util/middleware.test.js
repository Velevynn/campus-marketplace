// middleware.test.js
/* global test, expect, require, process, jest */

// Import dependencies
const jwt = require("jsonwebtoken");
const {verifyToken} = require("./middleware");

// Mock the response object
const mockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	return res;
};

test("verifyToken middleware - valid token", () => {
	// Mock request and response objects
	const req = {
		headers: {
			authorization: "Bearer validToken"
		}
	};
	const res = mockResponse();
	const next = jest.fn();

	// Mock jwt.verify
	jwt.verify = jest.fn().mockImplementation((token, secretKey, callback) => {
		callback(null, {userId: 1});
	});

	// Call the middleware
	verifyToken(req, res, next);

	// Expectations
	expect(jwt.verify).toHaveBeenCalledWith(
		"validToken",
		process.env.JWT_SECRET_KEY,
		expect.any(Function)
	);
	expect(next).toHaveBeenCalled();
	expect(req.user).toEqual({userId: 1});
	expect(res.status).not.toHaveBeenCalled();
	expect(res.send).not.toHaveBeenCalled();
});

test("verifyToken middleware - missing token", () => {
	// Mock request and response objects
	const req = {
		headers: {}
	};
	const res = mockResponse();
	const next = jest.fn();

	// Call the middleware
	verifyToken(req, res, next);

	// Expectations
	expect(next).not.toHaveBeenCalled();
	expect(res.status).toHaveBeenCalledWith(403);
	expect(res.send).toHaveBeenCalledWith({message: "Token is required"});
});

test("verifyToken middleware - invalid token", () => {
	// Mock request and response objects
	const req = {
		headers: {
			authorization: "Bearer invalidToken"
		}
	};
	const res = mockResponse();
	const next = jest.fn();

	// Mock jwt.verify to simulate invalid token
	jwt.verify = jest.fn().mockImplementation((token, secretKey, callback) => {
		callback(new Error("Invalid token"));
	});

	// Call the middleware
	verifyToken(req, res, next);

	// Expectations
	expect(jwt.verify).toHaveBeenCalledWith(
		"invalidToken",
		process.env.JWT_SECRET_KEY,
		expect.any(Function)
	);
	expect(next).not.toHaveBeenCalled();
	expect(res.status).toHaveBeenCalledWith(401);
	expect(res.send).toHaveBeenCalledWith({message: "Invalid Token"});
});
