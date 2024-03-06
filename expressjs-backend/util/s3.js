// s3.js

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAYS2NQRDT7Z6MINKF',
  secretAccessKey: '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',
  region: 'us-east-1'
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
