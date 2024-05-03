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

const deleteFromS3 = async (imageName) => {
  const params = {
    Bucket: "haggleimgs", 
    Key: imageName
  };

  await s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Error deleting object:', err);
    } else {
      console.log('Object deleted successfully:', data);
    }
  }).promise();

};

const renameS3Object = async (newImageName, oldImageName) => {
  const copyParams = {
    Bucket: "haggleimgs",
    CopySource: `haggleimgs/${oldImageName}`,
    Key: newImageName
  };
  
  s3.copyObject(copyParams, (err, data) => {
    if (err) {
      console.error('Error copying object:', err);
    } else {
      console.log('Object copied successfully:', data);
      
      // Delete the original object
      const deleteParams = {
        Bucket: "haggleimgs",
        Key: oldImageName
      };
  
      s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
          console.error('Error deleting original object:', err);
        } else {
          console.log('Original object deleted successfully:', data);
        }
      });
    }
  });
};

const listS3Objects = async (listingID) => {
  const listParams = {
    Bucket: "haggleimgs",
    Prefix: `${listingID}/`
  };
  
  // Call the listObjectsV2 method with the parameters
  await s3.listObjectsV2(listParams, (err, data) => {
    if (err) {
      console.error('Error listing objects:', err);
    } else {
      console.log("data contents: ", data.Contents);
      return data.Contents;
    }
  }).promise();
};


module.exports = { s3, uploadImageToS3, deleteFromS3, renameS3Object, listS3Objects };
