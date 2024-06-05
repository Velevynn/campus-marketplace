const s3 = require("./s3");

beforeEach(async () => {
	//Ensure clean testing folder before each test.
	await s3.deleteS3Folder("testing");
});

afterAll(async () => {
	//Cleanup after test suite runs.
	await s3.deleteS3Folder("testing");
});

describe("file upload", () => {
	test("Test successful file upload", async () => {
		const imageName = "testing/testImage";
		const imageData = "testimagedata";
		//Returns the AWS response which is the link to the uploaded file if success
		const response = await s3.uploadImageToS3(imageName, imageData);

		//Ensure link is reflective of uploaded file
		expect(response).toEqual(
			`https://haggleimgs.s3.amazonaws.com/${imageName}`
		);
	});

	test("Test unsuccessful file upload(null image data", async () => {
		const imageName = "testing/testImage";
		const imageData = null;
		await expect(s3.uploadImageToS3(imageName, imageData)).rejects.toThrow(
			"Invalid image data or name"
		);
	});

	test("Test unsuccessful file upload(null image data", async () => {
		const imageName = null;
		const imageData = "imagedata";
		await expect(s3.uploadImageToS3(imageName, imageData)).rejects.toThrow(
			"Invalid image data or name"
		);
	});
});

describe("object listing", () => {
	test("Test Successful listing of objects", async () => {
		//Upload testing file
		const imageName = "testing/testImage";
		const imageData = "testimagedata";
		await s3.uploadImageToS3(imageName, imageData);

		const testFiles = await s3.listS3Objects("testing");
		expect(testFiles.length === 1).toEqual(true);
	});

	test("Test listing objects in empty folder", async () => {
		const testFiles = await s3.listS3Objects("testing");
		expect(testFiles.length === 0).toEqual(true);
	});

	test("Test listing objects in root folder", async () => {
		const testFiles = await s3.listS3Objects("");
		expect(Array.isArray(testFiles)).toEqual(true);
	});
});

describe("image deletion", () => {
	test("Test successful image deletion", async () => {
		//Upload testing file
		const imageName = "testing/testImage";
		const imageData = "testimagedata";
		await s3.uploadImageToS3(imageName, imageData);

		//Delete the file
		await s3.deleteFromS3(imageName);

		//List all files in testing folder
		const testFiles = await s3.listS3Objects("testing");

		//Expect listed files to be empty
		expect(testFiles).toEqual([]);
	});

	test("Test deletion of non-existent image", async () => {
		await expect(
			s3.deleteFromS3("testing/nonExistentImage")
		).resolves.not.toThrow();
	});
});

describe("object renaming", () => {
	test("Test renaming s3 object", async () => {
		//Upload testing file
		const oldImageName = "testing/testImage";
		const imageData = "testimagedata";
		const newImageName = "testing/newImageName";
		await s3.uploadImageToS3(oldImageName, imageData);

		//Rename image
		await s3.renameS3Object(newImageName, oldImageName);

		//Get a list of all s3 objects in testing folder
		const testFiles = await s3.listS3Objects("testing");

		//Check if file was renamed and not just copied with a new name
		expect(testFiles.length).toEqual(1);

		//Check if file's key is the new image name
		expect(testFiles[0].Key).toEqual(newImageName);
	});

	test("Test renaming s3 object to the same name", async () => {
		const imageName = "testing/testImage";
		const imageData = "testimagedata";
		await s3.uploadImageToS3(imageName, imageData);
		await s3.renameS3Object(imageName, imageName);
		const testFiles = await s3.listS3Objects("testing");
		expect(testFiles.length).toEqual(1);
		expect(testFiles[0].Key).toEqual(imageName);
	});
});

describe("folder deletion", () => {
	test("Test successful folder deletion", async () => {
		const imageName1 = "testing/testImage1";
		const imageName2 = "testing/testImage2";
		const imageData = "testimagedata";
		await s3.uploadImageToS3(imageName1, imageData);
		await s3.uploadImageToS3(imageName2, imageData);
		await s3.deleteS3Folder("testing");
		const testFiles = await s3.listS3Objects("testing");
		expect(testFiles).toEqual([]);
	});

	test("Test deleting non-existent folder", async () => {
		await expect(
			s3.deleteS3Folder("nonExistentFolder")
		).resolves.not.toThrow();
	});
});
