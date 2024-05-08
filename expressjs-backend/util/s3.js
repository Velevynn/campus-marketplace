// s3.js
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (imageName, imageData) => {
    const params = {
        Bucket: "haggleimgs",
        Key: imageName,
        Body: imageData
      };
    
      try {
        const data = await s3.upload(params).promise();
        console.log("Image uploaded successfully:", data.Location);
        return data.Location; // Return the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
};


const deleteFromS3 = async (name) => {
  const params = {
    Bucket: "haggleimgs", 
    Key: name
  };
  console.log("deleted: ", name);
  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting object: ', error);
    throw error;
  }
};

const deleteS3Folder = async (folderName) => {
  try {
    const images = await listS3Objects(folderName);
    console.log("images: ", images);
    // Must delete folder contents before able to delete folder
    for(const image of images) {
      await deleteFromS3(image.Key);
    }
    await deleteFromS3(folderName);

  } catch (error) {
    console.error('Error deleting folder: ', error);
    throw error;
  }


}

const renameS3Object = async (newImageName, oldImageName) => {
  if(newImageName == oldImageName) {
    // No need to rename if names are already same
    return;
  }

  const copyParams = {
    Bucket: "haggleimgs",
    CopySource: `haggleimgs/${oldImageName}`,
    Key: newImageName
  };

  // Copy the object with new name then delete old object
  try {
    await s3.copyObject(copyParams).promise();
  } catch (error) {
    console.error('Error renaming object:', error);
    throw error;
  }

  await deleteFromS3(oldImageName);


};

const listS3Objects = async (listingID) => {
  const listParams = {
    Bucket: "haggleimgs",
    Prefix: `${listingID}/`
  };
  
  // Call the listObjectsV2 method with the parameters
  try {
    const data = await s3.listObjectsV2(listParams).promise();
    return data.Contents;

  } catch (error) {
    console.error('Error listing objects:', error);
    throw error;
  }
};


module.exports = { s3, uploadImageToS3, deleteFromS3, renameS3Object, listS3Objects, deleteS3Folder };
