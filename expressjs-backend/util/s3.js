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
        Bucket: 'haggleimgs',
        Key: imageName,
        Body: imageData
      };
    
      try {
        const data = await s3.upload(params).promise();
        console.log('Image uploaded successfully:', data.Location);
        return data.Location; // Return the URL of the uploaded image
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
};

module.exports = { s3, uploadImageToS3 };
