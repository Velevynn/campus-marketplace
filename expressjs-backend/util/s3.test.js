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
		expect(response).toEqual(`https://haggleimgs.s3.amazonaws.com/${imageName}`);
	});


	test("Test unsuccessful file upload(null image data", async () => {
		const imageName = "testing/testImage";
		const imageData = null;
		await expect(s3.uploadImageToS3(imageName, imageData)).rejects.toThrow();
	});

	test("Test unsuccessful file upload(null image data", async () => {
		const imageName = null;
		const imageData = "imagedata";
		await expect(s3.uploadImageToS3(imageName, imageData)).rejects.toThrow();
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

});
